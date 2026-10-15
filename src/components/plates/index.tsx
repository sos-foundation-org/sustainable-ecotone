import type { EventPlate } from "@/content/events";
import MangrovePlate from "./MangrovePlate";
import UrbanParkPlate from "./UrbanParkPlate";
import type { Lang } from "@/lib/i18n";

/**
 * Event plate registry. An event opts in with `plate: "<key>"` in events.ts;
 * a future series adds a new self-contained plate component here.
 */
export const EVENT_PLATES: Record<EventPlate, (p: { plateNo?: string; lang?: Lang }) => React.JSX.Element> = {
  mangrove: MangrovePlate,
  urbanpark: UrbanParkPlate,
};
