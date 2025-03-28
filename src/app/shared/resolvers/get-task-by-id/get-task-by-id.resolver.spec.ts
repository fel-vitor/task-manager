import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  ResolveFn,
  Router,
  withComponentInputBinding,
} from '@angular/router';

import { RouterTestingHarness } from '@angular/router/testing';

import { MockProvider } from 'ng-mocks';
import { Observable, of, throwError } from 'rxjs';
import { Task } from '../../interfaces/task.interface';
import { TasksService } from '../../services/tasks/tasks.service';
import { getTaskByIdResolver } from './get-task-by-id.resolver';
import { Component, input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-test',
  template: '',
})
class FakeComponent {
  task = input<Task>();
}

describe('getTaskByIdResolver', () => {
  const executeResolver: ResolveFn<Observable<Task>> = (
    ...resolverParameters
  ) =>
    TestBed.runInInjectionContext(() =>
      getTaskByIdResolver(...resolverParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(TasksService),
        provideRouter(
          [
            {
              path: 'test/:id',
              resolve: { task: getTaskByIdResolver },
              component: FakeComponent,
            },
          ],
          withComponentInputBinding()
        ),
      ],
    });
  });

  it('Deve retornar uma tarefa', async () => {
    const tasksService = TestBed.inject(TasksService);

    const fakeTask: Task = { id: '1', title: 'Item 1', completed: false };

    (tasksService.getById as jest.Mock).mockReturnValue(of(fakeTask));

    const harnnes = await RouterTestingHarness.create(`test/${fakeTask.id}`);

    const fakeComponentDebugEl = harnnes.fixture.debugElement.query(
      By.directive(FakeComponent)
    );

    expect(tasksService.getById).toHaveBeenCalledWith(fakeTask.id);

    expect(fakeComponentDebugEl.componentInstance.task()).toBe(fakeTask);
  });

  it('Deve retornar um erro caso a tarefa não exista', async () => {
    const tasksService = TestBed.inject(TasksService);

    const fakeTask: Task = { id: '1', title: 'Item 1', completed: false };

    const fakeHttpErrorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
    });

    (tasksService.getById as jest.Mock).mockReturnValue(
      throwError(() => fakeHttpErrorResponse)
    );

    try {
      await RouterTestingHarness.create(`test/${fakeTask.id}`);
    } catch (error) {
      expect(error).toEqual(fakeHttpErrorResponse);
    }
  });
});
