import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-header',
  standalone: true,
  template: '',
})
class FakeHeaderComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    TestBed.overrideComponent(AppComponent, {
      remove: {
        imports: [HeaderComponent],
      },
      add: {
        imports: [FakeHeaderComponent],
      },
    });
  });

  it('Deve renderizar o componente header', () => {
    const fixture = TestBed.createComponent(AppComponent);

    const headerDebugEl = fixture.debugElement.query(By.css('app-header'));

    expect(headerDebugEl).toBeTruthy();
  });

  it('Deve renderizar o componente router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);

    const routerOutletDebugEl = fixture.debugElement.query(
      By.css('router-outlet')
    );

    expect(routerOutletDebugEl).toBeTruthy();
  });
});
