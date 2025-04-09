import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { MockProviders } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { AuthStoreService } from '../../stores/auth.store';
import { AuthTokenManagerService } from '../auth-token-manager/auth-token-manager.service';
import { AuthService } from '../auth/auth.service';
import { LoginFacadeService } from './login-facade.service';

describe('LoginFacadeService', () => {
  let service: LoginFacadeService;
  let authService: AuthService;
  let authStoreService: AuthStoreService;
  let authTokenManagerService: AuthTokenManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProviders(AuthService, AuthStoreService, AuthTokenManagerService),
      ],
    });
    service = TestBed.inject(LoginFacadeService);
    authService = TestBed.inject(AuthService);
    authStoreService = TestBed.inject(AuthStoreService);
    authTokenManagerService = TestBed.inject(AuthTokenManagerService);
  });

  describe('login()', () => {
    it('Deve autenticar o usuário', fakeAsync(() => {
      const fakeEmail = 'correto@dominio.com';
      const fakePassword = '12345';

      const fakeAuthToken = { token: 'fake-jwt-token' };

      let result: boolean | null = null;

      (authService.login as jest.Mock).mockReturnValue(of(fakeAuthToken));

      service.login(fakeEmail, fakePassword).subscribe(() => {
        result = true;
      });

      tick();

      expect(authService.login).toHaveBeenCalledWith(fakeEmail, fakePassword);

      expect(authStoreService.setAsLoggedIn).toHaveBeenCalled();

      expect(authTokenManagerService.setToken).toHaveBeenCalledWith(
        fakeAuthToken.token
      );

      expect(result).toBe(true);
    }));

    it('Deve retornar um erro quando a autenticação falhar', fakeAsync(() => {
      const fakeEmail = 'errado@dominio.com';
      const fakePassword = '123';

      let result: HttpErrorResponse | null = null;

      (authService.login as jest.Mock).mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 401 }))
      );

      service.login(fakeEmail, fakePassword).subscribe({
        error: (response) => {
          result = response;
        },
      });

      tick();

      expect(authService.login).toHaveBeenCalledWith(fakeEmail, fakePassword);

      expect(authStoreService.setAsLoggedIn).not.toHaveBeenCalled();

      expect(authTokenManagerService.setToken).not.toHaveBeenCalled();

      expect((result as unknown as HttpErrorResponse).status).toBe(401);
    }));
  });

  describe('setAsLoggedInIfStorageTokenExists()', () => {
    it('Deve autenticar o usuário', () => {
      (authTokenManagerService.getToken as jest.Mock).mockReturnValue(
        'fake-token'
      );

      service.setAsLoggedInIfStorageTokenExists();

      expect(authTokenManagerService.getToken).toHaveBeenCalled();
      expect(authStoreService.setAsLoggedIn).toHaveBeenCalled();
    });

    it('Não deve autenticar o usuário', () => {
      (authTokenManagerService.getToken as jest.Mock).mockReturnValue(null);

      service.setAsLoggedInIfStorageTokenExists();

      expect(authTokenManagerService.getToken).toHaveBeenCalled();
      expect(authTokenManagerService.setToken).not.toHaveBeenCalled();
    });
  });
});
