import { Language } from '@convinz/shared/language';
import {
  explainTimes,
  roundAmounts,
  RoundsAmount,
  voteTimes,
} from '@convinz/shared/types';
import type { ExplainTime, VoteTime } from '@convinz/shared/types';
import { settingsStore } from '@convinz/stores';
import { Avatar, Button, Group, Modal, Select, Text } from '@mantine/core';
import { inject, observer } from 'mobx-react';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Exchange, Language as LanguageIcon } from 'tabler-icons-react';
import './settings-modal.scss';

interface LanguageItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
}

const SelectItem = forwardRef<HTMLDivElement, LanguageItemProps>(
  ({ image, label, ...rest }: LanguageItemProps, ref) => (
    <div ref={ref} {...rest}>
      <Group noWrap>
        <Avatar src={image} />
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);

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
        <Select
          data={[
            {
              label: 'English',
              value: 'en',
              image: 'https://img.icons8.com/color/96/000000/usa.png',
            },
            {
              label: 'Deutsch',
              value: 'de',
              image: 'https://img.icons8.com/color/96/000000/germany.png',
            },
          ]}
          label={t('settings.language')}
          value={language}
          onChange={(v) => setLanguage(v as Language)}
          icon={<LanguageIcon size={18} />}
          itemComponent={SelectItem}
          mb="xs"
        ></Select>

        <Button onClick={() => onSave()} mt="xs">
          {t('settings.save')}
        </Button>
      </Modal>
    );
  })
);

export default SettingsModal;
