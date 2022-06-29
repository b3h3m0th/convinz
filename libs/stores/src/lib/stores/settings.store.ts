import { action, makeAutoObservable, observable } from 'mobx';
import { IStore } from '../interfaces';

export class SettingsStore implements IStore {
  storeKey = 'settingsStore' as const;

  @observable isSettingsModalOpened = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action setIsSettingsModalOpened(value: boolean) {
    this.isSettingsModalOpened = value;
  }
}

export const settingsStore = new SettingsStore();
