import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { AuthStoreService } from '../../stores/auth.store';
import { AuthTokenManagerService } from '../auth-token-manager/auth-token-manager.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService {
  authStore = inject(AuthStoreService);
  authService = inject(AuthService);
  authTokenManagerService = inject(AuthTokenManagerService);

  login(email: string, password: string) {
    return this.authService.login(email, password).pipe(
      tap(() => this.authStore.setAsLoggedIn()),
      tap(({ token }) => this.authTokenManagerService.setToken(token))
    );
  }

  setAsLoggedInIfStorageTokenExists() {
    const token = this.authTokenManagerService.getToken();

    if (token) {
      this.authStore.setAsLoggedIn();
    }
  }
}
