import Model from '../model/model';
import ViewMain from '../view/main/index';

class App {
  private view: ViewMain;
  private model: Model;

  constructor() {
    this.view = new ViewMain();
    this.model = new Model(this.view);
  }

  run(): void {
    // console.log('App run');

    this.model.run();

    // fill category
    // this.mainPage.fillFilter(this.model);
    // this.model.getCategoryItemsCount('gender', 'men');
  }
}

export default App;
