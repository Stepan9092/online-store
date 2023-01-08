import Model from '../../model/model';
import { createElement, removeChild } from '../../helper/index';
import { IParametr, IProduct, IPromo } from '../../types/index';

class ViewCart {
  private wrapper: HTMLElement | null = null;
  private main: HTMLElement | null;

  constructor() {
    this.main = document.querySelector('main');
  }

  renderCart(items: Array<IProduct>, parametr: Array<IParametr>, model: Model) {
    let limit = 3;
    let page = 1;

    parametr.forEach((item) => {
      if (item['parametr'] === 'limit') limit = Number(item['value']);
      if (item['parametr'] === 'page') page = Number(item['value']);
    });

    const itemsLength = items.length;
    items = items.filter(
      (item: IProduct, index: number) => index >= (page - 1) * limit && index < page * limit
    );

    if (items.length === 0) {
      const title = createElement('h2', 'cart-empty__title', this.wrapper);
      title.textContent = 'Cart is empty';
      return;
    }

    const cartBlock = createElement('div', 'cart', this.wrapper);
    const cartHeader = createElement('div', 'cart__header', cartBlock);

    const cartHeaderTitle = createElement('div', 'cart__title', cartHeader);
    cartHeaderTitle.textContent = 'Products In Cart';

    const cartParams = createElement('div', 'cart__params', cartHeader);
    const limitBlock = createElement('div', 'limit', cartParams);
    const limitText = createElement('div', 'limit__text', limitBlock);
    limitText.textContent = 'limit: ';
    const limitInput = createElement(
      'input',
      'limit__input',
      limitBlock,
      ['max', `${itemsLength}`],
      ['min', '1'],
      ['type', 'number'],
      ['value', `${limit}`]
    );

    limitInput.addEventListener('change', (e) => {
      limit = Number((e.target as HTMLInputElement).value);
      while (itemsLength <= (page - 1) * limit) {
        page = page - 1;
      }
      model.changeHashCart(page, limit);
    });

    const pageBlock = createElement('div', 'page', cartParams);

    const prevPage = createElement('button', 'page__btn-prev', pageBlock);
    prevPage.textContent = '<';
    prevPage.addEventListener('click', () => {
      if (page != 1) {
        page = page - 1;
        model.changeHashCart(page, limit);
      }
    });

    const pageText = createElement('div', 'page__text', pageBlock);
    pageText.textContent = `${page}`;
    const nextPage = createElement('button', 'page__btn-next', pageBlock);
    nextPage.textContent = '>';
    nextPage.addEventListener('click', () => {
      if (page * limit < itemsLength) {
        page = page + 1;
        model.changeHashCart(page, limit);
      }
    });

    const cartList = createElement('div', 'cart__list', cartBlock);
    items.forEach((item: IProduct, index) => {
      this.renderProduct(parametr, model, item, index, page, limit, 1, cartList);
    });
  }

  renderSummary(
    items: Array<IProduct>,
    promocods: Array<IPromo>,
    apliedPromocods: Array<IPromo> = []
  ) {
    let summary = document.querySelector('.summary') as HTMLElement;
    if (summary) removeChild(summary);
    else summary = createElement('div', 'summary', this.wrapper);

    const summaryHeader = createElement('div', 'summary__header', summary);
    const summaryTitle = createElement('div', 'summary__header', summaryHeader);
    summaryTitle.textContent = 'Summary';
    const summaryTotal = createElement('div', 'summary__total', summary);
    const summaryProducts = createElement('div', 'summary__products', summaryTotal);
    summaryProducts.textContent = `Products: ${items.length}`;
    const summaryPrice = createElement('div', 'summary__price', summaryTotal);
    const sumTotal = items.reduce(
      (prev, item) => prev + item.price * ((100 - item.discountPercentage) / 100),
      0
    );
    summaryPrice.textContent = `Total: ${Number(sumTotal).toFixed(2)}$`;

    if (apliedPromocods.length !== 0) {
      const promo = createElement('div', 'promo', summaryTotal);
      const promoHeader = createElement('div', 'promo__header', promo);
      promoHeader.textContent = 'Applied codes';

      const promoItems = createElement('div', 'promo__items', promo);
      apliedPromocods.forEach((item) => {
        const promoItem = createElement('div', 'promo__item', promoItems);
        const promoText = createElement('div', 'promo__text', promoItem);
        promoText.textContent = `${item.title} - ${item.discount}%`;
        const promoBtn = createElement('button', 'promo__btn', promoItem);
        promoBtn.textContent = 'drop';
        promoBtn.addEventListener('click', () => {
          this.renderSummary(
            items,
            promocods,
            apliedPromocods.filter((code) => code.code !== item.code)
          );
        });
      });
    }

    const inputCode = createElement('input', 'summary__input', summaryTotal, ['type', 'text']);
    inputCode.addEventListener('input', (e) => {
      // console.log(e.target.value);
    });

    const summatyText = createElement('div', 'summary__text', summaryTotal);
    summatyText.textContent = `Promo for test: 'RS', 'YEAH'`;
    const buyBtn = createElement('button', 'summary__btn', summaryTotal);
    buyBtn.textContent = 'BUY NOW';
  }

