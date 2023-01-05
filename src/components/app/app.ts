import Model from '../model/model';
import ViewMain from '../view/main/index';
import Controller from '../controller/controler';

class App {
  private controller: Controller;
  private view: ViewMain;
  private model: Model;

  constructor() {
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
