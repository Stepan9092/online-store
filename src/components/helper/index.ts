export function createElement(
  tagName: string,
  classNames?: string,
  parent: HTMLElement | null = null,
  ...dataAttr: Array<Array<string>>
): HTMLElement {
  const el = document.createElement(tagName);

  if (classNames) {
    el.classList.add(...classNames.split(' '));
  }

  if (parent !== null) {
    parent.appendChild(el);
  }

  if (dataAttr.length > 0) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') {
        el.setAttribute(attrName, '');
        return;
      }
      if (
        attrName.match(
          /value|id|href|src|alt|type|name|placeholder|tabindex|min|max|for|step|spellcheck/i
        )
      ) {
        el.setAttribute(attrName, attrValue);
      } else {
        el.dataset[attrName] = attrValue;
      }
    });
  }

  return el;
}

export function removeChild(element: HTMLElement) {
  while (element.firstChild) {
    if (element.lastChild) {
      element.removeChild(element.lastChild);
    }
  }
}

