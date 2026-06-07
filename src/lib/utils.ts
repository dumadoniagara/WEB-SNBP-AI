/** Tiny className joiner — avoids pulling in a dependency for this. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Shared "ease-out expo" cubic-bezier for Motion. Typed as a 4-tuple so it
 * satisfies Motion's `Easing` type (a plain number[] is rejected).
 */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
