import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from './header.component';
import { LogoutComponent } from './logout/logout.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
    });

    await TestBed.compileComponents();

    TestBed.overrideComponent(HeaderComponent, {
      remove: {
        imports: [LogoutComponent],
      },
      add: {
        imports: [MockComponent(LogoutComponent)],
      },
    });

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('Deve renderizar o título corretamente', () => {
    const h1DebugEl = fixture.debugElement.query(By.css('h1'));

    expect(h1DebugEl.nativeElement.textContent).toBe('Gerenciador de tarefas');
  });

  it('Deve renderizar o componente do logout', () => {
    expect(fixture.debugElement.query(By.css('app-logout'))).toBeTruthy();
  });
});
