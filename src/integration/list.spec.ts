import { Location } from '@angular/common';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { clearStorage } from '@testing/helpers/clean-storage';
import { setAuthToken } from '@testing/helpers/set-auth-token';
import { TestHelper } from '@testing/helpers/test-helper';
import { appConfig } from 'src/app/app.config';
import { Task, TaskWithoutId } from 'src/app/shared/interfaces/task.interface';

describe('Fluxo de listagem', () => {
  let httpTestingControler: HttpTestingController;
  let testHelper: TestHelper<unknown>;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    setAuthToken();

    const testConfig: ApplicationConfig = {
      providers: provideHttpClientTesting(),
    };

    const { providers } = mergeApplicationConfig(appConfig, testConfig);

    TestBed.configureTestingModule({
      providers,
    });

    httpTestingControler = TestBed.inject(HttpTestingController);

    harness = await RouterTestingHarness.create('');

    testHelper = new TestHelper(harness.fixture);
  });

  afterEach(() => {
    clearStorage();
    httpTestingControler.verify();
  });

  it('Não deve renderizar itens quando não existir tarefas', async () => {
    const resquest = httpTestingControler.expectOne('/api/tasks');

    resquest.flush([]);

    harness.detectChanges();

    expect(testHelper.queryAllByTestId('todo-list-item')).toHaveLength(0);
    expect(testHelper.queryAllByTestId('completed-list-item')).toHaveLength(0);

    const todoListNoItemsMessageDebugEl = testHelper.queryByTestId(
      'no-items-message',
      testHelper.queryByTestId('todo-list')
    );
    expect(todoListNoItemsMessageDebugEl).toBeTruthy();

    const completedListNoItemsMessageDebugEl = testHelper.queryByTestId(
      'no-items-message',
      testHelper.queryByTestId('completed-list')
    );
    expect(completedListNoItemsMessageDebugEl).toBeTruthy();
  });

  it('Deve renderizar 2 tarefas pendentes e uma concluída', async () => {
    const resquest = httpTestingControler.expectOne('/api/tasks');

    resquest.flush([
      { id: '1', title: 'Item 1', completed: false },
      { id: '2', title: 'Item 2', completed: false },
      { id: '3', title: 'Item 3', completed: true },
    ]);

    harness.detectChanges();

    expect(testHelper.queryAllByTestId('todo-list-item')).toHaveLength(2);
    expect(testHelper.queryAllByTestId('completed-list-item')).toHaveLength(1);

    const todoListNoItemsMessageDebugEl = testHelper.queryByTestId(
      'app-no-items',
      testHelper.queryByTestId('todo-list')
    );
    expect(todoListNoItemsMessageDebugEl).toBeNull();

    const completedListNoItemsMessageDebugEl = testHelper.queryByTestId(
      'completed-list',
      testHelper.queryByTestId('todo-list')
    );
    expect(completedListNoItemsMessageDebugEl).toBeNull();
  });

  it('Deve criar uma tarefa', fakeAsync(() => {
    const getAllTasksResquest = httpTestingControler.expectOne('/api/tasks');
    getAllTasksResquest.flush([]);

    testHelper.click('list-create-task');

    tick();

    const location = TestBed.inject(Location);
    expect(location.path()).toBe('/create');

    harness.detectChanges();

    const fakeTaskTitle = 'Fake Task Title';

    testHelper.triggerInputEvent('create-task-title', fakeTaskTitle);

    testHelper.submitForm('create-task-form');

    const createTasksRequest = httpTestingControler.expectOne({
      method: 'POST',
      url: '/api/tasks/',
    });

    const fakeTask = {
      title: fakeTaskTitle,
      completed: false,
    };

    expect(createTasksRequest.request.body).toEqual(fakeTask);

    createTasksRequest.flush(fakeTask);

    tick();

    expect(location.path()).toBe('');
  }));

  describe('Deve editar uma tarefa', () => {
    function expectEditTask({
      taskState,
      listItemTestId,
    }: {
      taskState: boolean;
      listItemTestId: string;
    }) {
      const fakeTask = { id: '1', title: 'Item 1', completed: taskState };

      const getAllTasksResquest = httpTestingControler.expectOne('/api/tasks');
      getAllTasksResquest.flush([fakeTask]);

      harness.detectChanges();

      testHelper.click(
        'list-item-edit-action',
        testHelper.queryByTestId(listItemTestId)
      );

      tick();

      const getByTaskIdRequest = httpTestingControler.expectOne({
        method: 'GET',
        url: `/api/tasks/${fakeTask.id}`,
      });

      getByTaskIdRequest.flush(fakeTask);

      tick();

      const location = TestBed.inject(Location);
      expect(location.path()).toBe(`/edit/${fakeTask.id}`);

      harness.detectChanges();

      expect(testHelper.getInputValue('edit-task-title')).toBe(fakeTask.title);
      expect(testHelper.isCheckboxChecked('edit-task-completed')).toBe(
        fakeTask.completed
      );

      const fakeEditedTask: TaskWithoutId = {
        title: 'Item 1 - Editado',
        completed: true,
      };

      testHelper.triggerInputEvent('edit-task-title', fakeEditedTask.title);
      testHelper.changeCheckbox(
        'edit-task-completed',
        fakeEditedTask.completed
      );

      testHelper.submitForm('edit-task-form');

      const editTaskRequest = httpTestingControler.expectOne({
        method: 'PUT',
        url: `/api/tasks/${fakeTask.id}`,
      });

      expect(editTaskRequest.request.body).toEqual(fakeEditedTask);

      const taskResponse: Task = {
        ...fakeTask,
        ...fakeEditedTask,
      };

      editTaskRequest.flush(taskResponse);

      tick();

      expect(location.path()).toBe('');
    }

    it('Quando estiver pendente', fakeAsync(() => {
      expectEditTask({
        taskState: false,
        listItemTestId: 'todo-list-item',
      });
    }));

    it('Quando estiver concluída', fakeAsync(() => {
      expectEditTask({
        taskState: true,
        listItemTestId: 'completed-list-item',
      });
    }));
  });

  describe('Deve remover uma tarefa', () => {
    interface ExpectRemoveTaskParams {
      taskState: boolean;
      listItemTestId: string;
      listTestId: string;
    }

    function expectRemoveTask({
      taskState,
      listItemTestId,
      listTestId,
    }: ExpectRemoveTaskParams) {
      const fakeTask: Task = { id: '1', title: 'Item 1', completed: taskState };

      const getAllTasksRequest = httpTestingControler.expectOne('/api/tasks');
      getAllTasksRequest.flush([fakeTask]);

      harness.detectChanges();

      testHelper.click(
        'list-item-remove-action',
        testHelper.queryByTestId(listItemTestId)
      );

      const removeTaskRequest = httpTestingControler.expectOne({
        method: 'DELETE',
        url: `/api/tasks/${fakeTask.id}`,
      });

      removeTaskRequest.flush(fakeTask);

      harness.detectChanges();

      expect(testHelper.queryByTestId(listItemTestId)).toBeNull();
      expect(
        testHelper.queryByTestId(
          'no-items-message',
          testHelper.queryByTestId(listTestId)
        )
      ).toBeTruthy();
    }

    it('Quando a tarefa estiver pendente', fakeAsync(() => {
      expectRemoveTask({
        taskState: false,
        listItemTestId: 'todo-list-item',
        listTestId: 'todo-list',
      });
    }));

    it('Quando a tarefa estiver concluída', fakeAsync(() => {
      expectRemoveTask({
        taskState: true,
        listItemTestId: 'completed-list-item',
        listTestId: 'completed-list',
      });
    }));

    it('Deve completar uma tarefa', () => {
      const fakeTask: Task = { id: '1', title: 'Item 1', completed: false };

      const getAllTasksRequest = httpTestingControler.expectOne('/api/tasks');
      getAllTasksRequest.flush([fakeTask]);

      harness.detectChanges();

      expect(testHelper.queryByTestId('completed-list-item')).toBeNull();
      expect(testHelper.queryByTestId('todo-list-item')).toBeTruthy();

      testHelper.click('list-item-complete-action');

      const completeTaskRequest = httpTestingControler.expectOne({
        method: 'PATCH',
        url: `/api/tasks/${fakeTask.id}`,
      });

      expect(completeTaskRequest.request.body).toEqual({ completed: true });

      const fakeTaskResponse: Task = { ...fakeTask, completed: true };

      completeTaskRequest.flush(fakeTaskResponse);

      harness.detectChanges();

      expect(testHelper.queryByTestId('completed-list-item')).toBeTruthy();
      expect(testHelper.queryByTestId('todo-list-item')).toBeNull();
    });

    it('Deve descompletar uma tarefa', () => {
      const fakeTask: Task = { id: '1', title: 'Item 1', completed: true };

      const getAllTasksRequest = httpTestingControler.expectOne('/api/tasks');
      getAllTasksRequest.flush([fakeTask]);

      harness.detectChanges();

      expect(testHelper.queryByTestId('completed-list-item')).toBeTruthy();
      expect(testHelper.queryByTestId('todo-list-item')).toBeNull();

      testHelper.click('list-item-mark-as-pending-action');

      const todoTaskRequest = httpTestingControler.expectOne({
        method: 'PATCH',
        url: `/api/tasks/${fakeTask.id}`,
      });

      expect(todoTaskRequest.request.body).toEqual({ completed: false });

      const fakeTaskResponse: Task = { ...fakeTask, completed: false };

      todoTaskRequest.flush(fakeTaskResponse);

      harness.detectChanges();

      expect(testHelper.queryByTestId('completed-list-item')).toBeNull();
      expect(testHelper.queryByTestId('todo-list-item')).toBeTruthy();
    });
  });
});
