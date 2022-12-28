import Model from '../model/model';

class App {
  private model: Model;

  constructor() {
    this.model = new Model();
  }

  run() {
    console.log('App run');
  }
}

export default App;
