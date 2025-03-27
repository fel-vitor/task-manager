import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Task } from '../../interfaces/task.interface';
import { TasksService } from '../../services/tasks/tasks.service';

export const getTaskByIdResolver: ResolveFn<Observable<Task>> = (route, state) => {

  const tasksService = inject(TasksService);

  const id = route.params['id'];

  const observable = tasksService.getById(id);

  return observable;
};
