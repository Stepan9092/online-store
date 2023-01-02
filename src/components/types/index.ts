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
