export type DrawerId = "navigation" | "search-filter";

const DRAWER_OPEN_EVENT = "mamaplace:drawer-open";

export function announceDrawerOpen(drawer: DrawerId) {
  window.dispatchEvent(
    new CustomEvent<DrawerId>(DRAWER_OPEN_EVENT, { detail: drawer }),
  );
}

export function subscribeToDrawerOpen(listener: (drawer: DrawerId) => void) {
  const handleDrawerOpen = (event: Event) => {
    listener((event as CustomEvent<DrawerId>).detail);
  };

  window.addEventListener(DRAWER_OPEN_EVENT, handleDrawerOpen);
  return () => window.removeEventListener(DRAWER_OPEN_EVENT, handleDrawerOpen);
}
