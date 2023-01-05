import logoPicture from '../../../assets/logo-header.png';
import cartIconPicture from '../../../assets/icon-cart.png';
import { createElement } from '../../helper/index';

class Header {
  container: HTMLElement | null;

  constructor() {
    this.container = document.querySelector('header');
    this.createHeader();
    this.onClickBasket();
  }

  createHeader() {
    this.container?.classList.add('header');
    const wrapper = createElement('div', 'header-wrapper', this.container);
    const logo = createElement('div', 'header__logo', wrapper);
    createElement('img', 'header__img', logo, ['alt', 'logo picture'], ['src', logoPicture]);
    const sum = createElement('div', 'header__sum', wrapper);
    const sumText = createElement('span', 'header__sumText', sum);
    sumText.innerText = 'Cart total: ';
    const sumAmount = createElement('span', 'header__sumAmount', sum);
    sumAmount.innerText = '0';
    const basket = createElement('div', 'header__basket', wrapper);
    createElement(
      'img',
      'header__basketImage',
      basket,
      ['src', cartIconPicture],
      ['alt', 'basket icon']
    );

    const basketAmount = createElement('span', 'header__basketAmount', basket);
    basketAmount.innerText = '0';
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

  static changeBasketAmount(num: string) {
    const basketAmount = document.querySelector('.header__basketAmount') as HTMLElement;
    if (basketAmount) {
      basketAmount.innerText = num;
    }
  }
}

export default Header;
