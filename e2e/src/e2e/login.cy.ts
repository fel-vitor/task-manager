describe('Fluxo de autenticação', () => {
  context('Quando o usuário não estiver logado', () => {
    beforeEach(() => cy.visit('/'));

    it('Deve redirecionar para rota de login, autenticar e redirecionar para a listagem', () => {
      cy.location('pathname').should('be.eq', '/login');

      cy.fixture('credentials').then((credentials) => {
        cy.getByTestId('login-email').type(credentials.email);
        cy.getByTestId('login-password').type(credentials.password);
      });

      cy.getByTestId('login-submit').submit();

      cy.location('pathname').should('be.eq', '/');
    });

    it('Não deve existir um botão de logout', () => {
      cy.getByTestId('header-logout').should('not.exist');
    });
  });

  context('Quando o usuário estiver logado', () => {
    beforeEach(() => {
      cy.setUserAsLoggedIn();
      cy.visit('/');
    });

    it('Deve permanecer na rota de listagem', () => {
      cy.location('pathname').should('equal', '/');
    });

    it('Deve fazer o logout do usuário', () => {
      cy.getByTestId('header-logout').click();

      cy.location('pathname').should('equal', '/login');
    });
  });
});
