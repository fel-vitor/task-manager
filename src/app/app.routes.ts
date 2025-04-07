import { Route } from '@angular/router';
import { getTaskByIdResolver } from './shared/resolvers/get-task-by-id/get-task-by-id.resolver';
import { isLoggedInGuard } from './shared/guards/is-logged-in.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/list/list.component').then((m) => m.ListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/create-task/create-task.component').then(
            (m) => m.CreateTaskComponent
          ),
      },
      {
        path: 'edit/:id',
        resolve: {
          task: getTaskByIdResolver,
        },
        loadComponent: () =>
          import('./pages/edit-task/edit-task.component').then(
            (m) => m.EditTaskComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
];
