import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

class App {
  header: Header;
  footer: Footer;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
  }

  run(): void {
    console.log('start');
  }
}

export default App;
