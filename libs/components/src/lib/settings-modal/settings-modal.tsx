import { Modal } from '@mantine/core';
import './settings-modal.scss';

/* eslint-disable-next-line */
export interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  opened,
  onClose,
}: SettingsModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={() => onClose()}
      title="Settings"
      className="settings"
    >
      Settings
    </Modal>
  );
};

export default SettingsModal;
