import Model from '../../model/model';
import { createElement } from '../../helper/index';

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
  private fillFilterItem(filterClass: string, filterItemsBrand: Array<string>): void {
    const filter: HTMLElement | null = document.querySelector(filterClass);

    if (filter) {
      const filterList: HTMLElement = createElement('ul', 'filter__items', filter);

      filterItemsBrand.forEach((item) => {
        const filterItem: HTMLElement = createElement('li', '', filterList);
        createElement('input', '', filterItem, ['type', 'checkbox'], ['id', item], ['name', item]);
        const itemLabel = createElement('label', '', filterItem, ['for', item]);
        createElement('span', '', itemLabel).textContent = item;
        createElement('span', '', itemLabel).textContent = '(0/0)';
      });
    }
  }

  // Заполнение всех категорий фильтров.
  private fillFilter(model: Model): void {
    this.fillFilterItem('.filter__categry', Array.from(model.getFilterItems('category').values()));
    this.fillFilterItem(
      '.filter__brand',
      Array.from(model.getFilterItems('manufacturer').values())
    );
    this.fillFilterItem('.filter__sex', Array.from(model.getFilterItems('gender').values()));

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

  private createProductsBlock(parrent: HTMLElement): void {
    console.log(parrent);
  }

  // Отрисовка главной страницы
  render(model: Model): void {
    console.log('ViewMain render!');
    this.main = createElement('div', 'main-wrapper', this.main);
    this.createFilterBlock(createElement('div', 'main__filter', this.main));
    this.createProductsBlock(createElement('div', 'main__products', this.main));
    this.fillFilter(model);
  }
}

export default ViewMain;
