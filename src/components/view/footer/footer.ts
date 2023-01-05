import { createElement } from '../../helper/index';
import githubPicture from '../../../assets/githubIcon.png';

class Footer {
  container: HTMLElement | null;

  constructor() {
    this.container = document.querySelector('footer');
  }

  run(): void {
    this.createFooter();
  }

  createFooter() {
    this.container?.classList.add('footer');
    const wrapper = createElement('div', 'footer-wrapper', this.container);
    this.createGithubLink('Nikolay Kovalev', 'https://github.com/kovalevn89');
    const footerText = createElement('div', 'footer__text', wrapper);
    footerText.innerText = 'Online Store 2023';
    this.createGithubLink('Stepan Zubik', 'https://github.com/stepan9092');
  }

  createGithubLink(name: string, url: string) {
    const wrapper = document.querySelector('.footer-wrapper') as HTMLElement;
    const link = createElement('a', 'footer__link github', wrapper, ['href', url]);
    createElement('img', 'github__image', link, ['src', githubPicture], ['alt', 'gitHub icon']);
    const linkName = createElement('div', 'github__name', link);
    linkName.innerText = name;
  }
}

export default Footer;
