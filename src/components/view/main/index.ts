import Model from '../../model/model';
import { createElement, removeChild } from '../../helper/index';
import { IProduct, IProducts } from '../../types/index';
import starFill from '../../../assets/star_fill.png';
import star from '../../../assets/star.png';

class ViewMain {
  private main: HTMLElement | null;

  constructor() {
    this.main = document.querySelector('main');
  }

  // Отрисовка фильтра (input checkbox).
  private renderFilter(filter: HTMLElement, filterCategoty: string, model: Model): void {
    if (filter !== undefined && filterCategoty !== undefined) {
      const filterItemsBrand: Array<string> = Array.from(
        model.getFilterItems(filterCategoty).values()
      );

      const filterList: HTMLElement = createElement('ul', 'filter__items', filter);

      filterItemsBrand.forEach((item) => {
        const filterItem: HTMLElement = createElement('li', '', filterList);
        const input = createElement(
          'input',
          '',
          filterItem,
          ['type', 'checkbox'],
          ['id', item],
          ['name', item]
        ) as HTMLInputElement;

        input.setAttribute('data-category', filterCategoty);

        // проверка на использование текущего фильтра.
        if (model !== undefined) {
          input.checked = model.isFilterUsed(filterCategoty, item);
        }

        // Обработка событий выбора фильтров.
        input.addEventListener('change', (event) => {
          const target: HTMLInputElement = event.target as HTMLInputElement;

          if (target) {
            const category: string | null = target.getAttribute('data-category');
            const name: string | null = target.getAttribute('name');
            if (model !== undefined) {
              if (category !== null && name !== null) {
                model.changeFilter(category, name, target.checked);
                model.updateHash();
              }
            }
          }
        });

        const itemLabel = createElement('label', '', filterItem, ['for', item]);
        createElement('span', '', itemLabel).textContent = item;

        if (filterCategoty !== undefined && model !== undefined) {
          const categoryItemsCount = model.getCategoryItemsCount(filterCategoty, item);
          const showedItemsCount = model.getShowedItemsCount(filterCategoty, item);
          const filterCount = `(${showedItemsCount}/${categoryItemsCount})`;
          createElement('span', '', itemLabel).textContent = filterCount;
        } else {
          createElement('span', '', itemLabel).textContent = '(0/0)';
        }
      });
    }
  }

  // Отрисовать фильтр слайдер. (input range).
  private renderFilterSlider(parent: HTMLElement, id: string, model: Model): void {
    const min: number = model.getMinValues(id);
    const max: number = model.getMaxValues(id);

    const multiRangeLabel = createElement('div', 'multi__range_label', parent);

    const labelLeft = createElement('div', 'multi__range_label-left', multiRangeLabel);
    createElement('div', 'multi__range_label-center', multiRangeLabel).textContent = '⟷';
    const labelRight = createElement('div', 'multi__range_label-right', multiRangeLabel);

    let currentMinValue = model.getCurrentMinValues(id);
    if (currentMinValue === -1) {
      currentMinValue = min;
    }

    const step = id === 'price' ? 0.1 : 1;

    const multiRange = createElement('div', 'multi__range', parent);
    const inputLower = createElement(
      'input',
      '',
      multiRange,
      ['type', 'range'],
      ['id', `${id}__lower`],
      ['min', String(min)],
      ['max', String(max)],
      ['step', String(step)],
      ['value', String(currentMinValue)]
    );

    let currentMaxValue = model.getCurrentMaxValues(id);
    if (currentMaxValue === -1) {
      currentMaxValue = max;
    }

    const inputUpper = createElement(
      'input',
      '',
      multiRange,
      ['type', 'range'],
      ['id', `${id}__upper`],
      ['min', String(min)],
      ['max', String(max)],
      ['step', String(step)],
      ['value', String(currentMaxValue)]
    );

    labelLeft.textContent = String(currentMinValue);
    labelRight.textContent = String(currentMaxValue);

    [inputLower, inputUpper].forEach((item) => {
      item.addEventListener('input', () => {
        const targetInputLower: HTMLInputElement | null = inputLower as HTMLInputElement;
        const targetInputUpper: HTMLInputElement | null = inputUpper as HTMLInputElement;
        if (targetInputLower !== null && targetInputUpper !== null) {
          const min = Math.min(Number(targetInputLower.value), Number(targetInputUpper.value));
          const max = Math.max(Number(targetInputLower.value), Number(targetInputUpper.value));

          labelLeft.textContent = String(min);
          labelRight.textContent = String(max);

          model.changeFilterSlider(id, min, max);
          model.updateHash();
        }
      });
    });
  }

