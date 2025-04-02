import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { TokenResponse } from '../../interfaces/token.interface';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('Deve autenticar o usuário', fakeAsync(() => {
    const fakeEmail = 'correto@dominio.com';
    const fakePassword = '123456';

    let result: TokenResponse | null = null;

    service.login(fakeEmail, fakePassword).subscribe((response) => {
      result = response;
    });

    tick();

    const expectedResponse: TokenResponse = { token: 'fake-jwt-token' };

    expect(result).toEqual(expectedResponse);
  }));

  it('Deve retornar um erro quando o email ou senha estiver incorreto', fakeAsync(() => {
    const fakeEmail = 'errado@dominio.com';
    const fakePassword = 'errado';

    let result: HttpErrorResponse | null = null;

    service.login(fakeEmail, fakePassword).subscribe({
      error: (error) => {
        result = error;
      },
    });

    tick();

    expect((result as unknown as HttpErrorResponse).status).toEqual(401);
  }));
});
