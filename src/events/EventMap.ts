import Position from "../objects/Position";

const eventMap = {
  "update-position": Position,
} as const;

export type EventMap = typeof eventMap;
export type EventKeys = keyof typeof eventMap;
