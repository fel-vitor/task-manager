import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStoreService {
  #state = false;
  #state$ = new BehaviorSubject<boolean>(false);

  isLoggedIn() {
    return this.#state;
  }

  isLoggedIn$() {
    return this.#state$.asObservable();
  }

  setAsLoggedIn() {
    this.#state = true;
    this.#state$.next(this.#state);
  }

  setAsLoggedOut() {
    this.#state = false;
    this.#state$.next(this.#state);
  }
}
