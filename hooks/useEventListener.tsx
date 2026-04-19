import { useEffect, useRef } from "react";

export function useEventListener<T extends Event = Event>(
  eventType: string,
  handler: (event: T) => void,
  element?: EventTarget | null,
  options?: AddEventListenerOptions,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const target = element ?? (typeof window !== "undefined" ? window : null);
    if (!target) return;

    const listener = (event: Event) => handlerRef.current(event as T);
    target.addEventListener(eventType, listener, options);
    return () => target.removeEventListener(eventType, listener, options);
  }, [eventType, element, options]);
}
