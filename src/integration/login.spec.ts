import { Location } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestHelper } from '@testing/helpers/test-helper';
import { appConfig } from '../app/app.config';
import { clearStorage } from '../testing/helpers/clean-storage';
import { setAuthToken } from '../testing/helpers/set-auth-token';

function setup() {
  TestBed.configureTestingModule({
    providers: [appConfig.providers],
  });
}

describe('Fluxo de autenticação', () => {
  beforeEach(() => clearStorage());

  describe('Quando usuário não estiver logado', () => {
    it('Deve redirecionar para a rota de login, logar e redirecionar para a rota de tarefa', fakeAsync(async () => {
      setup();

      const location = TestBed.inject(Location);

      expect(location.path()).toBe('');

      const harness = await RouterTestingHarness.create('');

      const testHelper = new TestHelper(harness.fixture);

      expect(location.path()).toBe('/login');

      testHelper.triggerInputEvent('login-email', 'correto@dominio.com');
      testHelper.triggerInputEvent('login-password', '123456');

      testHelper.submitForm('login-submit');

      tick();

      expect(location.path()).toBe('');
    }));

    it('Deve redirecionar para a rota de login, falhar ao logar e manter a rota igual', fakeAsync(async () => {
      setup();

      const location = TestBed.inject(Location);

      expect(location.path()).toBe('');

      const harness = await RouterTestingHarness.create('');

      const testHelper = new TestHelper(harness.fixture);

      expect(location.path()).toBe('/login');

      testHelper.triggerInputEvent('login-email', 'errado@dominio.com');
      testHelper.triggerInputEvent('login-password', '123');

      testHelper.submitForm('login-submit');

      tick();

      expect(location.path()).toBe('/login');
    }));
  });

  describe('Quando usuário estiver logado', () => {
    it('Deve mantar a rota igual', async () => {
      setAuthToken();

      setup();

      const location = TestBed.inject(Location);

      expect(location.path()).toBe('');

      await RouterTestingHarness.create('');

      expect(location.path()).toBe('');
    });
  });
});
