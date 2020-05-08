import { MessageType } from "./messageType";
export class SocketMessage<T> {
  private messageType: MessageType;
  private data: T;

  constructor(messageType: MessageType, data: T) {
    this.messageType = messageType;
    this.data = data;
  }
}