  // Отрисовка всех категорий фильтров.
  renderFilters(model: Model): void {
    const filtersBlock = createElement('div', 'main__filter', this.main);

    const filterControls = createElement('div', 'filter__controls', filtersBlock);
    createElement('div', 'control__reset', filterControls);
    createElement('div', 'control__copy', filterControls);

    const filterCategry = createElement('div', 'filter filter__categry', filtersBlock);
    createElement('div', 'filter__caption', filterCategry).textContent = 'Category';
    this.renderFilter(filterCategry, 'category', model);

    const filterBrand = createElement('div', 'filter filter__brand', filtersBlock);
    createElement('div', 'filter__caption', filterBrand).textContent = 'Brand';
    this.renderFilter(filterBrand, 'manufacturer', model);

    const filterSex = createElement('div', 'filter filter__sex', filtersBlock);
    createElement('div', 'filter__caption', filterSex).textContent = 'Sex';
    this.renderFilter(filterSex, 'gender', model);

    const filterPrice = createElement('div', 'filter filter__price', filtersBlock);
    createElement('div', 'filter__caption', filterPrice).textContent = 'Price';
    this.renderFilterSlider(filterPrice, 'price', model);

    const filterStock = createElement('div', 'filter filter__stock', filtersBlock);
    createElement('div', 'filter__caption', filterStock).textContent = 'Stock';
    this.renderFilterSlider(filterStock, 'stock', model);
  }

  // обновление значения и счетчиков блока фильтров.
  updateFilters(model: Model): void {
    const filterCategry: HTMLElement | null = document.querySelector('.filter__categry');
    if (filterCategry !== null) {
      removeChild(filterCategry);
      createElement('div', 'filter__caption', filterCategry).textContent = 'Category';
      this.renderFilter(filterCategry, 'category', model);
    }

    const filterBrand: HTMLElement | null = document.querySelector('.filter__brand');
    if (filterBrand !== null) {
      removeChild(filterBrand);
      createElement('div', 'filter__caption', filterBrand).textContent = 'Brand';
      this.renderFilter(filterBrand, 'manufacturer', model);
    }

    const filterSex: HTMLElement | null = document.querySelector('.filter__sex');
    if (filterSex !== null) {
      removeChild(filterSex);
      createElement('div', 'filter__caption', filterSex).textContent = 'Sex';
      this.renderFilter(filterSex, 'gender', model);
    }

    const filterPrice: HTMLElement | null = document.querySelector('.filter__price');
    if (filterPrice !== null) {
      const lower: HTMLElement | null = document.getElementById('price__lower');
      const upper: HTMLElement | null = document.getElementById('price__upper');

      if (lower !== null && upper !== null) {
        lower.setAttribute('value', String(model.getCurrentMinValues('price')));
        upper.setAttribute('value', String(model.getCurrentMaxValues('price')));
      }

      const lowerLabel: HTMLElement | null = filterPrice.querySelector('.multi__range_label-left');
      const upperLabel: HTMLElement | null = filterPrice.querySelector('.multi__range_label-right');

      if (lowerLabel !== null && upperLabel !== null) {
        lowerLabel.textContent = String(model.getCurrentMinValues('price'));
        upperLabel.textContent = String(model.getCurrentMaxValues('price'));
      }
    }

    const filterStock: HTMLElement | null = document.querySelector('.filter__stock');
    if (filterStock !== null) {
      const lower: HTMLElement | null = document.getElementById('stock__lower');
      const upper: HTMLElement | null = document.getElementById('stock__upper');

      if (lower !== null && upper !== null) {
        lower.setAttribute('value', String(model.getCurrentMinValues('stock')));
        upper.setAttribute('value', String(model.getCurrentMaxValues('stock')));
      }

      const lowerLabel: HTMLElement | null = filterStock.querySelector('.multi__range_label-left');
      const upperLabel: HTMLElement | null = filterStock.querySelector('.multi__range_label-right');

      if (lowerLabel !== null && upperLabel !== null) {
        lowerLabel.textContent = String(model.getCurrentMinValues('stock'));
        upperLabel.textContent = String(model.getCurrentMaxValues('stock'));
      }
    }
  }

