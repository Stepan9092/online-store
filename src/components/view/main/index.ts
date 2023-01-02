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

  // Отрисовка одного фильтра(строки).
  private fillFilterItem(filter: HTMLElement, filterCategoty: string, model: Model): void {
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

        // !ПЕРЕНЕСТИ В CONTROLLER ???
        input.addEventListener('change', (event) => {
          const target: HTMLInputElement = event.target as HTMLInputElement;

          if (target) {
            const category: string | null = target.getAttribute('data-category');
            const name: string | null = target.getAttribute('name');
            if (model !== undefined) {
              if (category !== null && name !== null) {
                model.changeFilter(category, name, target.checked);

                // render filter
                this.renderFilterBlock(model);

                // render goods
                this.renderGodsBlock(model);
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

  // Отрисовка всех категорий фильтров.
  private renderFilterBlock(model: Model): void {
    let filtersBlock: HTMLElement | null = document.querySelector('.main__filter');

    if (filtersBlock === null) {
      filtersBlock = createElement('div', 'main__filter', this.main);
    } else {
      removeChild(filtersBlock);
    }

    const filterControls = createElement('div', 'filter__controls', filtersBlock);
    createElement('div', 'control__reset', filterControls);
    createElement('div', 'control__copy', filterControls);

    const filterCategry = createElement('div', 'filter filter__categry', filtersBlock);
    createElement('div', 'filter__caption', filterCategry).textContent = 'Category';
    this.fillFilterItem(filterCategry, 'category', model);

    const filterBrand = createElement('div', 'filter filter__brand', filtersBlock);
    createElement('div', 'filter__caption', filterBrand).textContent = 'Brand';
    this.fillFilterItem(filterBrand, 'manufacturer', model);

    const filterSex = createElement('div', 'filter filter__sex', filtersBlock);
    createElement('div', 'filter__caption', filterSex).textContent = 'Sex';
    this.fillFilterItem(filterSex, 'gender', model);

    const filterPrice = createElement('div', 'filter filter__price', filtersBlock);
    createElement('div', 'filter__caption', filterPrice).textContent = 'Price';

    const filterStock = createElement('div', 'filter filter__stock', filtersBlock);
    createElement('div', 'filter__caption', filterStock).textContent = 'stock';
  }

  // отрисовка единицы товара
  private createProduct(parrent: HTMLElement | null, item: IProduct): void {
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
  private renderGodsBlock(model: Model): void {
    let goodsBlock: HTMLElement | null = document.querySelector('.main__products');

    if (goodsBlock === null) {
      goodsBlock = createElement('div', 'main__products', this.main);
    } else {
      removeChild(goodsBlock);
    }

    const items: IProducts = model.getItems();
    items.products.forEach((item: IProduct) => {
      this.createProduct(goodsBlock, item);
    });
  }

  // Отрисовка главной страницы
  render(model: Model): void {
    this.main = createElement('div', 'main-wrapper', this.main);
    this.renderFilterBlock(model);
    this.renderGodsBlock(model);
  }
}

export default ViewMain;
