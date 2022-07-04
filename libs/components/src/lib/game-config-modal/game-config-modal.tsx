import {
  RoundsAmount,
  ExplainTime,
  VoteTime,
  explainTimes,
  roundAmounts,
  voteTimes,
} from '@convinz/shared/types';
import { settingsStore } from '@convinz/stores';
import { Button, Modal, Select } from '@mantine/core';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Exchange, Clock } from 'tabler-icons-react';
import './game-config-modal.scss';

/* eslint-disable-next-line */
export interface GameConfigModalProps {
  opened: boolean;
  onClose: () => void;
}

export const GameConfigModal: React.FC<GameConfigModalProps> = inject(
  settingsStore.storeKey
)(
  observer(({ opened, onClose }: GameConfigModalProps) => {
    const { t } = useTranslation();

    const [roundsAmount, setRoundsAmount] = useState<RoundsAmount>(
      settingsStore.roundsAmount
    );
    const [explainTime, setExplainTime] = useState<ExplainTime>(
      settingsStore.explainTime
    );
    const [voteTime, setVoteTime] = useState<VoteTime>(settingsStore.voteTime);

    const onSave = () => {
      settingsStore.setIsGameConfigModalOpened(false);
      settingsStore.setRoundsAmount(roundsAmount);
      settingsStore.setExplainTime(explainTime);
      settingsStore.setVoteTime(voteTime);
    };

    return (
      <Modal
        title="Game Configuration"
        opened={opened}
        onClose={() => onClose()}
      >
        <Select
          data={roundAmounts.map((v) => ({
            value: `${v}`,
            label: `${v} Rounds`,
          }))}
          label={'Amount of Rounds'}
          value={`${roundsAmount}`}
          onChange={(v) => setRoundsAmount(v as unknown as RoundsAmount)}
          icon={<Exchange size={18} />}
          mb="xs"
        ></Select>

        <Select
          data={explainTimes.map((v) => ({
            value: `${v}`,
            label: `${v} Seconds`,
          }))}
          label={'Time for Explaining'}
          value={`${explainTime}`}
          onChange={(v) => setExplainTime(v as unknown as ExplainTime)}
          icon={<Clock size={18} />}
          mb="xs"
        ></Select>

        <Select
          data={voteTimes.map((v) => ({
            value: `${v}`,
            label: `${v} Seconds`,
          }))}
          label={'Time for Voting'}
          value={`${voteTime}`}
          onChange={(v) => setVoteTime(v as unknown as VoteTime)}
          icon={<Clock size={18} />}
          mb="xs"
        ></Select>
        <Button onClick={() => onSave()} mt="xs">
          {t('settings.save')}
        </Button>
      </Modal>
    );
  })
);

export default GameConfigModal;
