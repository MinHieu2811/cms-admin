import React from 'react';

import { Stack } from '@chakra-ui/react';
import {
  isEmail,
  isMaxLength,
  isMinLength,
  isPattern,
} from '@formiz/validations';
import { useTranslation } from 'react-i18next';

// import { FieldCheckboxes } from '@/src/components/FieldCheckboxes';
import { FieldInput } from '@/src/components/FieldInput';
import { FieldSelect } from '@/src/components/FieldSelect';
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE_KEY,
} from '@/src/constants/i18next';
import { RolesSystem } from '@/src/constants';
import { FieldCheckboxes } from '../FieldCheckboxes';

export const UserForm = () => {
  const { t } = useTranslation(['common', 'users']);

  const authorities = Object.keys(RolesSystem).map((value) => value);
  return (
    <Stack
      direction="column"
      borderRadius="lg"
      spacing="6"
      shadow="md"
      bg="white"
      _dark={{ bg: 'gray.900' }}
      p="6"
    >
      <Stack direction={{ base: 'column', sm: 'row' }} spacing="6">
        <FieldInput
          name="name"
          label={t('users:data.username.label')}
          required={t('users:data.username.required') as string}
        />
      </Stack>
      <FieldInput
        name="hashedPassword"
        label={t('users:data.password.label')}
        required={t('users:data.password.required') as string}
        validations={[
          {
            rule: isMinLength(2),
            message: t('users:data.password.tooShort', { min: 8 }) as string,
          },
          {
            rule: isMaxLength(50),
            message: t('users:data.password.tooLong', { max: 50 }) as string,
          },
          {
            rule: isPattern(
              '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.-_*])([a-zA-Z0-9@#$%^&+=*.-_]){8,}$'
            ),
            message: t('users:data.password.invalid') as string,
          },
        ]}
      />
      <FieldInput
        name="email"
        label={t('users:data.email.label')}
        required={t('users:data.email.required') as string}
        validations={[
          {
            rule: isMinLength(5),
            message: t('users:data.email.tooShort', { min: 5 }) as string,
          },
          {
            rule: isMaxLength(100),
            message: t('users:data.email.tooLong', { max: 100 }) as string,
          },
          {
            rule: isEmail(),
            message: t('users:data.email.invalid') as string,
          },
        ]}
      />
      <FieldSelect
        name="langKey"
        label={t('users:data.language.label')}
        options={AVAILABLE_LANGUAGES.map(({ key }) => ({
          label: t(`common:languages.${key}`),
          value: key,
        }))}
        defaultValue={DEFAULT_LANGUAGE_KEY}
      />
      <FieldCheckboxes
        name="authorities"
        label={t('users:data.authorities.label')}
        options={Object.values(RolesSystem).map((value) => ({
          value,
        }))}
        required={t('users:data.authorities.required') as string}
      />
    </Stack>
  );
};
