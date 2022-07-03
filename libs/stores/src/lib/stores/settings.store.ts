/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Language } from '@convinz/shared/language';
import { i18n } from '@convinz/shared/language';
import { action, makeAutoObservable, observable } from 'mobx';
import { IStore } from '../interfaces';
import { create, persist } from 'mobx-persist';

export class SettingsStore implements IStore {
  storeKey = 'settingsStore' as const;

  @persist @observable language: Language = Language.en;
  @observable isSettingsModalOpened = false;
  @observable isInstructionsModalOpened = false;

  constructor() {
    makeAutoObservable(this);

    setTimeout(() => {
      this.setLanguage(this.language);
    }, 1);
  }

  @action setIsSettingsModalOpened(value: boolean) {
    this.isSettingsModalOpened = value;
  }

  @action setIsInstructionsModalOpened(value: boolean) {
    this.isInstructionsModalOpened = value;
  }

  @action async setLanguage(value: Language) {
    this.language = value;
    await i18n.changeLanguage(value);
  }
}

export const settingsStore = new SettingsStore();
const hydrate = create({ storage: localStorage, jsonify: true });

hydrate(settingsStore.storeKey, settingsStore);
