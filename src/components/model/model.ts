import base from '../model/products.json';
import { IProduct, IProducts } from '../types/index';

class Model {
  private prodBase: IProducts;

  constructor() {
    this.prodBase = base;
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

  getItems(): IProducts {
    // title
    // manufacturer
    // rating
    // stock
    // price
    // discountPercentage

    return this.prodBase;
  }
}

export default Model;
