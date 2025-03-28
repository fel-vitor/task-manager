import { Location } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TestHelper } from '@testing/helpers/test-helper';
import { FakeListItemComponent } from '@testing/mocks/fake-list-item.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { Task } from 'src/app/shared/interfaces/task.interface';
import { TasksService } from 'src/app/shared/services/tasks/tasks.service';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { ListItemComponent } from './list-item/list-item.component';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let fixture: ComponentFixture<ListComponent>;
  let tasksService: TasksService;
  let testHelper: TestHelper<ListComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        MockProvider(TasksService),
        provideRouter([
          {
            path: 'create',
            component: MockComponent(ListComponent),
          },
          {
            path: 'edit/:id',
            component: MockComponent(EditTaskComponent),
          },
        ]),
      ],
    });

    TestBed.overrideComponent(ListComponent, {
      remove: {
        imports: [ListItemComponent],
      },
      add: {
        imports: [MockComponent(ListItemComponent)],
      },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    testHelper = new TestHelper(fixture);

    tasksService = TestBed.inject(TasksService);
  });

  it('Deve listar as tarefas', () => {
    (tasksService.getAll as jest.Mock).mockReturnValue(
      of([
        { title: 'Item 1', completed: false },
        { title: 'Item 2', completed: false },
        { title: 'Item 3', completed: false },
        { title: 'Item 4', completed: true },
        { title: 'Item 5', completed: true },
        { title: 'Item 6', completed: true },
      ])
    );

    fixture.detectChanges();

    const todoSection = fixture.debugElement.query(
      By.css('[data-testid="todo-list"]')
    );

    expect(todoSection).toBeTruthy();

    const todoItems = todoSection.queryAll(
      By.css('[data-testid="todo-list-item"]')
    );

    expect(todoItems.length).toBe(3);

    expect(todoItems[0].componentInstance.task).toEqual({
      title: 'Item 1',
      completed: false,
    });
    expect(todoItems[1].componentInstance.task).toEqual({
      title: 'Item 2',
      completed: false,
    });
    expect(todoItems[2].componentInstance.task).toEqual({
      title: 'Item 3',
      completed: false,
    });

    const completedSection = fixture.debugElement.query(
      By.css('[data-testid="completed-list"]')
    );

    expect(completedSection).toBeTruthy();

    const completedItems = completedSection.queryAll(
      By.css('[data-testid="completed-list-item"]')
    );

    expect(completedItems.length).toBe(3);

    expect(completedItems[0].componentInstance.task).toEqual({
      title: 'Item 4',
      completed: true,
    });
    expect(completedItems[1].componentInstance.task).toEqual({
      title: 'Item 5',
      completed: true,
    });
    expect(completedItems[2].componentInstance.task).toEqual({
      title: 'Item 6',
      completed: true,
    });
  });

  describe('Quando a tarefa está pendente', () => {
    it('Deve completar uma tarefa', () => {
      const fakeTask: Task = { id: '1', title: 'Item 1', completed: false };

      const fakeTasks: Task[] = [fakeTask];

      (tasksService.getAll as jest.Mock).mockReturnValue(of(fakeTasks));

      const completedTask: Task = { ...fakeTask, completed: true };

      (tasksService.patch as jest.Mock).mockReturnValue(of(completedTask));

      fixture.detectChanges();

      const todoItemDebugEl = testHelper.queryByTestId('todo-list-item');

      expect(testHelper.queryByTestId('completed-list-item')).toBeNull();

      (
        todoItemDebugEl.componentInstance as FakeListItemComponent
      ).complete.emit(fakeTask);

      expect(tasksService.patch).toHaveBeenCalledWith(fakeTask.id, {
        completed: true,
      });

      fixture.detectChanges();

      expect(testHelper.queryByTestId('completed-list-item')).toBeTruthy();
    });

    it('Deve remover uma tarefa', () => {
      const fakeTask: Task = {
        id: '1',
        title: 'Nome da Tarefa',
        completed: false,
      };

      const fakeTasks: Task[] = [fakeTask];

      (tasksService.getAll as jest.Mock).mockReturnValue(of(fakeTasks));

      (tasksService.delete as jest.Mock).mockReturnValue(of(fakeTask));

      fixture.detectChanges();

      const todoItemDebugEl = testHelper.queryByTestId('todo-list-item');

      (todoItemDebugEl.componentInstance as FakeListItemComponent).remove.emit(
        fakeTask
      );

      expect(tasksService.delete).toHaveBeenCalledWith(fakeTask.id);

      fixture.detectChanges();

      expect(testHelper.queryByTestId('todo-list-item')).toBeNull();
    });

    it('Deve redirecionar para a rota de editação de tarefa', fakeAsync(() => {
      const fakeTask: Task = {
        id: '1',
        title: 'Item 1',
        completed: false,
      };

      const fakeTasks: Task[] = [fakeTask];

      (tasksService.getAll as jest.Mock).mockReturnValue(of(fakeTasks));

      fixture.detectChanges();

      const todoItemDebugEl = testHelper.queryByTestId('todo-list-item');

      (todoItemDebugEl.componentInstance as ListItemComponent).edit.emit(
        fakeTask
      );

      fixture.detectChanges();

      const location = TestBed.inject(Location);

      tick();

      expect(location.path()).toBe(`/edit/${fakeTask.id}`);
    }));
  });

  describe('Quando a tarefa está concluída', () => {
    it('Deve marcar a tarefa como pendente', () => {
      const fakeTask: Task = {
        id: '1',
        title: 'Nome da tarefa',
        completed: true,
      };

      const fakeTasks: Task[] = [fakeTask];

      (tasksService.getAll as jest.Mock).mockReturnValue(of(fakeTasks));

      const pendingTaskResponse = { ...fakeTask, completed: false };

      (tasksService.patch as jest.Mock).mockReturnValue(
        of(pendingTaskResponse)
      );

      fixture.detectChanges();

      expect(testHelper.queryByTestId('todo-list-item')).toBeNull();
      expect(testHelper.queryByTestId('completed-list-item')).toBeTruthy();

      const completedItemDebugEl = testHelper.queryByTestId(
        'completed-list-item'
      );

      (
        completedItemDebugEl.componentInstance as FakeListItemComponent
      ).notComplete.emit(fakeTask);

      expect(tasksService.patch).toHaveBeenCalledWith(fakeTask.id, {
        completed: false,
      });

      fixture.detectChanges();

      expect(testHelper.queryByTestId('todo-list-item')).toBeTruthy();
      expect(testHelper.queryByTestId('completed-list-item')).toBeNull();
    });

    it('Deve remover uma tarefa', () => {
      const fakeTask: Task = {
        id: '1',
        title: 'Nome da Tarefa',
        completed: true,
      };

      const fakeTasks: Task[] = [fakeTask];

      (tasksService.getAll as jest.Mock).mockReturnValue(of(fakeTasks));

      (tasksService.delete as jest.Mock).mockReturnValue(of(fakeTask));

      fixture.detectChanges();

      const completedItemDebugEl = testHelper.queryByTestId(
        'completed-list-item'
      );

      (
        completedItemDebugEl.componentInstance as FakeListItemComponent
      ).remove.emit(fakeTask);

      expect(tasksService.delete).toHaveBeenCalledWith(fakeTask.id);

      fixture.detectChanges();

      expect(testHelper.queryByTestId('completed-list-item')).toBeNull();
    });

    it('Deve redirecionar para a rota de edição de tarefa', fakeAsync(() => {
      const fakeTask: Task = {
        id: '1',
        title: 'Item 1',
        completed: true,
      };

      const fakeTasks: Task[] = [fakeTask];

      (tasksService.getAll as jest.Mock).mockReturnValue(of(fakeTasks));

      fixture.detectChanges();

      const completedItemDebugEl = testHelper.queryByTestId(
        'completed-list-item'
      );

      (completedItemDebugEl.componentInstance as ListItemComponent).edit.emit(
        fakeTask
      );

      fixture.detectChanges();

      const location = TestBed.inject(Location);

      tick();

      expect(location.path()).toBe(`/edit/${fakeTask.id}`);
    }));
  });

  it('Deve redirecionar para a rota de criação de tarefa', fakeAsync(() => {
    const location = TestBed.inject(Location);

    (tasksService.getAll as jest.Mock).mockReturnValue(of([]));

    fixture.detectChanges();

    expect(location.path()).toBe('');

    testHelper.click('list-create-task');

    tick();

    expect(location.path()).toBe('/create');
  }));
});
