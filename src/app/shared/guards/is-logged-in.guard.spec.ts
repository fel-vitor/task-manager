import { TestBed } from '@angular/core/testing';
import { CanActivateFn, provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';


import { isLoggedInGuard } from './is-logged-in.guard';
import { Component } from '@angular/core';
import { AuthStoreService } from '../stores/auth.store';
import { MockProvider } from 'ng-mocks';

@Component({
  selector: 'app-autheticated-route',
  template: '',
})
class FakeAutheticatedComponent {}

@Component({
  selector: 'app-login',
  template: '',
})
class FakeLoginComponent {}

describe('isLoggedInGuard', () => {

  let authStoreService: AuthStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(AuthStoreService),
        provideRouter([
          {
            path: 'fake-route',
            canActivate: [isLoggedInGuard],
            component: FakeAutheticatedComponent,
          },
          {
            path: 'login',
            component: FakeLoginComponent,
          },
        ]),
      ],
    });

    authStoreService = TestBed.inject(AuthStoreService);
  });

  describe('Quando o não usuário estiver logado', () => {
    it('Deve redirecionar para rota de login', async () => {
      const location = TestBed.inject(Location);
      const router = TestBed.inject(Router);
  
      expect(location.path()).toBe('');
  
      (authStoreService.isLoggedIn as jest.Mock).mockReturnValue(false);
  
      await router.navigate(['fake-route']);
  
      expect(location.path()).toBe('/login');
    });
  })


  describe('Quando o usuário estiver logado', () => {
    it('Deve manter a navegação', async () => {
      const location = TestBed.inject(Location);
      const router = TestBed.inject(Router);
  
      expect(location.path()).toBe('');
  
      (authStoreService.isLoggedIn as jest.Mock).mockRejectedValue(true);
  
      await router.navigate(['fake-route'])
  
      expect(location.path()).toBe('/fake-route');
    })
  })
});
