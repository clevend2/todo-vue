const textObserverConfig = {
  characterData: true,
  attributes: false,
  childList: true,
  subtree: true,
};

// a global store for mutation observers
const mutationObservers: WeakMap<HTMLElement, MutationObserver> = new WeakMap();

export function startObserving(element: HTMLElement, cb: MutationCallback): MutationObserver {
  const observer = new MutationObserver(cb);

  observer.observe(element, textObserverConfig);

  mutationObservers.set(element, observer);

  return observer;
}

export function stopObserving(element: HTMLElement): void {
  const observer = mutationObservers.get(element);
  if (observer) {
    observer.disconnect();

    mutationObservers.delete(element);
  }
}
