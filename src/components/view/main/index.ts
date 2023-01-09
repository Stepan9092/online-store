import Model from '../../model/model';
import { createElement, removeChild } from '../../helper/index';
import { IProduct, IProducts } from '../../types/index';
import starFill from '../../../assets/star_fill.png';
import star from '../../../assets/star.png';
import cart1 from '../../../assets/cart1.png';
import cart2 from '../../../assets/cart2.png';

class ViewMain {
  private main: HTMLElement | null;
  private wrapper: HTMLElement | null = null;

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

    const step = id === 'price' ? 1 : 1;
    // const step = id === 'price' ? 0.1 : 1;

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
    const filtersBlock = createElement('div', 'main__filter', this.wrapper);

    const filterControls = createElement('div', 'filter__controls', filtersBlock);
    const constrolReset = createElement('div', 'control__reset', filterControls);
    constrolReset.textContent = 'Reset filter';

    constrolReset.addEventListener('click', () => (document.location.hash = '#/main'));

    const controlCopy = createElement('div', 'control__copy', filterControls);
    controlCopy.textContent = 'Copy URL';

    controlCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(location.href);
      controlCopy.textContent = 'Copied!!!';

      setTimeout(() => {
        controlCopy.textContent = 'Copy URL';
      }, 2000);
    });

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
  private updateFilters(model: Model): void {
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
      const lower: HTMLInputElement | null = document.getElementById(
        'price__lower'
      ) as HTMLInputElement;
      const upper: HTMLInputElement | null = document.getElementById(
        'price__upper'
      ) as HTMLInputElement;

      if (lower !== null && upper !== null) {
        lower.value = String(model.getCurrentMinValues('price'));
        upper.value = String(model.getCurrentMaxValues('price'));
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
      const lower: HTMLInputElement | null = document.getElementById(
        'stock__lower'
      ) as HTMLInputElement;
      const upper: HTMLInputElement | null = document.getElementById(
        'stock__upper'
      ) as HTMLInputElement;

      if (lower !== null && upper !== null) {
        lower.value = String(model.getCurrentMinValues('stock'));
        upper.value = String(model.getCurrentMaxValues('stock'));
      }

      const lowerLabel: HTMLElement | null = filterStock.querySelector('.multi__range_label-left');
      const upperLabel: HTMLElement | null = filterStock.querySelector('.multi__range_label-right');

      if (lowerLabel !== null && upperLabel !== null) {
        lowerLabel.textContent = String(model.getCurrentMinValues('stock'));
        upperLabel.textContent = String(model.getCurrentMaxValues('stock'));
      }
    }
  }

  private updateGoodsControls(model: Model): void {
    const currentSort = model.getCurrentSort();
    const select = document.querySelectorAll('.goods__sort-select > option');

    select.forEach((item, index) => {
      const currentItem: HTMLOptionElement = item as HTMLOptionElement;
      currentItem.selected = index === currentSort ? true : false;
    });

    const input: HTMLInputElement | null = document.querySelector('.goods__search');

    if (input !== null) {
      input.value = model.getCurrentSearch();
    }
  }

  // отрисовка единицы товара
  private renderGodsCard(parrent: HTMLElement | null, item: IProduct, model: Model): void {
    const prodItem = createElement('div', 'product__item', parrent);
    const itemImage = createElement('div', 'item__image', prodItem);
    itemImage.style.backgroundImage = `url(${item.thumbnail})`;
    itemImage.addEventListener('click', () => (document.location.hash = '#/goods?id=' + item.id));
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
    const cartButton = createElement('div', 'add-to-cart_control', infoBlockRight);
    if (model.isIDInCart(item.id)) {
      cartButton.style.backgroundImage = `url(${cart2})`;
    } else {
      cartButton.style.backgroundImage = `url(${cart1})`;
    }

    cartButton.addEventListener('click', () => {
      model.addCart(item.id);
      model.logCart();
      model.updateHash();
    });
  }

  private renderControls(model: Model): void {
    const goodsBlock: HTMLElement | null = document.querySelector('.main__goods');

    // добавить панель с элементами управления.
    const controlWrapper: HTMLElement = createElement('div', 'goods__controls', goodsBlock);

    const currentSort = model.getCurrentSort();

    const select = createElement('select', 'goods__sort-select', controlWrapper, ['name', 'sort']);
    [
      'Sort option:',
      'Sort by price &uarr;',
      'Sort by price &darr;',
      'Sort by stock &uarr;',
      'Sort by stock &darr;',
    ].forEach((item, index) => {
      if (currentSort === index) {
        createElement(
          'option',
          '',
          select,
          ['selected', 'selected'],
          ['value', String(index)]
        ).innerHTML = item;
      } else {
        createElement('option', '', select, ['value', String(index)]).innerHTML = item;
      }
    });

    select.addEventListener('input', (event: Event) => {
      const target: HTMLSelectElement | null = event.target as HTMLSelectElement;
      if (HTMLSelectElement !== null) {
        model.changeSort(Number(target.value));
        model.updateHash();
      }
    });

    const found = createElement('div', 'goods__found', controlWrapper);
    createElement('div', 'goods__found-text', found).textContent = 'Found:  ';
    const goodCount = createElement('div', 'goods__found-count', found);
    goodCount.textContent = ' 0 ';

    const input: HTMLInputElement = createElement('input', 'goods__search', controlWrapper, [
      'type',
      'text',
    ]) as HTMLInputElement;
    input.placeholder = 'Search product';
    input.value = model.getCurrentSearch();

    input.addEventListener('input', () => {
      model.changeSearch(input.value);
      model.updateHash();
    });
  }

  // отрисовка блока товаров
  renderGods(model: Model): void {
    const goodsBlock: HTMLElement | null = document.querySelector('.main__goods');

    if (goodsBlock !== null) {
      const items: IProducts = model.getGoods();

      if (items.products.length > 0) {
        let prodBlock: HTMLElement | null = document.querySelector('.main__products');

        if (prodBlock === null) {
          prodBlock = createElement('div', 'main__products', goodsBlock);
        }

        items.products.forEach((item: IProduct) => {
          this.renderGodsCard(prodBlock, item, model);
        });
      } else {
        createElement('div', 'goods__not-found', goodsBlock).innerHTML =
          'No products found &#128546';
      }

      const goodCount = document.querySelector('.goods__found-count');
      if (goodCount !== null) {
        goodCount.textContent = String(items.products.length);
      }
    }
  }

  // Отрисовка главной страницы
  render(model: Model): void {
    const wrapper: HTMLElement | null = document.querySelector('.main-wrapper');

    if (wrapper === null) {
      if (this.main !== null) {
        removeChild(this.main);
      }

      this.wrapper = createElement('div', 'main-wrapper', this.main);
    } else {
      this.wrapper = wrapper;
    }

    // если фильтры уже есть то Update иначе Render.
    const filtersBlock: HTMLElement | null = document.querySelector('.main__filter');

    filtersBlock === null ? this.renderFilters(model) : this.updateFilters(model);

    const goodsBlock: HTMLElement | null = document.querySelector('.main__goods');

    if (goodsBlock === null) {
      createElement('div', 'main__goods', this.wrapper);
      this.renderControls(model);
    } else {
      const mainProducts = goodsBlock.querySelector('.main__products') as HTMLElement;

      goodsBlock.querySelector('.goods__not-found')?.remove();

      if (mainProducts !== null) {
        removeChild(mainProducts);
        this.updateGoodsControls(model);
      }
    }

    this.renderGods(model);
  }
}

export default ViewMain;
