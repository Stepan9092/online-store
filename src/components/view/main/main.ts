function createElement(
  tagName: string,
  classNames?: string,
  parent: HTMLElement | null = null
): HTMLElement {
  const el = document.createElement(tagName);
  // el.className = className;
  if (classNames) {
    el.classList.add(...classNames.split(' '));
  }

  if (parent !== null) {
    parent.appendChild(el);
  }

  return el;
}

class ViewMain {
  private main: HTMLElement | null;

  constructor() {
    this.main = document.querySelector('main');
  }

  private createFilterBlock(parrent: HTMLElement): void {
    const filterControls = createElement('div', 'filter__controls', parrent);
    createElement('div', 'control__reset', filterControls);
    createElement('div', 'control__copy', filterControls);

    const filterCategry = createElement('div', 'filter filter__categry', parrent);
    createElement('div', 'filter__caption', filterCategry).textContent = 'Brands';
  }

  private createProductsBlock(parrent: HTMLElement): void {
    console.log(parrent);
  }

  render(): void {
    console.log('ViewMain render!');
    this.main = createElement('div', 'main-wrapper', this.main);
    this.createFilterBlock(createElement('div', 'main__filter', this.main));
    this.createProductsBlock(createElement('div', 'main__products', this.main));
  }
}

export default ViewMain;
