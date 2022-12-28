import logoPicture from '../../img/logo-header.png';
import cartIconPicture from '../../img/icon-cart.png';
import { createElement } from '../../functions/create';
import './header.scss';

class Header {
  container: HTMLElement;

  constructor() {
    this.container = createElement('header', 'header');
    this.createHeader();
    this.onClickBasket();
  }

  createHeader() {
    const logo = createElement(
      'div',
      'header__logo',
      createElement('img', 'header__img', null, null, ['src', logoPicture], ['alt', 'logo picture'])
    );
    const sum = createElement('div', 'header__sum', [
      createElement('span', 'header__sumText', 'Cart total: ', null),
      createElement('span', 'header__sumAmount', '0', null),
    ]);
    const basket = createElement('div', 'header__basket', [
      createElement(
        'img',
        'header__basketImage',
        null,
        null,
        ['src', cartIconPicture],
        ['alt', 'basket icon']
      ),
      createElement('span', 'header__basketAmount', '0', null),
    ]);
    const wrapper = createElement('div', 'header-wrapper', [logo, sum, basket], null);
    this.container.append(wrapper);
    document.body.prepend(this.container);
  }

  onClickBasket() {
    document.querySelector('.header__basket')?.addEventListener('click', () => {
      window.location.hash = 'cart';
    });
  }

  static changeSumHeader(sum: string) {
    const sumEl = document.querySelector('.header__sumAmount') as HTMLElement;
    if (sumEl) {
      sumEl.innerText = sum;
    }
  }
}

export default Header;
