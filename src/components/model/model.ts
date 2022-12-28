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
    console.log('model constructor', prodBase);
  }

  run(): void {
    console.log('model run');
  }
}

export default Model;
