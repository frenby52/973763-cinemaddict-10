import AbstractComponent from "./abstract-component";

export default class AbstractSmartComponent extends AbstractComponent {

  rerender(oldComponent) {
    const oldElement = oldComponent.getElement();
    const parent = oldElement.parentElement;
    this._element = null;
    const newElement = this.getElement();

    if (parent) {
      parent.replaceChild(newElement, oldElement);
    }
  }
}
