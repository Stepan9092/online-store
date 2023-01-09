import { createElement, removeChild } from '../../helper/index';

class ViewGoods {
  private wrapper: HTMLElement | null = null;
  private main: HTMLElement | null;

  constructor() {
    this.main = document.querySelector('main');
  }

  testText(parrent: HTMLElement, id: number): void {
    createElement('h1', '', parrent).textContent = 'GOODS';
    createElement('h2', '', parrent).textContent = `GOODS ID ${String(id)}`;
  }

  render(id: number): void {
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

    this.testText(this.wrapper, id);
  }
}

export default ViewGoods;
