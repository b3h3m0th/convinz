/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Language } from '@convinz/shared/language';
import { i18n } from '@convinz/shared/language';
import { action, makeAutoObservable, observable } from 'mobx';
import { IStore } from '../interfaces';
import { create, persist } from 'mobx-persist';
import {
  defaultExplainTime,
  defaultRoundsAmount,
  defaultVoteTime,
  VoteTime,
} from '@convinz/shared/types';
import type { ExplainTime, RoundsAmount } from '@convinz/shared/types';

export class SettingsStore implements IStore {
  storeKey = 'settingsStore' as const;

  @persist @observable language: Language = Language.en;
  @persist @observable roundsAmount: RoundsAmount = defaultRoundsAmount;
  @persist @observable explainTime: ExplainTime = defaultExplainTime;
  @persist @observable voteTime: VoteTime = defaultVoteTime;
  @observable isSettingsModalOpened = false;
  @observable isInstructionsModalOpened = false;
  @observable isGameConfigModalOpened = false;

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

  @action setIsGameConfigModalOpened(value: boolean) {
    this.isGameConfigModalOpened = value;
  }

  @action async setLanguage(value: Language) {
    this.language = value;
    await i18n.changeLanguage(value);
  }

  @action setRoundsAmount(value: RoundsAmount) {
    this.roundsAmount = value;
  }

  @action setExplainTime(value: ExplainTime) {
    this.explainTime = value;
  }

  @action setVoteTime(value: VoteTime) {
    this.voteTime = value;
  }
}

export const settingsStore = new SettingsStore();
const hydrate = create({ storage: localStorage, jsonify: true });

hydrate(settingsStore.storeKey, settingsStore);
