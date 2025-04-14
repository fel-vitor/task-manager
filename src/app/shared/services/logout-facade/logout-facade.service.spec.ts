import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MockProviders } from 'ng-mocks';
import { AuthStoreService } from '../../stores/auth.store';
import { AuthTokenManagerService } from '../auth-token-manager/auth-token-manager.service';
import { LogoutFacadeService } from './logout-facade.service';

@Component({
  standalone: true,
  selector: 'app-logout',
  template: '',
})
class FakeLoginComponent {}

describe('LogoutFacadeService', () => {
  let service: LogoutFacadeService;
  let authStoreService: AuthStoreService;
  let authTokenManagerService: AuthTokenManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProviders(AuthStoreService, AuthTokenManagerService),
        provideRouter([
          {
            path: 'login',
            component: FakeLoginComponent,
          },
        ]),
      ],
    });
    service = TestBed.inject(LogoutFacadeService);
    authStoreService = TestBed.inject(AuthStoreService);
    authTokenManagerService = TestBed.inject(AuthTokenManagerService);
  });

  it('Deve fazer o logout do usuário', fakeAsync(() => {
    const location = TestBed.inject(Location);

    expect(location.path()).toBe('');

    service.logout();

    expect(authStoreService.setAsLoggedOut).toHaveBeenCalled();
    expect(authTokenManagerService.removeToken).toHaveBeenCalled();

    tick();

    expect(location.path()).toBe('/login');
  }));
});
