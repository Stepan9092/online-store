import Model from '../model/model';
import ViewMain from '../view/main/index';
import ViewCart from '../view/cart/cart';
import ViewError from '../view/error/404';
import ViewGoods from '../view/goods/goods';
import Controller from '../controller/controler';
import Header from '../view/header/header';
import Footer from '../view/footer/footer';

class App {
  private controller: Controller;
  private view: ViewMain;
  private viewCart: ViewCart;
  private viewError: ViewError;
  private ViewGoods: ViewGoods;
  private model: Model;
  private header: Header;
  private footer: Footer;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.view = new ViewMain();
    this.viewCart = new ViewCart();
    this.viewError = new ViewError();
    this.ViewGoods = new ViewGoods();
    this.model = new Model(this.view, this.header);
    this.controller = new Controller(
      this.view,
      this.model,
      this.viewCart,
      this.viewError,
      this.ViewGoods
    );
  }

  run(): void {
    this.model.run();
    this.header.run(this.model.getCartTotal(), this.model.getCartCount());
    this.footer.run();
    this.controller.run();

    window.addEventListener('unload', () => {
      this.model.saveLocalStorage();
    });
  }
}

export default App;
