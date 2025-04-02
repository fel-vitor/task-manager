import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Task } from 'src/app/shared/interfaces/task.interface';
import { TasksService } from 'src/app/shared/services/tasks/tasks.service';
import { ListItemComponent } from './list-item/list-item.component';
import { NoItemsComponent } from './no-items/no-items.component';
import { ButtonDirective } from 'src/app/shared/directives/button/button.directive';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, NoItemsComponent, ListItemComponent, RouterLink, ButtonDirective],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  tasksService = inject(TasksService);
  router = inject(Router);

  tasks = signal<Task[]>([]);

  completedTasks = computed(() =>
    this.tasks().filter((task) => task.completed)
  );

  pendingTasks = computed(() => this.tasks().filter((task) => !task.completed));

  ngOnInit(): void {
    this.tasksService.getAll().subscribe((tasks) => this.tasks.set(tasks));
  }

  onComplete(task: Task) {
    this.tasksService.patch(task.id, { completed: true }).subscribe((task) => {
      this.updateTask(task);
    });
  }

  onNotComplete(task: Task) {
    this.tasksService.patch(task.id, { completed: false }).subscribe((task) => {
      this.updateTask(task);
    });
  }

  onRemove(task: Task) {
    this.tasksService.delete(task.id).subscribe((task) => {
      this.removeTask(task);
    });
  }

  onEdit(task: Task) {
    this.router.navigate(['edit', task.id]);
  }

  private updateTask(task: Task) {
    this.tasks.update((tasks) =>
      tasks.map((t) => (t.id === task.id ? task : t))
    );
  }

  private removeTask(task: Task) {
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== task.id));
  }
}
