import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  httpClient = inject(HttpClient);

  getAll(): Observable<Task[]> {
    return this.httpClient.get<Task[]>('/api/tasks');
  }
}
