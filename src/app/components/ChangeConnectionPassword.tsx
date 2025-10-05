import React, { useState } from 'react';
import { Modal, Group, Button, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface ChangeConnectionPasswordProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: {
    userid: string;
    dbid: string;
    username: string;
    password: string;
  }) => void;
}

export default function ChangeConnectionPassword({
  opened,
  onClose,
  onSubmit,
}: any) {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      host: '',
      validate: {
        host: (value: string) =>
          value.length === 0 ? 'Host is required' : null,
        username: (value: {
          trim: () => { (): any; new (): any; length: number };
        }) => (value.trim().length === 0 ? 'Username is required' : null),
        password: (value: string | any[]) =>
          value.length === 0 ? 'Password is required' : null,
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form.values);
  };

  return (
    <Modal
      opened={opened}
      onClose={()=>onClose.close()}
      title="Connect Updated Database Password"
      centered
    >
      <form onSubmit={handleSubmit}>
         <TextInput
          label="Host"
          {...form.getInputProps('host')}
          required
          mb="sm"
        />
        <TextInput
          label="Username"
          {...form.getInputProps('username')}
          required
          mb="sm"
        />
        <PasswordInput
          label="New Password"
          {...form.getInputProps('password')}
          required
          mb="md"
        />
        <Group justify="flex-end">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Modal>
  );
}
