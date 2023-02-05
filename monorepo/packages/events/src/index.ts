import express, {
  Request,
  Response,
  NextFunction,
  Application,
  ErrorRequestHandler,
} from "express";
import { httpReceiverOptions, Event } from "./types";
import * as brokers from "./brokers";
export * as brokers from "./brokers";
export * as common from "./common";
import { CloudEvent, httpTransport, emitterFor } from "cloudevents";

const defaultPort = 3000;

class HttpException extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function validateEvent(sourcename: string, type: string, event: any) {
  try {
    const validSources = Array.from(
      brokers.brokerList.map((broker) => broker.eventSourceName)
    );

    if (!validSources.includes(sourcename)) {
      throw `source header [${sourcename}] does not reference a valid source. Valid sources are ${validSources.join(
        ", "
      )}`;
    }

    var broker = brokers.brokerList.find(
      (broker) => broker.eventSourceName == sourcename
    )!;

    var validEventTypes = Array.from(
      broker.events.map((event: Event) => event.name)
    );

    if (!validEventTypes.includes(type)) {
      throw `type header does not reference a valid event type. Valid event types for the source ${validSources.join(
        ", "
      )} are [${validEventTypes.join(", ")}]`;
    }

    var eventVersions = broker.events
      .filter((event: Event) => event.name == type)
      .map((event: Event) => event.version);

    var eventVersion = event.version;

    if (eventVersion == undefined || typeof eventVersion !== "number") {
      throw "event body does not contain a version number";
    }

    if (!eventVersions.includes(eventVersion)) {
      throw `event body version ${eventVersion} does not match any of the versions for the event type ${type}. Valid versions are ${eventVersions.join(
        ", "
      )}`;
    }

    var eventSchema = broker.events.find(
      (event: Event) => event.name == type
    )!.EventSchema;

    var parse = eventSchema.safeParse(event);
    if (!parse.success) {
      const formatted = parse.error.format();
      throw `event body does not match the schema for the event type ${type}. Error: ${JSON.stringify(
        formatted
      )}`;
    }

    return [true, ""];
  } catch (e: any) {
    return [false, e];
  }
}

export const eventEmitter = (options: { brokerUrl: string }) => {
  var { brokerUrl } = options;

  const emit = emitterFor(httpTransport(brokerUrl));

  async function emitEvent(options: {
    sourcename: string;
    type: string;
    event: any;
  }) {
    const { sourcename, type, event } = options;
    var [passed, err] = await validateEvent(sourcename, type, event);

    if (!passed) {
      var errMsg = `Emitting event ${type} from source ${sourcename} failed validation. Error: ${err}`;
      throw errMsg;
    }

    var ce = new CloudEvent({
      datacontenttype: "application/json",
      source: sourcename,
      type: type,
      data: event,
    });

    console.log(
      `Emitting event id ${ce.id} from source ${sourcename} with type ${type}`
    );

    emit(ce);
  }

  return { emitEvent };
};

export const startEventReceivingWebServer = (options: httpReceiverOptions) => {
  if (options.port == undefined) {
    options.port = defaultPort;
  }

  const validate =
    () => async (req: Request, res: Response, next: NextFunction) => {
      res.status(202).end();
      try {
        var source = req.headers["ce-source"];

        if (source == undefined || typeof source !== "string") {
          throw "source header is undefined or improperly defined";
        }

        var eventType = req.headers["ce-type"];
        if (eventType == undefined || typeof eventType !== "string") {
          throw "type header is undefined";
        }
      } catch (error) {
        res.locals.error = error;
        return next();
      }

      var [passed, err] = await validateEvent(source, eventType, req.body);

      if (!passed) {
        res.locals.error = err;
        return next();
      }

      res.locals.source = source;
      res.locals.eventType = eventType;
      res.locals.eventMessage = req.body;

      return next();
    };

  const sendEventToCallback = (
    eventSource: string,
    eventType: string,
    eventPayload: string
  ) => {
    options.callback(eventSource, eventType, eventPayload);
  };

  var e = express();

  e.use(express.json());

  e.use((err: HttpException, req: any, res: any, next: NextFunction) => {
    console.error(`Error handing event sent from broker: ${err.message}`);
    next();
  });

  e.post("/", validate(), function (req: Request, res: Response) {
    res.status(202).end();
    if (res.locals.error) {
      console.error(
        `Error handing event sent from broker: ${res.locals.error}`
      );
    } else {
      sendEventToCallback(
        res.locals.source,
        res.locals.eventType,
        res.locals.eventMessage
      );
    }
  });

  e.listen(options.port, () => {
    console.log(`Event receiver listening at ${options.port}`);
  });
};
