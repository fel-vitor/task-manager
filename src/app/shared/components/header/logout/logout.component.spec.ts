import { TestBed } from '@angular/core/testing';
import { TestHelper } from '@testing/helpers/test-helper';
import { MockProviders } from 'ng-mocks';
import { of } from 'rxjs';
import { LogoutFacadeService } from 'src/app/shared/services/logout-facade/logout-facade.service';
import { AuthStoreService } from 'src/app/shared/stores/auth.store';
import { LogoutComponent } from './logout.component';

async function setupTest({ isLoggedIn }: { isLoggedIn: boolean }) {
  await TestBed.configureTestingModule({
    imports: [LogoutComponent],
    providers: [MockProviders(AuthStoreService, LogoutFacadeService)],
  }).compileComponents();

  const authStoreService = TestBed.inject(AuthStoreService);
  const logoutFacadeService = TestBed.inject(LogoutFacadeService);

  (authStoreService.isLoggedIn$ as jest.Mock).mockReturnValue(of(isLoggedIn));

  const fixture = TestBed.createComponent(LogoutComponent);
  const testHelper = new TestHelper(fixture);
  fixture.detectChanges();

  return { fixture, testHelper, authStoreService, logoutFacadeService };
}

describe('LogoutComponent', () => {
  describe('Quando usuário não estiver logado', () => {
    it('Não deve renderizar um botão de sair', async () => {
      const { testHelper } = await setupTest({ isLoggedIn: false });

      expect(testHelper.queryByTestId('header-logout')).toBeNull();
    });
  });

  describe('Quando o usuário estiver logado', () => {
    it('Deve fazer logout', async () => {
      const { testHelper, logoutFacadeService } = await setupTest({
        isLoggedIn: true,
      });

      expect(testHelper.queryByTestId('header-logout')).toBeTruthy();

      testHelper.click('header-logout');

      expect(logoutFacadeService.logout).toHaveBeenCalled();
    });
  });
});
