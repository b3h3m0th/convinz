import { Language } from '@convinz/shared/language';
import { settingsStore } from '@convinz/stores';
import { Button, Modal, NativeSelect } from '@mantine/core';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Language as LanguageIcon } from 'tabler-icons-react';
import './settings-modal.scss';

/* eslint-disable-next-line */
export interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = inject(
  settingsStore.storeKey
)(
  observer(({ opened, onClose }: SettingsModalProps) => {
    const { t } = useTranslation();
    const [language, setLanguage] = useState<Language>(settingsStore.language);

    const onSave = () => {
      settingsStore.setIsSettingsModalOpened(false);
      settingsStore.setLanguage(language);
    };

    return (
      <Modal
        opened={opened}
        onClose={() => onClose()}
        title={t('settings.title')}
        className="settings"
      >
        <NativeSelect
          data={[
            { label: 'English', value: 'en' },
            { label: 'Deutsch', value: 'de' },
          ]}
          label={t('settings.language')}
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          icon={<LanguageIcon size={18} />}
        />

        <Button onClick={() => onSave()} mt="xs">
          {t('settings.save')}
        </Button>
      </Modal>
    );
  })
);

export default SettingsModal;
