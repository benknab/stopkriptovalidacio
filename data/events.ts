import eventsJson from "./events.json" with { type: "json" };
import { timelineEventsSchema } from "./types.ts";

/**
 * Timeline Events
 *
 * Event types:
 * - "primary": Major milestones (always displayed)
 * - "secondary": Exchange actions (togglable via UI)
 * - "tertiary": Supporting documentation (togglable via UI)
 * - "telegram": Telegram-only events (not shown on timeline, links to main page)
 */

export const events = timelineEventsSchema.parse(eventsJson);
