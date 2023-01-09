import { createElement, removeChild } from '../../helper/index';
import { IProduct } from '../../types/index';

class ViewGoods {
  private wrapper: HTMLElement | null = null;
  private main: HTMLElement | null;

  constructor() {
    this.main = document.querySelector('main');
  }

  testText(parrent: HTMLElement, item: IProduct): void {
    //createElement('h1', '', parrent).textContent = 'GOODS';
    //createElement('h2', '', parrent).textContent = `GOODS ID ${String(id)}`;
    console.log(item);
    const nav = createElement('div', 'goods__navigation', parrent);
    nav.textContent = `${item.gender} / ${item.category} / ${item.manufacturer} / ${item.title}`;
    const goods = createElement('div', 'goods', parrent);
    const caption = createElement('div', 'goods__header', goods);
    createElement('div', 'goods__header-caption', caption).textContent = item.title;
    const discription = createElement('div', 'goods__discription', goods);
    const photo = createElement('div', 'goods__photo', discription);
    const photoPreview = createElement('div', 'goods__photo-preview', photo);
    const photoMain = createElement('div', 'goods__photo-main', photo);
    const photoImage = createElement(
      'img',
      'goods__photo-main_image',
      photoMain,
      ['alt', 'goods image'],
      ['src', item.thumbnail]
    );
    item.images.forEach((itemImage) => {
      const photoImage = createElement(
        'img',
        'goods__photo-preview_image',
        photoPreview,
        ['alt', 'goods image'],
        ['src', itemImage]
      );
    });
    createElement('div', 'goods__info', discription);
    createElement('div', 'goods__cart', discription);
  }

  render(item: IProduct): void {
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

    this.testText(this.wrapper, item);
  }
}

export default ViewGoods;
