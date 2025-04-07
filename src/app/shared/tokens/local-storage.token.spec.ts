import { TestBed } from '@angular/core/testing';
import { LocalStorageToken } from './local-storage.token';

describe('LocalStorageToken', () => {
  it('Deve retornar o localStorage da window', () => {
    const result = TestBed.inject(LocalStorageToken);

    expect(result).toBe(window.localStorage);
  });
});
