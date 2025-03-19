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
      (notComplete)="onNotComplete($event)"
    />`,
  })
  class HostComponent {
    task = fakeTask;

    onCompleteTask() {}

    onNotComplete() {}
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

  describe('Quando a tarefa não estiver concluída', () => {
    it('Deve renderizar o botão de concluir tarefa', async () => {
      const fakeTask: Task = {
        id: '1',
        title: 'Nome da Tarefa',
        completed: false,
      };

      const { fixture, testHelper } = await setup(fakeTask);

      fixture.detectChanges();

      const completeBtnDebugEl = testHelper.queryByTestId(
        'list-item-complete-action'
      );

      expect(completeBtnDebugEl).toBeTruthy();

      const markAsPendingBtnDebugEl = testHelper.queryByTestId(
        'list-item-mark-as-pending-action'
      );

      expect(markAsPendingBtnDebugEl).toBeNull();
    });

    it('Deve emitir um evento ao concluir a tarefa', async () => {
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

  describe('Quando a tarefa estiver concluída', () => {
    it('Deve renderizar o botão que marca a tarefa como pendente', async () => {
      const fakeTask: Task = {
        id: '1',
        title: 'Nome da Tarefa',
        completed: true,
      };

      const { fixture, testHelper } = await setup(fakeTask);

      fixture.detectChanges();

      const completeBtnDebugEl = testHelper.queryByTestId(
        'list-item-complete-action'
      );

      expect(completeBtnDebugEl).toBeNull();

      const markAsPendingBtnDebugEl = testHelper.queryByTestId(
        'list-item-mark-as-pending-action'
      );

      expect(markAsPendingBtnDebugEl).toBeTruthy();
    });

    it('Deve emitir um evento que marque a tarefa como pendente', async () => {
      const fakeTask: Task = {
        id: '1',
        title: 'Nome da Tarefa',
        completed: true,
      };

      const { fixture, testHelper } = await setup(fakeTask);

      const onNotCompletegSpy = jest.spyOn(
        fixture.componentInstance,
        'onNotComplete'
      );

      fixture.detectChanges();

      const markAsPendingBtnDebugEl = testHelper.queryByTestId(
        'list-item-mark-as-pending-action'
      );

      markAsPendingBtnDebugEl.triggerEventHandler('click', null);

      expect(onNotCompletegSpy).toHaveBeenCalled();
    });
  });
});
