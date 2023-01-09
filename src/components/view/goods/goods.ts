import { createElement, removeChild } from '../../helper/index';
import { IParametr } from '../../types/index';

class ViewGoods {
  private wrapper: HTMLElement | null = null;
  private main: HTMLElement | null;

  constructor() {
    this.main = document.querySelector('main');
  }

  testText(parrent: HTMLElement, text: string): void {
    createElement('h1', '', this.wrapper).textContent = 'GOODS';
    createElement('h2', '', this.wrapper).textContent = text;
  }

  render(parametr: Array<IParametr>): void {
    const wrapper: HTMLElement | null = document.querySelector('.goods-wrapper');

    // Если .cart-wrapper нету -> значит страница загружается первый раз, добавляем .cart-wrapper
    // иначе -> очищаем .cart-wrapper и перерисовываем.
    if (wrapper === null) {
      if (this.main !== null) {
        removeChild(this.main);
      }

      this.wrapper = createElement('div', 'goods-wrapper', this.main);
    } else {
      this.wrapper = wrapper;
      removeChild(this.wrapper);
    }

    this.testText(this.wrapper, JSON.stringify(parametr));
  }
}

export default ViewGoods;
