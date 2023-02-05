import { z } from "zod";

// zod
export const BasePart = z.object({
  domain: z.string(),
  type: z.string(),
  version: z.number().gt(0).int()
})

export const Base = z.object({
  version: z.number().gt(0).int()
})

export const dbUpdate = z.object({
  id: z.string({}),
  updatedFields: z.array(z.string({}))
})

// interfaces
export interface Broker {
  eventSourceName: string
  events: Event[]
  canSendEvents: boolean
}

export interface Event {
  name: string,
  version: number,
  EventSchema: z.ZodSchema<any>,
  EventLoader: Function
}

export interface httpReceiverOptions {
  callback: Function;
  port?: number;
}