import { Client as DiscordXClient, ClientOptions as DiscordXClientOptions } from "discordx";
import { CloudEvent, emitterFor, httpTransport} from "cloudevents";

export interface ClientOptions extends DiscordXClientOptions {
  emitKnativeEvent: Function
}

export class Client extends DiscordXClient {
  public emitKnativeEvent: Function

  constructor(options: ClientOptions) {
    super(options)
    this.emitKnativeEvent = options.emitKnativeEvent
  }
}