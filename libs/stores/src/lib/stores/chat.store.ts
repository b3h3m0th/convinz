import type { ChatMessage } from '@convinz/shared/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { IStore } from '../interfaces';

export class ChatStore implements IStore {
  storeKey = 'chatStore' as const;
  @observable messages: ChatMessage[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action addMessage(message: ChatMessage) {
    this.messages.push(message);
  }

  @action resetMessages() {
    this.messages = [];
  }
}

export const chatStore = new ChatStore();
