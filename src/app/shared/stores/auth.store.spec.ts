import { TestBed } from '@angular/core/testing';

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
  })
});
