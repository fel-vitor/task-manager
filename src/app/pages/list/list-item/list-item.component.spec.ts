import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from 'src/app/shared/interfaces/task.interface';
import { TestHelper } from '@testing/helpers/test-helper';
import { ListItemComponent } from './list-item.component';
import { Component } from '@angular/core';

async function setup(fakeTask: Task) {
  @Component({
    standalone: true,
    imports: [ListItemComponent],
    template: `<app-list-item
      [task]="task"
      (complete)="onCompleteTask($event)"
    />`,
  })
  class HostComponent {
    task = fakeTask;

    onCompleteTask() {}
  }

  await TestBed.configureTestingModule({
    imports: [HostComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(HostComponent);
  const testHelper = new TestHelper(fixture);

  return { fixture, testHelper };
}

describe('ListItemComponent', () => {

  it('Deve renderizar o título da tarefa', async () => {
    const fakeTask: Task = {
      id: '1',
      title: 'Nome da tarefa',
      completed: false,
    };

    const { fixture, testHelper } = await setup(fakeTask);

    fixture.detectChanges();

    const text = testHelper.getTextContentByTestId('list-item-task-title');

    expect(text).toBe(fakeTask.title);
  });

  it('Deve emitir um evento ao completar a tarefa', async () => {
    const fakeTask: Task = {
      id: '1',
      title: 'Nome da tarefa',
      completed: false,
    };

    const { fixture, testHelper } = await setup(fakeTask);

    const onCompleteTaskSpy = jest.spyOn(
      fixture.componentInstance,
      'onCompleteTask'
    );

    fixture.detectChanges();

    const completeBtnDebugEl = testHelper.queryByTestId(
      'list-item-complete-action'
    );

    completeBtnDebugEl.triggerEventHandler('click', null);

    expect(onCompleteTaskSpy).toHaveBeenCalled();
  });
});
