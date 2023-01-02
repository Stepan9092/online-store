import Model from '../model/model';
import ViewMain from '../view/main/index';

class App {
  private model: Model;
  private view: ViewMain;

  constructor() {
    this.model = new Model();
    this.view = new ViewMain();
  }

  run(): void {
    // console.log('App run');

    // this.model.run();
    this.view.render(this.model);

    // fill category
    // this.mainPage.fillFilter(this.model);
    // this.model.getCategoryItemsCount('gender', 'men');
  }
}

export default App;
