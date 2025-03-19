import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TasksService } from 'src/app/shared/services/tasks/tasks.service';
import { ListComponent } from './list.component';
import { FakeTasksService } from '@testing/mocks/fake-tasks.service';
import { ListItemComponent } from './list-item/list-item.component';
import { FakeListItemComponent } from '@testing/mocks/fake-list-item.component';
import { Task } from 'src/app/shared/interfaces/task.interface';
import { TestHelper } from '@testing/helpers/test-helper';

describe('ListComponent', () => {
  let fixture: ComponentFixture<ListComponent>;
  let tasksService: TasksService;
  let testHelper: TestHelper<ListComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        {
          provide: TasksService,
          useClass: FakeTasksService,
        },
      ],
    });

    TestBed.overrideComponent(ListComponent, {
      remove: {
        imports: [ListItemComponent],
      },
      add: {
        imports: [FakeListItemComponent],
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

    expect(todoItems[0].componentInstance.task()).toEqual({
      title: 'Item 1',
      completed: false,
    });
    expect(todoItems[1].componentInstance.task()).toEqual({
      title: 'Item 2',
      completed: false,
    });
    expect(todoItems[2].componentInstance.task()).toEqual({
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

    expect(completedItems[0].componentInstance.task()).toEqual({
      title: 'Item 4',
      completed: true,
    });
    expect(completedItems[1].componentInstance.task()).toEqual({
      title: 'Item 5',
      completed: true,
    });
    expect(completedItems[2].componentInstance.task()).toEqual({
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

      (todoItemDebugEl.componentInstance as FakeListItemComponent).complete.emit(fakeTask);

      expect(tasksService.patch).toHaveBeenCalledWith(fakeTask.id, { completed: true });

      fixture.detectChanges();

      expect(testHelper.queryByTestId('completed-list-item')).toBeTruthy();  
    });
  });

  describe('Quando a tarefa está concluída', () => {
    it('Deve marcar a tarefa como pendente', () => {
      const fakeTask: Task = { id: '1', title:'Nome da tarefa', completed: true };

      const fakeTasks: Task[] = [fakeTask];

      (tasksService.getAll as jest.Mock).mockReturnValue(of(fakeTasks));

      const pendingTaskResponse = { ...fakeTask, completed: false };

      (tasksService.patch as jest.Mock).mockReturnValue(of(pendingTaskResponse));

      fixture.detectChanges();

      expect(testHelper.queryByTestId('todo-list-item')).toBeNull();
      expect(testHelper.queryByTestId('completed-list-item')).toBeTruthy();

      const completedItemDebugEl = testHelper.queryByTestId('completed-list-item');

      (completedItemDebugEl.componentInstance as FakeListItemComponent).notComplete.emit(fakeTask);

      expect(tasksService.patch).toHaveBeenCalledWith(fakeTask.id, { completed: false });

      fixture.detectChanges();

      expect(testHelper.queryByTestId('todo-list-item')).toBeTruthy();
      expect(testHelper.queryByTestId('completed-list-item')).toBeNull();
    })
  })
});
