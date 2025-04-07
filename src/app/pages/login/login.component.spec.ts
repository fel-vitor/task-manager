import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TestHelper } from '@testing/helpers/test-helper';
import { MockProviders } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { LoginFacadeService } from 'src/app/shared/services/login-facade/login-facade.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let testHelper: TestHelper<LoginComponent>;
  let router: Router;
  let loginFacadeService: LoginFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [MockProviders(Router, LoginFacadeService)],
      imports: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    testHelper = new TestHelper(fixture);

    router = TestBed.inject(Router);
    loginFacadeService = TestBed.inject(LoginFacadeService);

    fixture.detectChanges();
  });

  describe('Não deve chamar ação de autenticação quando', () => {
    it('O formulário estiver inválido', () => {
      testHelper.submitForm('login-submit');

      expect(loginFacadeService.login).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('Email estiver inválido', () => {
      const fakeEmail = 'invalido';
      const fakePassword = '123456';

      testHelper.triggerInputEvent('login-email', fakeEmail);
      testHelper.triggerInputEvent('login-password', fakePassword);

      testHelper.submitForm('login-submit');

      expect(loginFacadeService.login).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  it('Os campos devem iniciar vázios', () => {
    expect(testHelper.getInputValue('login-email')).toBe('');
    expect(testHelper.getInputValue('login-password')).toBe('');
  });

  it('Deve fazer autenticação do usuário', () => {
    const fakeEmail = 'correto@dominio.com';
    const fakePassword = '123456';

    testHelper.triggerInputEvent('login-email', fakeEmail);
    testHelper.triggerInputEvent('login-password', fakePassword);

    (loginFacadeService.login as jest.Mock).mockReturnValue(
      of({ token: 'fake-jwt-token' })
    );

    testHelper.submitForm('login-submit');

    expect(loginFacadeService.login).toHaveBeenCalledWith(
      fakeEmail,
      fakePassword
    );

    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('Deve monstar uma mensagem de erro quando a autenticação falhar', () => {
    const fakeEmail = 'errado@dominio.com';
    const fakePassword = '123';

    expect(testHelper.queryByTestId('login-auth-failed')).toBeFalsy();

    testHelper.triggerInputEvent('login-email', fakeEmail);
    testHelper.triggerInputEvent('login-password', fakePassword);

    (loginFacadeService.login as jest.Mock).mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 401 }))
    );

    testHelper.submitForm('login-submit');

    expect(loginFacadeService.login).toHaveBeenCalledWith(
      fakeEmail,
      fakePassword
    );

    expect(router.navigateByUrl).not.toHaveBeenCalled();

    fixture.detectChanges();

    expect(testHelper.queryByTestId('login-auth-failed')).toBeTruthy();
  });
});
