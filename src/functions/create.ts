function createElement(
  tag: string,
  classList: string,
  child?: Array<HTMLElement> | HTMLElement | string | null,
  parent?: HTMLElement | null,
  ...dataAttr: Array<[attrName: string, attrValue: string]>
) {
  let element: HTMLElement;
  try {
    element = document.createElement(tag);
  } catch (error) {
    throw new Error('Unable to create HTMLElement! You should give a proper HTML tag name');
  }
  element.classList.add(...classList.split(' '));
  if (child && Array.isArray(child)) {
    child.forEach((childElement) => childElement && element.appendChild(childElement));
  } else if (child && typeof child === 'object') {
    element.appendChild(child);
  } else if (typeof child === 'string') {
    element.innerHTML = child;
  }
  if (parent) {
    parent.appendChild(element);
  }
  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') {
        element.setAttribute(attrName, '');
        return;
      }
      if (attrName.match(/value|id|href|src|alt|type|name|placeholder|tabindex|spellcheck/i)) {
        element.setAttribute(attrName, attrValue);
      } else {
        element.dataset[attrName] = attrValue;
      }
    });
  }
  return element;
}

export { createElement };
