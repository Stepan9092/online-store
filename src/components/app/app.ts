import Model from '../model/model';
import ViewMain from '../view/main/index';
import ViewCart from '../view/cart/cart';
import Controller from '../controller/controler';
import Header from '../view/header/header';
import Footer from '../view/footer/footer';

class App {
  private controller: Controller;
  private view: ViewMain;
  private viewCart: ViewCart;
  private model: Model;
  private header: Header;
  private footer: Footer;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.view = new ViewMain();
    this.viewCart = new ViewCart();
    this.model = new Model(this.view);
    this.controller = new Controller(this.view, this.model, this.viewCart);
  }

  run(): void {
    this.header.run();
    this.footer.run();
    this.controller.run();
    this.model.run();
  }
}

export default App;
