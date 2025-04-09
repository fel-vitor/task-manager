import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockProviders } from 'ng-mocks';
import { AuthTokenManagerService } from 'src/app/shared/services/auth-token-manager/auth-token-manager.service';
import { AuthStoreService } from 'src/app/shared/stores/auth.store';
import { addAuthAuthorizationHeaderInterceptor } from './add-auth-authorization-header.interceptor';

describe('addAuthAuthorizationHeaderInterceptor', () => {
  let authStoreService: AuthStoreService;
  let authTokenManagerService: AuthTokenManagerService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProviders(AuthStoreService, AuthTokenManagerService),
        provideHttpClient(
          withInterceptors([addAuthAuthorizationHeaderInterceptor])
        ),
        provideHttpClientTesting(),
      ],
    });

    authStoreService = TestBed.inject(AuthStoreService);
    authTokenManagerService = TestBed.inject(AuthTokenManagerService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('Quando o usuário estiver logado', () => {
    it('Deve adicionar um header "Authorization" a requisição http', () => {
      const fakeAuthToken = 'fake-auth-token';

      (authStoreService.isLoggedIn as jest.Mock).mockReturnValue(true);

      (authTokenManagerService.getToken as jest.Mock).mockReturnValue(
        fakeAuthToken
      );

      httpClient.get('/fake').subscribe();

      const req = httpTestingController.expectOne('/fake');

      expect(req.request.headers.has('Authorization')).toBeTruthy();
      expect(req.request.headers.get('Authorization')).toBe(fakeAuthToken);
    });
  });

  describe('Quando o usuário não estiver logado', () => {
    it('Não deve adicionar um header "Authorization" a requisição http', () => {
      (authStoreService.isLoggedIn as jest.Mock).mockReturnValue(false);

      httpClient.get('/fake').subscribe();

      const req = httpTestingController.expectOne('/fake');

      expect(authTokenManagerService.getToken).not.toHaveBeenCalled();

      expect(req.request.headers.has('Authorization')).toBeFalsy();
    });
  });
});
