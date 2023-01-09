import { createElement, removeChild } from '../../helper/index';

class ViewError {
  private wrapper: HTMLElement | null = null;
  private main: HTMLElement | null;

  constructor() {
    this.main = document.querySelector('main');
  }

  renderError(): void {
    createElement('div', 'error-message', this.wrapper).textContent = 'PAGE NOT FOUND (404)';
  }

  render(): void {
    const wrapper: HTMLElement | null = document.querySelector('.error-wrapper');

    // Если .cart-wrapper нету -> значит страница загружается первый раз, добавляем .cart-wrapper
    // иначе -> очищаем .cart-wrapper и перерисовываем.
    if (wrapper === null) {
      if (this.main !== null) {
        removeChild(this.main);
      }

      this.wrapper = createElement('div', 'error-wrapper', this.main);
    } else {
      this.wrapper = wrapper;
      removeChild(this.wrapper);
    }

    this.renderError();
  }
}

export default ViewError;
