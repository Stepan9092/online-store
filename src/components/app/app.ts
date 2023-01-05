import Model from '../model/model';
import ViewMain from '../view/main/index';
import Controller from '../controller/controler';
import Header from '../view/header/header';
import Footer from '../view/footer/footer';

class App {
  private controller: Controller;
  private view: ViewMain;
  private model: Model;
  header: Header;
  footer: Footer;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.view = new ViewMain();
    this.model = new Model(this.view);
    this.controller = new Controller(this.view, this.model);
  }

  run(): void {
    this.controller.run();
    this.model.run();
  }
}

export default App;
