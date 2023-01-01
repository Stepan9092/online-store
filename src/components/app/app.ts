import Model from '../model/model';
import ViewMain from '../view/main/index';

class App {
  private model: Model;
  private mainPage: ViewMain;

  constructor() {
    this.model = new Model();
    this.mainPage = new ViewMain();
  }

  run(): void {
    // console.log('App run');

    // this.model.run();
    this.mainPage.render(this.model);

    // fill category
    // this.mainPage.fillFilter(this.model);
    this.model.getCategoryItemsCount('gender', 'men');
  }
}

export default App;
