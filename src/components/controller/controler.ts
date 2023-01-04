import Model from '../model/model';
import ViewMain from '../view/main/index';

interface IPage {
  page: string;
  params: Array<string>;
}

interface IParametr {
  parametr: string;
  value: string;
}

class Controller {
  private view: ViewMain;
  private model: Model;
  private validPage: Array<IPage>;

  constructor(view: ViewMain, model: Model) {
    console.log('constroller constructor');

    this.model = model;
    this.view = view;

    // описание валидных страниц и их параметров.
    this.validPage = new Array<IPage>();
    this.validPage.push({
      page: 'main',
      params: ['category', 'manufacturer', 'gender', 'price', 'stock'],
    });
    this.validPage.push({
      page: 'goods',
      params: [],
    });
    this.validPage.push({
      page: 'cart',
      params: [],
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
          const value = param.split('=')[1];

          if (currentPage[0].params.some((item) => item === parametr)) {
            console.log('GOOD PARAMETR = ', parametr, value);
            validParams.push({ parametr: parametr, value: value });
          } else {
            console.log('BAD PARAMETR = ', parametr, value);
          }
        });
      }
    }
    return validParams;
  }

  private render(page: string, params: Array<string>): void {
    // console.log('page = ', page);
    // console.log('params = ', params);

    if (this.isPageValid(page)) {
      console.log('RENDER PAGE = ', page);

      const validParams = this.getValidParams(page, params);

      console.log('RENDER REQUEST = ', page, validParams);

      // render main page
      if (page === 'main') {
        this.view.render(this.model);

        // отобрать и добавить 'category', 'manufacturer', 'gender'
        validParams
          .filter((filterItem) => {
            return ['category', 'manufacturer', 'gender'].some(
              (someItem) => someItem === filterItem.parametr
            );
          })
          .forEach((item) => {
            console.log('changeFilter = ', item.parametr, item.value);
            this.model.changeFilter(item.parametr, item.value, true);
          });
        //  this.model.changeFilter(filterCategory, filterValue, filterStatus);

        validParams
          .filter((filterItem) => {
            return ['stock', 'price'].some((someItem) => someItem === filterItem.parametr);
          })
          .forEach((item) => {
            console.log('changeFilterSlider = ', item.parametr, item.value);
            this.model.changeFilterSlider(
              item.parametr,
              Number(item.value.split('|')[0]),
              Number(item.value.split('|')[1])
            );
          });
        //  changeFilterSlider(filterCategory: string, filterValueMin: number, filterValueMax: number):
        this.model.testCalcHash();
      }
    } else {
      // render 404
      console.log('RENDER 404');
    }
  }

  private parseHash(hash: string): void {
    console.log(hash);
    // http://localhost:8080/#/main -> #/main
    if (hash[0] === '#') {
      hash = hash.slice(1);
      console.log(hash);
    }

    if (hash[0] === '/') {
      hash = hash.slice(1);
      console.log(hash);
    }

    const page = hash.split('?')[0];
    const params = hash.split('?')[1] ? hash.split('?')[1].split('&') : [''];

    // ! проверка page -> main, cart, goods иначе 404

    this.render(page, params);
  }

  private hashChangeHendler(): void {
    window.addEventListener('hashchange', (event: HashChangeEvent) => {
      this.model.clearFiler();
      this.parseHash(window.location.hash); // распарсить и обработать хэш.
      console.log(event.oldURL, event.newURL, event.composed);
    });
  }

  run(): void {
    console.log('run controller');
    this.hashChangeHendler();

    if (window.location.hash === '') {
      window.location.hash = '#/main';
    }

    this.parseHash(window.location.hash);
  }
}

export default Controller;
