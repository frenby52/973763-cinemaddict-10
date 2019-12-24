import AbstractComponent from "./abstract-component";

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;
    this._element = null;
    const newElement = this.getElement();

    if (parent) {
      parent.replaceChild(newElement, oldElement);
    }

    this.recoveryListeners();
  }
}
