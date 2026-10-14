import type { EventPlate } from "@/content/events";
import MangrovePlate from "./MangrovePlate";

/**
 * Event plate registry. An event opts in with `plate: "<key>"` in events.ts;
 * a future series adds a new self-contained plate component here.
 */
export const EVENT_PLATES: Record<EventPlate, (p: { plateNo?: string }) => React.JSX.Element> = {
  mangrove: MangrovePlate,
};
