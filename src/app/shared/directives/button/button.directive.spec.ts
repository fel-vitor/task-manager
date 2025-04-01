import { TestBed } from '@angular/core/testing';
import { ButtonDirective, ButtonXsDirective } from './button.directive';
import { Component, Type } from '@angular/core';
import { TestHelper } from '@testing/helpers/test-helper';

function createComponent(template: string, directive: Type<unknown>) {
  @Component({
    standalone: true,
    imports: [directive],
    template,
  })
  class HostComponent {}

  const fixure = TestBed.createComponent(HostComponent);
  const testHelper = new TestHelper(fixure);

  fixure.detectChanges();

  return { fixure, testHelper };
}

describe('ButtonDirective', () => {
  function createComponentWithButtonDirective(template: string) {
    return createComponent(template, ButtonDirective);
  }

  it('Deve aplicar as classes css corretamente', () => {
    const { testHelper } = createComponentWithButtonDirective(`
      <button appButton="neutral" data-testid="neutral"></button>
      <button appButton="primary" data-testid="primary"></button>
      <button appButton="secondary" data-testid="secondary"></button>
      <button appButton="accent" data-testid="accent"></button>
      <button appButton="info" data-testid="info"></button>
      <button appButton="success" data-testid="success"></button>
      <button appButton="warning" data-testid="warning"></button>
      <button appButton="error" data-testid="error"></button>  
    `);

    expect(testHelper.queryByTestId('neutral').nativeElement.className).toBe(
      'btn btn-neutral'
    );
    expect(testHelper.queryByTestId('primary').nativeElement.className).toBe(
      'btn btn-primary'
    );
    expect(testHelper.queryByTestId('secondary').nativeElement.className).toBe(
      'btn btn-secondary'
    );
    expect(testHelper.queryByTestId('accent').nativeElement.className).toBe(
      'btn btn-accent'
    );
    expect(testHelper.queryByTestId('info').nativeElement.className).toBe(
      'btn btn-info'
    );
    expect(testHelper.queryByTestId('success').nativeElement.className).toBe(
      'btn btn-success'
    );
    expect(testHelper.queryByTestId('warning').nativeElement.className).toBe(
      'btn btn-warning'
    );
    expect(testHelper.queryByTestId('error').nativeElement.className).toBe(
      'btn btn-error'
    );
  });

  it('Deve aplicar apenas a classe "btn" quando a cor for  inválida', () => {
    const { testHelper } = createComponentWithButtonDirective(`
      <button appButton="wrong-color" data-testid="wrong-color"></button>
    `);

    expect(
      testHelper.queryByTestId('wrong-color').nativeElement.className
    ).toBe('btn');
  });
});

describe('ButtonXsDirective', () => {
  function createComponentWithButtonXsDirective(template: string) {
    return createComponent(template, ButtonXsDirective);
  }
  it('Deve adicionar a classe "btn-xs" e as outras classes de cores corretamente', () => {

    const { testHelper } = createComponentWithButtonXsDirective(`
      <button appButtonXs="neutral" data-testid="neutral"></button>
      <button appButtonXs="primary" data-testid="primary"></button>
      <button appButtonXs="secondary" data-testid="secondary"></button>
      <button appButtonXs="accent" data-testid="accent"></button>
      <button appButtonXs="info" data-testid="info"></button>
      <button appButtonXs="success" data-testid="success"></button>
      <button appButtonXs="warning" data-testid="warning"></button>
      <button appButtonXs="error" data-testid="error"></button>  
    `);

    expect(testHelper.queryByTestId('neutral').nativeElement.className).toBe(
      'btn btn-xs btn-neutral'
    );
    expect(testHelper.queryByTestId('primary').nativeElement.className).toBe(
      'btn btn-xs btn-primary'
    );
    expect(testHelper.queryByTestId('secondary').nativeElement.className).toBe(
      'btn btn-xs btn-secondary'
    );
    expect(testHelper.queryByTestId('accent').nativeElement.className).toBe(
      'btn btn-xs btn-accent'
    );
    expect(testHelper.queryByTestId('info').nativeElement.className).toBe(
      'btn btn-xs btn-info'
    );
    expect(testHelper.queryByTestId('success').nativeElement.className).toBe(
      'btn btn-xs btn-success'
    );
    expect(testHelper.queryByTestId('warning').nativeElement.className).toBe(
      'btn btn-xs btn-warning'
    );
    expect(testHelper.queryByTestId('error').nativeElement.className).toBe(
      'btn btn-xs btn-error'
    );
  })

  it('Deve aplicar apenas a classe "btn" e "btn-xs" quando a cor for inválida', () => {
    const { testHelper } = createComponentWithButtonXsDirective(`
      <button appButtonXs="wrong-color" data-testid="wrong-color"></button>
    `)

    expect(testHelper.queryByTestId('wrong-color').nativeElement.className).toBe('btn btn-xs')
  })

})
