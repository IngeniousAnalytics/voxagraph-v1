import React from 'react';
import { Modal, Button, TextInput, PasswordInput, Group } from '@mantine/core';
import { useForm } from '@mantine/form';

interface ChangeUserPasswordProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (values: { username: string; oldPassword: string; newPassword: string }) => void;
}

const ChangeUserPassword: React.FC<any> = ({ opened, onClose, onSubmit }:any) => {
    const form = useForm({
        initialValues: {
            oldPassword: '',
            newPassword: '',
        },

        validate: {
            oldPassword: (value) => (value.length === 0 ? 'Old password is required' : null),
            newPassword: (value) => (value.length === 0 ? 'New password is required' : null),
        },
    });

    return (
        <Modal opened={opened} onClose={()=>onClose.close()} title="Change User Password" centered>
            <form
                onSubmit={form.onSubmit((values) => {
                    onSubmit(values);
                    form.reset();
                    onClose.close();
                })}
            >
                <PasswordInput
                    label="Old Password"
                    placeholder="Enter old password"
                    mt="md"
                    {...form.getInputProps('oldPassword')}
                    required
                />
                <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    mt="md"
                    {...form.getInputProps('newPassword')}
                    required
                />
                <Group justify="flex-end" mt="xl">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Modal>
    );
};

export default ChangeUserPassword;