  renderProduct(
    parametr: Array<IParametr>,
    model: Model,
    item: IProduct,
    index: number,
    page: number,
    limit: number,
    amount: number,
    parent: HTMLElement
  ) {
    const product = createElement('div', 'cart-item', parent);
    const productIndex = createElement('div', 'cart-item__index', product);
    productIndex.textContent = `${(page - 1) * limit + index + 1}`;
    const productInfoBlock = createElement('div', 'cart-item__info', product);
    const productImg = createElement(
      'img',
      'cart-item__image',
      productInfoBlock
    ) as HTMLImageElement;
    productImg.src = item.thumbnail;
    const productInfo = createElement('div', 'cart-item__container', productInfoBlock);
    const productName = createElement('div', 'cart-item__name', productInfo);
    productName.textContent = item.title;
    const productDescription = createElement('div', 'cart-item__description', productInfo);
    productDescription.textContent = item.description;

    const productAdditionalInfo = createElement('div', 'cart-item__addInfo', productInfo);
    const category = createElement('div', 'cart-item__category', productAdditionalInfo);
    category.textContent = `category: ${item.category}`;
    const rating = createElement('div', 'cart-item__rating', productAdditionalInfo);
    rating.textContent = `rating: ${item.rating}`;
    const discount = createElement('div', 'cart-item__rating', productAdditionalInfo);
    discount.textContent = `discount: ${item.rating}%`;

    const countControl = createElement('div', 'cart-item__control', product);
    const stock = createElement('div', 'cart-item__stock', countControl);
    stock.textContent = `Stock: ${item.stock}`;
    const numberControl = createElement('div', 'cart-item__numberControl', countControl);
    const minusCount = createElement('button', 'cart-item__numberMinus', numberControl);
    minusCount.textContent = '-';
    minusCount.addEventListener('click', () => {
      /*

      */
      this.render(parametr, model);
    });
    const count = createElement('span', 'cart-item__count', numberControl);
    count.textContent = `${amount}`;
    const plusCount = createElement('button', 'cart-item__numberPlus', numberControl);
    plusCount.textContent = '+';
    plusCount.addEventListener('click', () => {
      /*

      */
      this.render(parametr, model);
    });
    const price = createElement('div', 'cart-item__price', countControl);
    price.textContent = `${((item.price * (100 - item.discountPercentage)) / 100).toFixed(2)}$`;
  }

  render(parametr: Array<IParametr>, model: Model): void {
    const wrapper: HTMLElement | null = document.querySelector('.cart-wrapper');

    // Если .cart-wrapper нету -> значит страница загружается первый раз, добавляем .cart-wrapper
    // иначе -> очищаем .cart-wrapper и перерисовываем.
    if (wrapper === null) {
      if (this.main !== null) {
        removeChild(this.main);
      }

      this.wrapper = createElement('div', 'cart-wrapper', this.main);
    } else {
      this.wrapper = wrapper;
      removeChild(this.wrapper);
    }

    const items: Array<IProduct> = model.getGoodsByIPs([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
    ]).products;
    this.renderCart(items, parametr, model);
    this.renderSummary(
      items,
      [
        { code: 'RS', discount: '10', title: 'rolling scopes school' },
        { code: 'YEAH', discount: '10', title: 'yeah' },
      ],
      [
        { code: 'RS', discount: '10', title: 'rolling scopes school' },
        { code: 'YEAH', discount: '10', title: 'yeah' },
      ]
    );
  }
}

export default ViewCart;
