type EventArguments = [name: string, options: { props: Record<string, string> }];

declare global {
  interface Window {
    plausible?: ((...args: EventArguments) => void) & { q?: EventArguments[] };
  }
}

export function track(window: Window, name: string, properties: Record<string, string>): void {
  window.plausible ||= (...args: EventArguments) => {
    (window.plausible!.q ||= []).push(args);
  };
  window.plausible(name, { props: properties });
}
