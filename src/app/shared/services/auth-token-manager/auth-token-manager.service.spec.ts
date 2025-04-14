import { TestBed } from '@angular/core/testing';

import { MockProvider } from 'ng-mocks';
import { LocalStorageToken } from '../../tokens/local-storage.token';
import { AuthTokenManagerService } from './auth-token-manager.service';

describe('AuthTokenManagerService', () => {
  let service: AuthTokenManagerService;
  let storage: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(LocalStorageToken, {
          setItem: jest.fn(),
          getItem: jest.fn(),
          removeItem: jest.fn(),
        }),
      ],
    });
    service = TestBed.inject(AuthTokenManagerService);
    storage = TestBed.inject(LocalStorageToken);
  });

  it('Deve adicionar o token ao local storage', () => {
    const fakeToken = 'fake-token';

    service.setToken(fakeToken);

    expect(storage.setItem).toHaveBeenCalledWith('auth-token', fakeToken);
  });

  it('Deve recuperar o token do local storage', () => {
    const fakeToken = 'fake-token';

    (storage.getItem as jest.Mock).mockReturnValue(fakeToken);

    const result = service.getToken();

    expect(storage.getItem).toHaveBeenCalledWith('auth-token');

    expect(result).toBe(fakeToken);
  });

  it('Deve remover o token do local storage', () => {
    service.removeToken();

    expect(storage.removeItem).toHaveBeenCalledWith('auth-token');
  });
});
