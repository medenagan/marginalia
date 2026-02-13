import { NoteIdentifier } from './note';

export enum MessageType {
  OPEN_URL = 'OPEN_URL',
  SELECT_NOTE = 'SELECT_NOTE',
}

export interface OpenUrlMessage {
  type: MessageType.OPEN_URL;
  url: string;
}

export interface SelectNoteMessage {
  type: MessageType.SELECT_NOTE;
  noteId: NoteIdentifier;
}

export type AppMessage = OpenUrlMessage | SelectNoteMessage;

export const isAppMessage = (message: unknown): message is AppMessage => {
  if (!message || typeof message !== 'object' || !('type' in message)) {
    return false;
  }

  const msg = message as { type: unknown };

  if (typeof msg.type !== 'string') {
    return false;
  }

  switch (msg.type) {
    case MessageType.OPEN_URL:
      return 'url' in message && typeof (message as OpenUrlMessage).url === 'string';
    case MessageType.SELECT_NOTE:
      return 'noteId' in message && typeof (message as SelectNoteMessage).noteId === 'string';
    default:
      return false;
  }
};
