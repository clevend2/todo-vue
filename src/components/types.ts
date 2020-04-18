interface NamedInputData extends DOMStringMap {
  name: string;
  value: any;
}

interface NamedEditableElement extends HTMLElement {
  dataset: NamedInputData;
}

export interface EditableContentEvent extends Event {
  target: NamedEditableElement;
}
