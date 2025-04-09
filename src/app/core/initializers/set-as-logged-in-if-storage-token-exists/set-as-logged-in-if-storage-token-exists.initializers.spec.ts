import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { LoginFacadeService } from 'src/app/shared/services/login-facade/login-facade.service';
import { setAsLoggedInIfStorageTokenExistsInitializerProvider } from './set-as-logged-in-if-storage-token-exists.initializer';

describe('setAsLoggedInIfStorageTokenExistsInitializer', () => {
  it('Deve logar o usuário quando o token  de autenticação existir', () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(LoginFacadeService),
        setAsLoggedInIfStorageTokenExistsInitializerProvider,
      ],
    });

    const loginFacadeService = TestBed.inject(LoginFacadeService);

    expect(
      loginFacadeService.setAsLoggedInIfStorageTokenExists
    ).toHaveBeenCalled();
  });
});
