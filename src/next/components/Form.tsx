import { Button, FormLabel, Input, Stack } from '@mui/joy';
import { type FormEvent, useState } from 'react';
import type Client from 'socket-actions/client';

import InputLine from './InputLine';

type propType = {
    client?: Client
}

export default function Form({ client }: propType): JSX.Element {
    const [participantsQuantity, setPariticipantsQuantity] = useState(0);

    const clickAddParticipants = (): void => {
        setPariticipantsQuantity(participantsQuantity + 1);
    };

    const clickRemoveParticipants = (): void => {
        if (participantsQuantity <= 0)
            return;

        setPariticipantsQuantity(participantsQuantity - 1);
    };

    const submit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const formData = new FormData(form);

        const data: Record<string, any> = {};
        for (const [key, value] of [...formData.entries()]) {
            if (key.includes('[]')) {
                const arrayKey = key.replace('[]', '');

                if (data[arrayKey] === undefined)
                    data[arrayKey] = [];

                data[arrayKey].push(value);

                continue;
            }

            data[key] = value;
        }

        form.reset();

        setPariticipantsQuantity(0);

        client?.sendAction('addPlans', data);
    };

    return <form onSubmit={submit}>
        <Stack gap={2}>
            <InputLine name='title' required />

            <InputLine name="description" />

            <InputLine name="location" />

            <InputLine name="date" type='date' required />

            <Stack gap={1}>
                <Stack direction="row" justifyContent="space-between">
                    <FormLabel>Participants</FormLabel>

                    <Stack direction="row" gap={1}>
                        <Button color="success" onClick={clickAddParticipants}>+</Button>

                        <Button color="neutral" onClick={clickRemoveParticipants}>-</Button>
                    </Stack>
                </Stack>

                {[...Array(participantsQuantity)].map((_, key) => {
                    return <Input required name="participants[]" key={`participant-${key}`} />;
                })}
            </Stack>

            <Button color="primary" type="submit">Save</Button>
        </Stack>
    </form>;
}
