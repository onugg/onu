import { Logger } from 'tslog';

interface ILogObj {
  requestId?: string | (() => string | undefined);
}

const logger = new Logger<ILogObj>({name: "onu" });

export { logger as Logger } 
