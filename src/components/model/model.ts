import base from '../model/products.json';

interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  manufacturer: string;
  gender: string;
  size: Array<number>;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  color: string;
  thumbnail: string;
  images: Array<string>;
}

interface IProducts {
  products: Array<IProduct>;
}

class Model {
  private prodBase: IProducts;

  constructor() {
    this.prodBase = base;
    console.log('model constructor', this.prodBase);
  }

  run(): void {
    console.log('model run');
  }

  getFilterItems(filterName: string): Set<string> {
    const items = new Set<string>();
    this.prodBase.products.forEach((item: IProduct) => {
      // console.log(item[filterName as keyof typeof item]);
      items.add(String(item[filterName as keyof typeof item]));
    });
    console.log(filterName);
    return items;
  }
}

export default Model;
