import { inject, Injectable } from '@angular/core';
import { LocalStorageToken } from '../../tokens/local-storage.token';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenManagerService {
  #localStorage = inject(LocalStorageToken);

  #tokenKey = 'auth-token';

  setToken(token: string) {
    this.#localStorage.setItem(this.#tokenKey, token);
  }

  getToken() {
    return this.#localStorage.getItem(this.#tokenKey);
  }

  removeToken() {
    return this.#localStorage.removeItem(this.#tokenKey);
  }
}
