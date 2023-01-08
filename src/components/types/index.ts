export interface IProduct {
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

export interface ICartProduct extends IProduct{
  count: number;
}

export interface IProducts {
  products: Array<IProduct>;
}

export interface IFilterItems {
  id: number;
  filterCategory: string;
  filterValue: string;
  filterStatus: boolean;
}

export interface IFilterItemSlider {
  id: string;
  filterValueMin: number;
  filterValueMax: number;
}

export interface IPage {
  page: string;
  params: Array<string>;
}

export interface IParametr {
  parametr: string;
  value: string;
}

export interface IPromo {
  code: string;
  discount: string;
  title: string;
}
