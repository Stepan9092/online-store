import Model from '../../model/model';
import { createElement, removeChild } from '../../helper/index';
import { IProduct } from '../../types/index';

class ViewGoods {
  private wrapper: HTMLElement | null = null;
  private main: HTMLElement | null;

  constructor() {
    this.main = document.querySelector('main');
  }

  testText(parrent: HTMLElement, item: IProduct, model: Model): void {
    // image
    // console.log(item);
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
      const previewImage = createElement(
        'img',
        'goods__photo-preview_image',
        photoPreview,
        ['alt', 'goods image preview'],
        ['src', itemImage]
      );

      previewImage.addEventListener('click', () => {
        photoImage.setAttribute('src', itemImage);
      });
    });

    // info
    const info = createElement('div', 'goods__info', discription);
    createElement('div', 'goods__info-caption', info).textContent = 'Description:';
    createElement('div', 'goods__info-value', info).textContent = item.description;
    createElement('div', 'goods__info-caption', info).textContent = 'Discount Percentage:';
    createElement('div', 'goods__info-value', info).textContent = '' + item.discountPercentage;
    createElement('div', 'goods__info-caption', info).textContent = 'Rating:';
    createElement('div', 'goods__info-value', info).textContent = '' + item.rating;
    createElement('div', 'goods__info-caption', info).textContent = 'Stock:';
    createElement('div', 'goods__info-value', info).textContent = '' + item.stock;
    createElement('div', 'goods__info-caption', info).textContent = 'Brand:';
    createElement('div', 'goods__info-value', info).textContent = '' + item.manufacturer;
    createElement('div', 'goods__info-caption', info).textContent = 'Category:';
    createElement('div', 'goods__info-value', info).textContent = '' + item.category;

    // cart
    const cart = createElement('div', 'goods__cart', discription);
    createElement('div', 'goods__cart-price', cart).textContent = `${item.price} $`;
    const addToCart = createElement('div', 'goods__cart__add-btn', cart);
    if (model.isIDInCart(item.id)) {
      addToCart.textContent = 'DROP FROM CART';
    } else {
      addToCart.textContent = 'ADD TO CART';
    }

    addToCart.addEventListener('click', () => {
      model.addCart(item.id);

      if (model.isIDInCart(item.id)) {
        addToCart.textContent = 'DROP FROM CART';
      } else {
        addToCart.textContent = 'ADD TO CART';
      }
    });

    const buyNow = createElement('div', 'goods__cart__buy-btn', cart);
    buyNow.textContent = 'BUY NOW';
    buyNow.addEventListener('click', () => {
      if (model.isIDInCart(item.id) === false) {
        model.addCart(item.id);
      }
      document.location.hash = '#/cart';
    });
  }

  render(item: IProduct, model: Model): void {
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

    this.testText(this.wrapper, item, model);
  }
}

export default ViewGoods;
