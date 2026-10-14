// ─── Prey: a tiny shared store between the Next-leap card's grasshopper and the frog ───
// The card's grasshopper registers itself here; the frog figure asks whether it
// is available and, if so, snatches it with its tongue. Nothing else is coupled.
// The store also announces the moments as window CustomEvents
// (ecotone:grasshopper-snatched / ecotone:grasshopper-respawn).

export type Prey = {
  /** on screen, visible, not mid-leap, not already eaten */
  available: () => boolean;
  /** the grasshopper's box in viewport coordinates */
  rect: () => DOMRect | null;
  /** colours it is drawn in, so the frog's overlay can carry a matching copy */
  ink: string;
  fill: string;
  /** hide it (it is now on the tongue); it respawns by itself */
  snatch: () => void;
};

let current: Prey | null = null;

export function registerPrey(p: Prey) {
  current = p;
  return () => {
    if (current === p) current = null;
  };
}

export const getPrey = () => current;

export const SNATCHED = "ecotone:grasshopper-snatched";
export const RESPAWN = "ecotone:grasshopper-respawn";
export const announce = (name: typeof SNATCHED | typeof RESPAWN) => window.dispatchEvent(new CustomEvent(name));
