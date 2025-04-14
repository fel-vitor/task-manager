import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStoreService } from '../../stores/auth.store';
import { AuthTokenManagerService } from '../auth-token-manager/auth-token-manager.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutFacadeService {
  authStoreService = inject(AuthStoreService);
  authTokenManagerService = inject(AuthTokenManagerService);
  router = inject(Router);

  logout() {
    this.authStoreService.setAsLoggedOut();
    this.authTokenManagerService.removeToken();
    this.router.navigateByUrl('/login');
  }
}
