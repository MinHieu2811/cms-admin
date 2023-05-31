import React from 'react';

import { Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react';
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

const AUTHORITIES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
};

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
      <FieldInput
        name="login"
        label={t('users:data.login.label')}
        required={t('users:data.login.required') as string}
        validations={[
          {
            rule: isMinLength(2),
            message: t('users:data.login.tooShort', { min: 2 }) as string,
          },
          {
            rule: isMaxLength(50),
            message: t('users:data.login.tooLong', { max: 50 }) as string,
          },
          {
            rule: isPattern(
              '^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'
            ),
            message: t('users:data.login.invalid') as string,
          },
        ]}
      />
      <Stack direction={{ base: 'column', sm: 'row' }} spacing="6">
        <FieldInput name="firstName" label={t('users:data.firstname.label')} />
        <FieldInput name="lastName" label={t('users:data.lastname.label')} />
      </Stack>
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
            rule: isMaxLength(254),
            message: t('users:data.email.tooLong', { min: 254 }) as string,
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
      <CheckboxGroup colorScheme="green" defaultValue={['naruto', 'kakashi']}>
        <Stack spacing={[1, 5]} direction={['column', 'row']}>
          {authorities?.map((item: string) => (
            <Checkbox value={item}>Naruto</Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </Stack>
  );
};
