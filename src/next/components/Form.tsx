import { Button, FormLabel, Grid, Input, Stack, Typography } from '@mui/joy';
import { type FormEvent, useState } from 'react';
import type Client from 'socket-actions/client';

import InputLine from './InputLine';
import { useRouter } from 'next/router';

type propType = {
    client?: Client
}

export default function Form({ client }: propType): JSX.Element {
    const [participantsQuantity, setPariticipantsQuantity] = useState(0);

    const router = useRouter();

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

        clickClose();
    };

    const clickClose = (): void => {
        router.push('/')
            .then(() => {})
            .catch(() => {});
    };

    return <form onSubmit={submit}>
        <Stack justifyContent="space-between" height="calc(100vh - 16px)" gap={1}>
            <Stack height="3vh">
                <Typography level="h4" textAlign="center">New Vacation</Typography>
            </Stack>

            <Button variant="plain" onClick={clickClose} sx={{ position: 'absolute', top: '8px', right: '8px' }}>X</Button>

            <Grid container sx={{ height: '94vh', overflow: 'auto', paddingRight: '8px' }} columns={{ sm: 3, md: 6, lg: 6 }} spacing={1} alignContent="flex-start">
                <InputLine name='title' required />

                <InputLine name="description" />

                <InputLine name="location" />

                <InputLine name="date" type='date' required />

                <Grid sm={3} md={6} lg={6}>
                    <Stack direction="row" justifyContent="space-between">
                        <FormLabel>Participants</FormLabel>

                        <Stack direction="row" gap={1}>
                            <Button color="success" onClick={clickAddParticipants}>+</Button>

                            <Button color="neutral" onClick={clickRemoveParticipants}>-</Button>
                        </Stack>
                    </Stack>
                </Grid>

                {[...Array(participantsQuantity)].map((_, key) => {
                    return <Grid sm={1} md={1} lg={1}><Input required name="participants[]" key={`participant-${key}`} /></Grid>;
                })}
            </Grid>

            <Button color="primary" type="submit">Save</Button>
        </Stack>
    </form>;
}
