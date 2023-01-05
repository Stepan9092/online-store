import base from '../model/products.json';
import ViewMain from '../view/main/index';
import { IProduct, IProducts, IFilterItems, IFilterItemSlider } from '../types/index';

class Model {
  private view: ViewMain;
  private prodBase: IProducts;
  private filter: Array<IFilterItems>;
  private filterPrice: IFilterItemSlider = {
    id: 'price',
    filterValueMin: -1,
    filterValueMax: -1,
  };
  private filterStock: IFilterItemSlider = {
    id: 'stock',
    filterValueMin: -1,
    filterValueMax: -1,
  };

  constructor(view: ViewMain) {
    this.view = view;
    this.prodBase = base;
    this.filter = new Array<IFilterItems>();
  }

  // сброс всех фильтров
  resetFiler(): void {
    while (this.filter.length) {
      this.filter.pop();
    }

    this.filterPrice.filterValueMin = -1;
    this.filterPrice.filterValueMax = -1;

    this.filterStock.filterValueMin = -1;
    this.filterStock.filterValueMax = -1;
  }

  // получить массив строк - фильтров
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
    return this.getGoods().products.filter((item: IProduct) => {
      return item[categoryName as keyof typeof item] === categoryValue;
    }).length;
  }

  // Общее колличество товаров.
  getItemsCount(): number {
    return this.prodBase.products.length;
  }

  // собирает хэш строку из установленных фильтров и сравнивает с текущей,
  // если они отличаются, обновляет хэш.
  updateHash(): void {
    let hash = '#/main';

    // apply checkbox filters
    this.filter
      .filter((filter) => filter.filterStatus)
      .forEach((item) => {
        const addHash = `${item.filterCategory}=${item.filterValue}`;
        if (hash.indexOf(addHash) === -1) {
          hash = hash.indexOf('?') === -1 ? `${hash}?${addHash}` : `${hash}&${addHash}`;
        }
      });
    // console.log(hash);

    // apply slider filters
    [this.filterPrice, this.filterStock].forEach((filter) => {
      if (filter.filterValueMin !== -1 && filter.filterValueMax !== -1) {
        const addHash = `${filter.id}=${filter.filterValueMin}|${filter.filterValueMax}`;
        if (hash.indexOf(addHash) === -1) {
          hash = hash.indexOf('?') === -1 ? `${hash}?${addHash}` : `${hash}&${addHash}`;
        }
      }
    });
    // console.log(hash);

    if (window.location.hash.replace('%20', ' ') !== hash) {
      window.location.hash = hash;
    }

    this.view.render(this);
  }

  // Применяет / отменяет фильтр чекбокс.
  changeFilter(filterCategory: string, filterValue: string, filterStatus: boolean): void {
    //console.log(filterCategory, filterValue, filterStatus);
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

  // Применяет / отменяет фильтр слайдер.
  changeFilterSlider(filterCategory: string, filterValueMin: number, filterValueMax: number): void {
    if (filterCategory === 'price') {
      this.filterPrice.filterValueMax = filterValueMax;
      this.filterPrice.filterValueMin = filterValueMin;
    }

    if (filterCategory === 'stock') {
      this.filterStock.filterValueMax = filterValueMax;
      this.filterStock.filterValueMin = filterValueMin;
    }
  }

  // отфильтровать переданный массив товаров с учетом указанного фильтра.
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

  // отфильтровать переданный массив товаров с учетом фильтров слайдеров.
  private applyFilterSliders(currentBase: IProducts): void {
    [this.filterPrice, this.filterStock].forEach((filter) => {
      currentBase.products = currentBase.products.filter((item) => {
        if (filter.filterValueMin !== -1 && filter.filterValueMax !== -1) {
          return (
            item[filter.id as keyof typeof item] >= filter.filterValueMin &&
            item[filter.id as keyof typeof item] <= filter.filterValueMax
          );
        }

        return true;
      });
    });
  }

  // Проверка активный ли данный фильтр в данный момент.
  isFilterUsed(filterCategory: string, filterValue: string): boolean {
    const applyFiltersCount = this.filter
      .filter((filter) => filter.filterStatus)
      .filter((filter) => filter.filterCategory === filterCategory)
      .filter((filter) => filter.filterValue === filterValue).length;

    return applyFiltersCount > 0;
  }

  // Получить минимальное значение указанного фильтра слайдера
  getMinValues(filterCategory: string): number {
    let min: number | undefined = undefined;

    this.prodBase.products.forEach((item) => {
      if (min === undefined) {
        min = Number(item[filterCategory as keyof typeof item]);
      } else {
        if (Number(item[filterCategory as keyof typeof item]) <= min) {
          min = Number(item[filterCategory as keyof typeof item]);
        }
      }
    });

    return min ? min : 0;
  }

  // Получить максимальное значение указанного фильтра слайдера
  getMaxValues(filterCategory: string): number {
    let max: number | undefined = undefined;

    this.prodBase.products.forEach((item) => {
      if (max === undefined) {
        max = Number(item[filterCategory as keyof typeof item]);
      } else {
        if (Number(item[filterCategory as keyof typeof item]) >= max) {
          max = Number(item[filterCategory as keyof typeof item]);
        }
      }
    });

    return max ? max : 0;
  }

  getCurrentMinValues(filterCategory: string): number {
    let min: number | undefined = undefined;

    this.getGoods().products.forEach((item) => {
      if (min === undefined) {
        min = Number(item[filterCategory as keyof typeof item]);
      } else {
        if (Number(item[filterCategory as keyof typeof item]) <= min) {
          min = Number(item[filterCategory as keyof typeof item]);
        }
      }
    });

    // проверить, если установлен фильтр с минимальным значением -> вернуть значение из фильтра.
    if (filterCategory === 'price') {
      if (this.filterPrice.filterValueMin !== -1) {
        min = this.filterPrice.filterValueMin;
      }
    }

    if (filterCategory === 'stock') {
      if (this.filterStock.filterValueMin !== -1) {
        min = this.filterStock.filterValueMin;
      }
    }

    return min ? min : 0;
  }

  getCurrentMaxValues(filterCategory: string): number {
    let max: number | undefined = undefined;

    this.getGoods().products.forEach((item) => {
      if (max === undefined) {
        max = Number(item[filterCategory as keyof typeof item]);
      } else {
        if (Number(item[filterCategory as keyof typeof item]) >= max) {
          max = Number(item[filterCategory as keyof typeof item]);
        }
      }
    });

    // проверить, если установлен фильтр с минимальным значением -> вернуть значение из фильтра.
    if (filterCategory === 'price') {
      if (this.filterPrice.filterValueMax !== -1) {
        max = this.filterPrice.filterValueMax;
      }
    }

    if (filterCategory === 'stock') {
      if (this.filterStock.filterValueMax !== -1) {
        max = this.filterStock.filterValueMax;
      }
    }

    return max ? max : 0;
  }

  // получение отфильтрованного списка товаров
  getGoods(): IProducts {
    // copy all goods.
    const tempBase: IProducts = {
      products: this.prodBase.products.map((item) => item),
    };

    // apply sorting.

    // aply text search.

    // apply checkbox filter.
    if (this.filter.length) {
      this.applyFilter('category', tempBase);
      this.applyFilter('manufacturer', tempBase);
      this.applyFilter('gender', tempBase);
    }

    // apply slider filter.
    this.applyFilterSliders(tempBase);

    return tempBase;
  }

  run(): void {
    // this.view.render(this);
  }
}

export default Model;
