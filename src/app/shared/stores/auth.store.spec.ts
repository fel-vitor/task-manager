import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AuthStoreService } from './auth.store';

describe('AuthStoreService', () => {
  let service: AuthStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStoreService);
  });

  it('Deve retornar o valor "false" quando usuário não estiver logado', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('Deve retornar o valor "true" quando usuário estiver logado', () => {
    service.setAsLoggedIn();

    expect(service.isLoggedIn()).toBe(true);
  });

  it('Deve emitir um evento quando o usuário logar em deslogar', fakeAsync(() => {
    let result: boolean | null = null;

    service.isLoggedIn$().subscribe((value) => {
      result = value;
    });

    tick();

    expect(result).toBe(false);

    service.setAsLoggedIn();

    tick();

    expect(result).toBe(true);

    service.setAsLoggedOut();

    tick();

    expect(result).toBe(false);
  }));
});
