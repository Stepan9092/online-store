import base from '../model/products.json';
import { IProduct, IProducts } from '../types/index';

interface IFilterItems {
  id: number;
  filterCategory: string;
  filterValue: string;
  filterStatus: boolean;
}

class Model {
  private prodBase: IProducts;
  private filter: Array<IFilterItems>;

  constructor() {
    this.prodBase = base;
    this.filter = new Array<IFilterItems>();
  }

  run(): void {
    console.log('model run');
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

  // Общее колличество товаров.
  getItemsCount(): number {
    return this.prodBase.products.length;
  }

  changeFilter(filterCategory: string, filterValue: string, filterStatus: boolean): void {
    console.log(filterCategory, filterValue, filterStatus);
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

    console.log(this.filter);
  }

  getItems(): IProducts {
    // title
    // manufacturer
    // rating
    // stock
    // price
    // discountPercentage

    // Возвращать товары для рендера с учетом текущего фильтра
    const tempBase: IProducts = {
      products: this.prodBase.products.map((item) => item),
    };

    if (this.filter.length) {
      // get actual filter
      let tempFilter = new Array<IFilterItems>();
      tempFilter = this.filter.filter((filter) => filter.filterStatus);

      // filter level 1 - category
      let categoryFilter = new Array<IFilterItems>();
      categoryFilter = tempFilter.filter((filter) => filter.filterCategory === 'category');

      if (categoryFilter.length > 0) {
        tempBase.products = tempBase.products.filter((item) => {
          return categoryFilter.some((filter) => {
            return item[filter.filterCategory as keyof typeof item] === filter.filterValue;
          });
        });
      }

      // filter level 2 - brand
      let brandFilter = new Array<IFilterItems>();
      brandFilter = tempFilter.filter((filter) => filter.filterCategory === 'manufacturer');

      if (brandFilter.length > 0) {
        tempBase.products = tempBase.products.filter((item) => {
          return brandFilter.some((filter) => {
            return item[filter.filterCategory as keyof typeof item] === filter.filterValue;
          });
        });
      }

      // filter level 3 - sex
      let genderFilter = new Array<IFilterItems>();
      genderFilter = tempFilter.filter((filter) => filter.filterCategory === 'gender');

      if (genderFilter.length > 0) {
        tempBase.products = tempBase.products.filter((item) => {
          return genderFilter.some((filter) => {
            return item[filter.filterCategory as keyof typeof item] === filter.filterValue;
          });
        });
      }
    }

    return tempBase;
  }
}

export default Model;
