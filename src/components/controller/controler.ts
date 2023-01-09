import Model from '../model/model';
import ViewMain from '../view/main/index';
import ViewCart from '../view/cart/cart';
import ViewError from '../view/error/404';
import { IPage, IParametr } from '../types/index';

class Controller {
  private view: ViewMain;
  private viewCart: ViewCart;
  private error: ViewError;
  private model: Model;
  private validPage: Array<IPage>;

  constructor(view: ViewMain, model: Model, viewCart: ViewCart, error: ViewError) {
    this.model = model;
    this.view = view;
    this.viewCart = viewCart;
    this.error = error;

    // описание валидных страниц и их параметров.
    this.validPage = new Array<IPage>();
    this.validPage.push({
      page: 'main',
      params: ['category', 'manufacturer', 'gender', 'price', 'stock', 'sort', 'search'],
    });
    this.validPage.push({
      page: 'goods',
      params: [],
    });
    this.validPage.push({
      page: 'cart',
      params: ['limit', 'page'],
    });
  }

  private isPageValid(page: string): boolean {
    return this.validPage.some((item) => item.page === page);
  }

  private getValidParams(page: string, params: Array<string>): Array<IParametr> {
    let currentPage = new Array<IPage>();
    const validParams: Array<IParametr> = [];

    currentPage = this.validPage.filter((item) => item.page === page);

    if (currentPage.length === 1 && currentPage[0].params.length > 0) {
      if (params.length > 0) {
        params.forEach((param) => {
          const parametr = param.split('=')[0];
          let value = param.split('=')[1]; // .replace('%20', ' ');

          if (value) {
            value = value.replace('%20', ' ');
          }

          if (currentPage[0].params.some((item) => item === parametr)) {
            validParams.push({ parametr: parametr, value: value });
          }
        });
      }
    }
    return validParams;
  }

  private render(page: string, params: Array<string>): void {
    if (this.isPageValid(page)) {
      const validParams = this.getValidParams(page, params);

      // console.log(page);
      // render main page
      if (page === 'main') {
        this.view.render(this.model);

        // добавить checkbox фильтры 'category', 'manufacturer', 'gender'
        validParams
          .filter((filterItem) => {
            return ['category', 'manufacturer', 'gender'].some(
              (someItem) => someItem === filterItem.parametr
            );
          })
          .forEach((item) => {
            this.model.changeFilter(item.parametr, item.value, true);
            // console.log(item.parametr, item.value);
          });

        // добавить slider фильтры 'stock', 'price'
        validParams
          .filter((filterItem) => {
            return ['stock', 'price'].some((someItem) => someItem === filterItem.parametr);
          })
          .forEach((item) => {
            this.model.changeFilterSlider(
              item.parametr,
              Number(item.value.split('|')[0]),
              Number(item.value.split('|')[1])
            );
          });

        // установить тип сортировки
        validParams
          .filter((filterItem) => {
            return ['sort'].some((someItem) => someItem === filterItem.parametr);
          })
          .forEach((item) => {
            this.model.changeSort(Number(item.value));
          });

        // установить текстовый поиск
        validParams
          .filter((filterItem) => {
            return ['search'].some((someItem) => someItem === filterItem.parametr);
          })
          .forEach((item) => {
            this.model.changeSearch(item.value);
          });

        // console.log('test!');
        this.model.updateHash();
      }

      if (page === 'cart') {
        this.viewCart.render(validParams);
      }
    } else {
      // render 404
      console.log('RENDER 404');
      this.error.render();
    }
  }

  // разбор хэша
  private parseHash(hash: string): void {
    if (hash[0] === '#') {
      hash = hash.slice(1);
    }

    if (hash[0] === '/') {
      hash = hash.slice(1);
    }

    const page = hash.split('?')[0];
    const params = hash.split('?')[1] ? hash.split('?')[1].split('&') : [''];

    this.render(page, params);
  }

  private hashChangeHendler(): void {
    window.addEventListener('hashchange', () => {
      this.model.resetFiler();
      this.parseHash(window.location.hash.replace('%20', ' ')); // распарсить и обработать хэш.
      // console.log(event.oldURL, event.newURL, event.composed); event: HashChangeEvent
    });
  }

  run(): void {
    // console.log('run controller');
    this.hashChangeHendler();

    if (window.location.hash === '') {
      window.location.hash = '#/main';
    }

    this.parseHash(window.location.hash.replace('%20', ' '));
  }
}

export default Controller;
