export enum MessageType {
  OPEN_URL = 'OPEN_URL',
}

export interface OpenUrlMessage {
  type: MessageType.OPEN_URL;
  url: string;
}

export type AppMessage = OpenUrlMessage;

export const isAppMessage = (message: unknown): message is AppMessage => {
  return (
    !!message &&
    typeof message === 'object' &&
    'type' in message &&
    typeof message.type === 'string' &&
    message.type === MessageType.OPEN_URL &&
    'url' in message &&
    typeof message.url === 'string'
  );
};
