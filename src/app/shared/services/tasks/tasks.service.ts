import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, TaskWithoutId } from '../../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  httpClient = inject(HttpClient);

  getAll(): Observable<Task[]> {
    return this.httpClient.get<Task[]>('/api/tasks');
  }

  getById(id: string): Observable<Task> {
    return this.httpClient.get<Task>(`/api/tasks/${id}`);
  }

  post(payload: TaskWithoutId) {
    return this.httpClient.post<Task>('/api/tasks/', payload);
  }

  put(id: string, payload: TaskWithoutId) {
    return this.httpClient.put<Task>(`/api/tasks/${id}`, payload);
  }

  patch(id: string, payload: Partial<Task>) {
    return this.httpClient.patch<Task>(`/api/tasks/${id}`, payload);
  }

  delete(id: string) {
    return this.httpClient.delete<Task>(`/api/tasks/${id}`);
  }
}
