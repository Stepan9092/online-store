import Model from '../model/model';
import ViewMain from '../view/main/main';

class App {
  private model: Model;
  private mainPage: ViewMain;

  constructor() {
    this.model = new Model();
    this.mainPage = new ViewMain();
  }

  run() {
    console.log('App run');

    this.model.run();

    const filterItemsBrand: Array<string> = Array.from(
      this.model.getFilterItems('manufacturer').values()
    );

    console.log(filterItemsBrand);

    this.mainPage.render();
  }
}

export default App;
