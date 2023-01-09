import Model from '../../model/model';
import { createElement, removeChild } from '../../helper/index';
import { ICartProduct, IParametr, IProduct, IPromo } from '../../types/index';
import cardPicture from '../../../assets/card-template.jpg';
import masterCard from '../../../assets/mastercard.jpg';
import visa from '../../../assets/visa.webp';
import mir from '../../../assets/mir.png';
import americanExpress from '../../../assets/americanExpress.webp';

class ViewCart {
  private wrapper: HTMLElement | null = null;
  private main: HTMLElement | null;

  constructor() {
    this.main = document.querySelector('main');
  }

  isValidGenerate(className: string, reg: RegExp, errorMessage: string) {
    return (value: string) => {
      const parent = document.querySelector(className) as HTMLElement;
      let errorBlock = parent.querySelector('.app-modal__error') as HTMLElement;
      if (!errorBlock) {
        errorBlock = createElement('div', 'app-modal__error', parent);
      }
      if (!reg.test(value)) errorBlock.textContent = errorMessage;
      else parent.removeChild(errorBlock);
      return reg.test(value);
    };
  }

  showModal() {
    const isValidName = this.isValidGenerate(
      '.app-modal__item-name',
      /^([a-zA-Zа-яА-Я]{3,24}\s){1,3}[a-zA-Zа-яА-Я]{3,24}$/,
      'error'
    );
    const isValidPhone = this.isValidGenerate('.app-modal__item-phone', /^\+[0-9]{9,15}$/, 'error');
    const isValidAddress = this.isValidGenerate(
      '.app-modal__item-address',
      /^[\S]{5,24} *[\S]{5,24} *[\S]{5,24}/,
      'error'
    );
    const isValidEmail = this.isValidGenerate(
      '.app-modal__item-email',
      /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
      'error'
    );
    const isValidCardNumber = this.isValidGenerate(
      '.card-errors__number',
      /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/,
      'Card number - error'
    );
    const isValidThru = this.isValidGenerate(
      '.card-errors__thru',
      /^([0]{1}[0-9]|[1]{1}[0-2]{1}){1}\/[0-9]{2}$/,
      'Card valid thru - error'
    );
    const isValidCVV = this.isValidGenerate('.card-errors__cvv', /^[0-9]{3}$/, 'Card CVV - error');
    const modal = createElement('div', 'app-modal', document.body);
    const modalBlock = createElement('div', 'app-modal__container', modal);
    modal.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target === modal) modal.remove();
    });
    const modalTitle = createElement('h2', 'app-modal__title', modalBlock);
    modalTitle.textContent = 'Personal details';
    const modalForm = createElement('form', 'app-modal__form', modalBlock);

    const modalName = createElement('div', 'app-modal__item app-modal__item-name', modalForm);
    const nameInput = createElement('input', 'app-modal__input', modalName, [
      'placeholder',
      'name',
    ]) as HTMLInputElement;
    nameInput.addEventListener('blur', (e) => {
      const value = (e.target as HTMLInputElement).value;
      isValidName(value);
    });

    const modalPhone = createElement('div', 'app-modal__item app-modal__item-phone', modalForm);
    const phoneInput = createElement('input', 'app-modal__input', modalPhone, [
      'placeholder',
      'phone',
    ]) as HTMLInputElement;
    phoneInput.addEventListener('blur', (e) => {
      const value = (e.target as HTMLInputElement).value;
      isValidPhone(value);
    });

    const modalAddress = createElement('div', 'app-modal__item app-modal__item-address', modalForm);
    const addressInput = createElement('input', 'app-modal__input', modalAddress, [
      'placeholder',
      'address',
    ]) as HTMLInputElement;
    addressInput.addEventListener('blur', (e) => {
      const value = (e.target as HTMLInputElement).value;
      isValidAddress(value);
    });
    const modalEmail = createElement('div', 'app-modal__item app-modal__item-email', modalForm);
    const emailInput = createElement('input', 'app-modal__input', modalEmail, [
      'placeholder',
      'email',
    ]) as HTMLInputElement;
    emailInput.addEventListener('blur', (e) => {
      const value = (e.target as HTMLInputElement).value;
      isValidEmail(value);
    });

    const cardTitle = createElement('h2', 'app-modal__title', modalForm);
    cardTitle.textContent = 'Credit card details';
    const card = createElement('div', 'card', modalForm);
    const cardNumber = createElement('div', 'card__number', card);
    const cardImage = createElement('img', 'card__image', cardNumber) as HTMLImageElement;
    cardImage.src = cardPicture;
    const cardNumberInput = createElement(
      'input',
      'app-modal__input app-modal__input-card',
      cardNumber,
      ['placeholder', 'Card Number'],
      ['maxlength', '19']
    ) as HTMLInputElement;
    cardNumberInput.addEventListener('input', function (e) {
      const event = e as InputEvent;
      const enteredSymbol = event.data;
      const indexsOfSpace = [4, 9, 14];
      const firstLetter = this.value[0];
      switch (firstLetter) {
        case '2': {
          cardImage.src = mir;
          break;
        }
        case '3': {
          cardImage.src = americanExpress;
          break;
        }
        case '4': {
          cardImage.src = visa;
          break;
        }
        case '5': {
          cardImage.src = masterCard;
          break;
        }
        default: {
          cardImage.src = cardPicture;
        }
      }
      if (enteredSymbol != null)
        if (indexsOfSpace.includes(this.value.length)) {
          this.value += ' ';
        }
      this.value = `${this.value.replace(/[^\d ]/g, '')}`;
    });
    cardNumberInput.addEventListener('blur', function () {
      isValidCardNumber(this.value);
    });

    const cardData = createElement('div', 'card__data', card);
    const cardThru = createElement('div', 'card__thru', cardData);
    const cardThruText = createElement('div', 'card__text', cardThru);
    cardThruText.textContent = 'VALID:';
    const cardThruInput = createElement(
      'input',
      'card__input',
      cardThru,
      ['placeholder', 'Valid Thru'],
      ['maxlength', '5']
    ) as HTMLInputElement;
    cardThruInput.addEventListener('input', function (e) {
      const event = e as InputEvent;
      const enteredSymbol = event.data;
      if (enteredSymbol != null) {
        if (this.value.length == 2) this.value += '/';
      }
      this.value = `${this.value.replace(/[^\d/]/g, '')}`;
    });
    cardThruInput.addEventListener('blur', function () {
      isValidThru(this.value);
    });
    const cardCVV = createElement('div', 'card__cvv', cardData);
    const cardCVVText = createElement('div', 'card__text', cardCVV);
    cardCVVText.textContent = 'CVV:';
    const cardCVVInput = createElement(
      'input',
      'card__input',
      cardCVV,
      ['placeholder', 'Code'],
      ['maxlength', '3']
    ) as HTMLInputElement;
    cardCVVInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^\d]/g, '');
    });
    cardCVVInput.addEventListener('blur', function () {
      isValidCVV(this.value);
    });
    const errorsBlock = createElement('div', 'card-errors', modalForm);
    createElement('div', 'card-errors__number card-errors__item', errorsBlock);
    createElement('div', 'card-errors__thru card-errors__item', errorsBlock);
    createElement('div', 'card-errors__cvv card-errors__item', errorsBlock);
    const cardSubmit = createElement(
      'input',
      'app-modal__submit',
      modalForm,
      ['type', 'submit'],
      ['value', 'CONFIRM']
    );
    cardSubmit.addEventListener('click', () => {
      isValidName(nameInput.value);
      isValidAddress(addressInput.value);
      isValidPhone(phoneInput.value);
      isValidEmail(emailInput.value);
      isValidCVV(cardCVVInput.value);
      isValidCardNumber(cardNumberInput.value);
      isValidThru(cardThruInput.value);
      if (
        isValidName(nameInput.value) &&
        isValidAddress(addressInput.value) &&
        isValidPhone(phoneInput.value) &&
        isValidEmail(emailInput.value) &&
        isValidCVV(cardCVVInput.value) &&
        isValidCardNumber(cardNumberInput.value) &&
        isValidThru(cardThruInput.value)
      ) {
        removeChild(modalBlock);
        modalBlock.classList.add('modal-redirect');
        modalBlock.textContent = 'Thanks for your order. Redirect to the store after 3 sec';
        setTimeout(() => {
          document.body.removeChild(modal);
          window.location.hash = '#/main';
        }, 3000);
      }
    });
  }

  renderCart(items: Array<ICartProduct>, parametr: Array<IParametr>, model: Model) {
    let limit = 3;
    let page = 1;

    parametr.forEach((item) => {
      if (item['parametr'] === 'limit') limit = Number(item['value']);
      if (item['parametr'] === 'page') page = Number(item['value']);
    });

    const itemsPage = items.filter(
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
      ['max', `${items.length}`],
      ['min', '1'],
      ['type', 'number'],
      ['value', `${limit}`]
    );

    limitInput.addEventListener('change', (e) => {
      limit = Number((e.target as HTMLInputElement).value);
      while (items.length <= (page - 1) * limit) {
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
      if (page * limit < items.length) {
        page = page + 1;
        model.changeHashCart(page, limit);
      }
    });

    const cartList = createElement('div', 'cart__list', cartBlock);
    itemsPage.forEach((item: ICartProduct, index) => {
      this.renderProduct(parametr, model, item, index, page, limit, cartList);
    });
  }

  renderSummary(
    items: Array<ICartProduct>,
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
    const totalProducts = items.reduce((prev, el) => prev + el.count, 0);
    summaryProducts.textContent = `Products: ${totalProducts}`;
    const summaryPrice = createElement('div', 'summary__price', summaryTotal);
    const sumTotal = items.reduce((prev, item) => prev + item.price * item.count, 0);
    summaryPrice.textContent = `Total: ${Number(sumTotal).toFixed(2)}$`;
    if (apliedPromocods.length !== 0) {
      const summaryPriceDiscount = createElement('div', 'summary__price', summaryTotal);
      const discountPercentage = apliedPromocods.reduce(
        (prev, next) => prev + Number(next.discount),
        0
      );
      const sumDiscount = (sumTotal * (100 - discountPercentage)) / 100;
      summaryPriceDiscount.textContent = `Total: ${sumDiscount.toFixed(2)}$`;
      summaryPrice.classList.add('summary__total-crossline');
    }

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
    const enteredCodeBlock = createElement('div', 'summary__enteredCode', summaryTotal);
    inputCode.addEventListener('input', (e) => {
      const enteredValue = (e.target as HTMLInputElement).value;
      const enteredCode = <IPromo>promocods.find((el) => el.code === enteredValue.toUpperCase());
      if (enteredCode) {
        const enteredCodeText = createElement('div', 'promo__text', enteredCodeBlock);
        enteredCodeText.textContent = `${enteredCode.title} - ${enteredCode.discount}%`;
        if (!apliedPromocods.find((el) => el.code === enteredCode.code)) {
          const enteredCodeBtn = createElement('button', 'promo__btn', enteredCodeBlock);
          enteredCodeBtn.textContent = 'add';
          enteredCodeBtn.addEventListener('click', () => {
            apliedPromocods.push(enteredCode);
            this.renderSummary(items, promocods, apliedPromocods);
          });
        }
      } else {
        removeChild(enteredCodeBlock);
      }
    });

    const summatyText = createElement('div', 'summary__text', summaryTotal);
    summatyText.textContent = `Promo for test: 'RS', 'YEAH'`;
    const buyBtn = createElement('button', 'summary__btn', summaryTotal);
    buyBtn.textContent = 'BUY NOW';
    buyBtn.addEventListener('click', () => {
      this.showModal();
    });
  }

  renderProduct(
    parametr: Array<IParametr>,
    model: Model,
    item: ICartProduct,
    index: number,
    page: number,
    limit: number,
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
        удаление элемента из localStorage
      */
      this.render(parametr, model);
    });
    const count = createElement('span', 'cart-item__count', numberControl);
    count.textContent = `${item.count}`;
    const plusCount = createElement('button', 'cart-item__numberPlus', numberControl);
    plusCount.textContent = '+';
    plusCount.addEventListener('click', () => {
      if (item.count + 1 <= item.stock)
        /*
        добавление элемента в localStorage
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

    // пример данных с localStorage
    const data = [
      { id: '1', count: '4' },
      { id: '2', count: '4' },
      { id: '3', count: '4' },
      { id: '4', count: '4' },
      { id: '14', count: '2' },
      { id: '11', count: '4' },
      { id: '31', count: '2' },
    ];

    const items: Array<ICartProduct> = model
      .getGoodsByIPs(data.map((el) => el.id))
      .products.map((el, index) => {
        return { ...el, count: Number(data[index].count) };
      });

    const promocods: Array<IPromo> = [
      { code: 'RS', discount: '10', title: 'rolling scopes school' },
      { code: 'YEAH', discount: '10', title: 'yeah' },
    ];

    this.renderCart(items, parametr, model);
    this.renderSummary(items, promocods);
  }
}

export default ViewCart;
