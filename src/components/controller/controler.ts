class Controller {
  constructor() {
    console.log('constroller constructor');
  }

  private parseHash(hash: string): void {
    console.log(hash);
    // http://localhost:8080/#/main -> #/main
    if (hash[0] === '#') {
      hash = hash.slice(1);
      console.log(hash);
    }

    if (hash[0] === '/') {
      hash = hash.slice(1);
      console.log(hash);
    }

    console.log('page = ', hash.split('?')[0]);
    console.log('params = ', hash.split('?')[1] ? hash.split('?')[1].split('&') : '');

    // ! проверка page -> main, cart, goods иначе 404
  }

  private hashChangeHendler(): void {
    window.addEventListener('hashchange', () => {
      this.parseHash(window.location.hash); // распарсить и обработать хэш.
    });
  }

  run(): void {
    console.log('run controller');
    this.hashChangeHendler();

    if (window.location.hash === '') {
      window.location.hash = '#/main';
    }

    this.parseHash(window.location.hash);
  }
}

export default Controller;
