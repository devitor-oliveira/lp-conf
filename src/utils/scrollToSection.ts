export interface ScrollToSectionOptions {
  fallbackToBottom?: boolean;
  focusTarget?: boolean;
}

export function scrollToSection(selector: string, options: ScrollToSectionOptions = {}): void {
  const element = document.querySelector(selector);
  const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = shouldReduceMotion ? "auto" : "smooth";

  if (element) {
    element.scrollIntoView({ behavior, block: "start" });
    if (options.focusTarget && element instanceof HTMLElement) {
      if (!element.hasAttribute("tabindex")) {
        element.tabIndex = -1;
      }
      element.focus({ preventScroll: true });
    }
  } else if (options.fallbackToBottom) {
    window.scrollTo({ top: document.body.scrollHeight, behavior });
  }
}
