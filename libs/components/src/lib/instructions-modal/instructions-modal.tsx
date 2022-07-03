import { settingsStore } from '@convinz/stores';
import { Modal } from '@mantine/core';
import { inject, observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import './instructions-modal.scss';

/* eslint-disable-next-line */
export interface InstructionsModalProps {
  opened: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = inject(
  settingsStore.storeKey
)(
  observer(({ opened, onClose }: InstructionsModalProps) => {
    const { t } = useTranslation();

    return (
      <Modal
        opened={opened}
        onClose={() => onClose()}
        title={t('game.instructions')}
      >
        {/* Modal content */}
      </Modal>
    );
  })
);

export default InstructionsModal;
