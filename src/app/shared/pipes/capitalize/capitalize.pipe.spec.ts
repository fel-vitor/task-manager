import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
  it('Deve retornar o texto com a primeira letra maiúscula', () => {
    const pipe = new CapitalizePipe();

    const fekeText = "essa é uma tarefa de mentira";
    const result = "Essa é uma tarefa de mentira";

    expect(pipe.transform(fekeText)).toBe(result);
  });
});