  // отрисовка единицы товара
  private renderGodsCard(parrent: HTMLElement | null, item: IProduct): void {
    const prodItem = createElement('div', 'product__item', parrent);
    const itemImage = createElement('div', 'item__image', prodItem);
    itemImage.style.backgroundImage = `url(${item.thumbnail})`;
    const itemInfoBlock = createElement('div', 'item__info-block', prodItem);
    const infoCaption = createElement('div', 'info__caption', itemInfoBlock);
    createElement('span', 'caption__brand', infoCaption).textContent = item.manufacturer;
    createElement('span', '', infoCaption).textContent = ` - `;
    createElement('span', 'caption__title', infoCaption).textContent = item.title;
    const infoBlock = createElement('div', 'info__block', itemInfoBlock);
    const infoBlockLeft = createElement('div', 'info__block-left', infoBlock);
    const infoRating = createElement('div', 'info__rating', infoBlockLeft);
    const rating = createElement('span', 'rating__star', infoRating);
    for (let i = 0; i < 5; i += 1) {
      const img = new Image();
      Math.round(item.rating) >= i + 1 ? (img.src = starFill) : (img.src = star);
      img.alt = 'rating';
      img.width = 20;
      img.height = 20;
      rating.appendChild(img);
    }
    createElement('span', 'rating__value', infoRating).textContent = ` (${item.rating}) `;
    createElement('span', 'rating__stock', infoRating).textContent = String(item.stock);
    const infoPrice = createElement('div', 'info__price', infoBlockLeft);
    createElement('span', 'price__currency', infoPrice).textContent = `$`;
    if (item.discountPercentage > 0) {
      const currentPrice = item.price - (item.price / 100) * item.discountPercentage;
      const priceValue = createElement('span', 'price__value', infoPrice);
      priceValue.textContent = String(Math.trunc(currentPrice));
      const value = ' ' + String(Math.round((item.price % 1) * 100)).padStart(2, '0');
      createElement('span', '', priceValue).textContent = value;
      createElement('span', 'price__discont', infoPrice).textContent = `$${item.price}`;
    } else {
      const priceValue = createElement('span', 'price__value', infoPrice);
      priceValue.textContent = String(Math.trunc(item.price));
      const value = ' ' + String(Math.round((item.price % 1) * 100)).padStart(2, '0');
      createElement('span', '', priceValue).textContent = value;
      createElement('span', 'price__discont', infoPrice);
    }
    const infoBlockRight = createElement('div', 'info__block-right', infoBlock);
    createElement('div', 'add-to-cart_control', infoBlockRight);
  }

  // отрисовка блока товаров
  renderGods(model: Model): void {
    let goodsBlock: HTMLElement | null = document.querySelector('.main__products');

    if (goodsBlock === null) {
      goodsBlock = createElement('div', 'main__products', this.main);
    } else {
      removeChild(goodsBlock);
    }

    const items: IProducts = model.getGoods();
    items.products.forEach((item: IProduct) => {
      this.renderGodsCard(goodsBlock, item);
    });
  }

  // Отрисовка главной страницы
  render(model: Model): void {
    const wrapper: HTMLElement | null = document.querySelector('.main-wrapper');

    if (wrapper === null) {
      this.main = createElement('div', 'main-wrapper', this.main);
    }

    // если фильтры уже есть то Update иначе Render.
    const filtersBlock: HTMLElement | null = document.querySelector('.main__filter');

    filtersBlock === null ? this.renderFilters(model) : this.updateFilters(model);

    this.renderGods(model);
  }
}

export default ViewMain;
