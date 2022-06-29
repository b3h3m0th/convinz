import type { Language } from '@convinz/shared/language';
import i18n from 'libs/shared/language/src/lib';
import { action, makeAutoObservable, observable } from 'mobx';
import { IStore } from '../interfaces';

export class SettingsStore implements IStore {
  storeKey = 'settingsStore' as const;

  @observable language: Language = 'en';
  @observable isSettingsModalOpened = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action setIsSettingsModalOpened(value: boolean) {
    this.isSettingsModalOpened = value;
  }

  @action setLanguage(value: Language) {
    this.language = value;
    i18n.changeLanguage(value);
  }
}

export const settingsStore = new SettingsStore();
