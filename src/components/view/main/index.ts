import Model from '../../model/model';
import { createElement } from '../../helper/index';
import { IProduct, IProducts } from '../../types/index';
import starFill from '../../../assets/star_fill.png';
import star from '../../../assets/star.png';

class ViewMain {
  private main: HTMLElement | null;

  constructor() {
    this.main = document.querySelector('main');
  }

  // Добавление категорий фильтров.
  private createFilterBlock(parrent: HTMLElement): void {
    const filterControls = createElement('div', 'filter__controls', parrent);
    createElement('div', 'control__reset', filterControls);
    createElement('div', 'control__copy', filterControls);

    const filterCategry = createElement('div', 'filter filter__categry', parrent);
    createElement('div', 'filter__caption', filterCategry).textContent = 'Category';

    const filterBrand = createElement('div', 'filter filter__brand', parrent);
    createElement('div', 'filter__caption', filterBrand).textContent = 'Brand';

    const filterSex = createElement('div', 'filter filter__sex', parrent);
    createElement('div', 'filter__caption', filterSex).textContent = 'Sex';

    const filterSize = createElement('div', 'filter filter__size', parrent);
    createElement('div', 'filter__caption', filterSize).textContent = 'Size';

    const filterPrice = createElement('div', 'filter filter__price', parrent);
    createElement('div', 'filter__caption', filterPrice).textContent = 'Price';

    const filterStock = createElement('div', 'filter filter__stock', parrent);
    createElement('div', 'filter__caption', filterStock).textContent = 'stock';
  }

  // Заполнение заданной категории фильтров.
  private fillFilterItem(
    filterClass: string,
    filterItemsBrand: Array<string>,
    filterCategoty?: string,
    model?: Model
  ): void {
    const filter: HTMLElement | null = document.querySelector(filterClass);

    if (filter !== undefined && filterCategoty !== undefined) {
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
        );
        input.setAttribute('data-category', filterCategoty);

        input.addEventListener('change', (event) => {
          const target: HTMLInputElement = event.target as HTMLInputElement;

          if (target) {
            // console.log(
            //   target.getAttribute('name'),
            //   ' / ',
            //   target.getAttribute('data-category'),
            //   ' ',
            //   target.checked
            // );\
            const category: string | null = target.getAttribute('data-category');
            const name: string | null = target.getAttribute('name');
            if (model !== undefined) {
              if (category !== null && name !== null) {
                model.changeFilter(category, name, target.checked);
                // this.render(model);
                const productsBlock: HTMLElement | null = document.querySelector('.main__products');
                if (productsBlock !== null) {
                  productsBlock.innerHTML = ''; // ПЕРЕДЕЛАТЬ.
                  this.createProductsBlock(productsBlock, model);
                }
              }
            }
          }
        });

        const itemLabel = createElement('label', '', filterItem, ['for', item]);
        createElement('span', '', itemLabel).textContent = item;

        if (filterCategoty !== undefined && model !== undefined) {
          // console.log(item, filterCategoty, model.getCategoryItemsCount(filterCategoty, item));
          const filterCount = `(${model.getCategoryItemsCount(
            filterCategoty,
            item
          )}/${model.getItemsCount()})`;
          createElement('span', '', itemLabel).textContent = filterCount;
        } else {
          createElement('span', '', itemLabel).textContent = '(0/0)';
        }
      });
    }
  }

  // Заполнение всех категорий фильтров.
  private fillFilter(model: Model): void {
    this.fillFilterItem(
      '.filter__categry',
      Array.from(model.getFilterItems('category').values()),
      'category',
      model
    );
    this.fillFilterItem(
      '.filter__brand',
      Array.from(model.getFilterItems('manufacturer').values()),
      'manufacturer',
      model
    );
    this.fillFilterItem(
      '.filter__sex',
      Array.from(model.getFilterItems('gender').values()),
      'gender',
      model
    );

    const size = Array.from(model.getFilterItems('size').values());

    const rezSize: Set<string> = new Set<string>();
    size.forEach((item) => {
      item.split(',').forEach((item) => rezSize.add(item));
    });

    this.fillFilterItem(
      '.filter__size',
      Array.from(rezSize.values()).sort((a: string, b: string) => Number(a) - Number(b))
    );
  }

  // отрисовка товара
  private createProduct(parrent: HTMLElement, item: IProduct): void {
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
  private createProductsBlock(parrent: HTMLElement, model: Model): void {
    const items: IProducts = model.getItems();
    items.products.forEach((item: IProduct) => {
      this.createProduct(parrent, item);
    });
  }

  // Отрисовка главной страницы
  render(model: Model): void {
    console.log('ViewMain render!');
    this.main = createElement('div', 'main-wrapper', this.main);
    this.createFilterBlock(createElement('div', 'main__filter', this.main));
    this.createProductsBlock(createElement('div', 'main__products', this.main), model);
    this.fillFilter(model);
  }
}

export default ViewMain;
