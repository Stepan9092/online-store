import base from '../model/products.json';
import { IProduct, IProducts, IFilterItems } from '../types/index';

class Model {
  private prodBase: IProducts;
  private filter: Array<IFilterItems>;

  constructor() {
    this.prodBase = base;
    this.filter = new Array<IFilterItems>();
  }

  getFilterItems(filterName: string): Set<string> {
    const items: Set<string> = new Set<string>();
    this.prodBase.products.forEach((item: IProduct) => {
      items.add(String(item[filterName as keyof typeof item]));
    });
    return items;
  }

  // Коллличество товаров в заданной категории.
  getCategoryItemsCount(categoryName: string, categoryValue: string): number {
    return this.prodBase.products.filter((item: IProduct) => {
      return item[categoryName as keyof typeof item] === categoryValue;
    }).length;
  }

  // Коллличество отображаемых товаров в заданной категории.
  getShowedItemsCount(categoryName: string, categoryValue: string): number {
    return this.getItems().products.filter((item: IProduct) => {
      return item[categoryName as keyof typeof item] === categoryValue;
    }).length;
  }

  // Общее колличество товаров.
  getItemsCount(): number {
    return this.prodBase.products.length;
  }

  changeFilter(filterCategory: string, filterValue: string, filterStatus: boolean): void {
    // console.log(filterCategory, filterValue, filterStatus);
    if (filterStatus === true) {
      const newFilter: IFilterItems = {
        id: this.filter.length,
        filterCategory: filterCategory,
        filterValue: filterValue,
        filterStatus: filterStatus,
      };
      this.filter.push(newFilter);
    } else {
      this.filter.forEach((item) => {
        if (item.filterCategory === filterCategory && item.filterValue === filterValue) {
          item.filterStatus = false;
        }
      });
    }
  }

  private applyFilter(filterCategory: string, currentBase: IProducts): void {
    let currentFilter = new Array<IFilterItems>();
    currentFilter = this.filter
      .filter((filter) => filter.filterStatus)
      .filter((filter) => filter.filterCategory === filterCategory);

    if (currentFilter.length > 0) {
      currentBase.products = currentBase.products.filter((item) => {
        return currentFilter.some((filter) => {
          return item[filter.filterCategory as keyof typeof item] === filter.filterValue;
        });
      });
    }
  }

  isFilterUsed(filterCategory: string, filterValue: string): boolean {
    const applyFiltersCount = this.filter
      .filter((filter) => filter.filterStatus)
      .filter((filter) => filter.filterCategory === filterCategory)
      .filter((filter) => filter.filterValue === filterValue).length;

    return applyFiltersCount > 0;
  }

  getItems(): IProducts {
    // copy all goods.
    const tempBase: IProducts = {
      products: this.prodBase.products.map((item) => item),
    };

    // apply sorting.

    // aply text search.

    // apply filter.
    if (this.filter.length) {
      this.applyFilter('category', tempBase);
      this.applyFilter('manufacturer', tempBase);
      this.applyFilter('gender', tempBase);
    }

    return tempBase;
  }

  run(): void {
    console.log('model run');
  }
}

export default Model;
