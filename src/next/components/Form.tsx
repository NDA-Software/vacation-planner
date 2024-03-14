import { Button, FormLabel, Grid, Input, Stack, Typography } from '@mui/joy';
import { type FormEvent, useState, useEffect } from 'react';
import type Client from 'socket-actions/client';

import InputLine from './InputLine';

import { type vacationType } from '@/pages';

type propType = {
    clickClose: () => void,
    client?: Client,
    selectedItem?: vacationType
}

export default function Form({ client, clickClose, selectedItem }: propType): JSX.Element {
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

        let action = 'addPlan';

        const data: Record<string, any> = {};
        for (const [key, value] of [...formData.entries()]) {
            if (key === 'key' && value !== '')
                action = 'editPlan';

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

        client?.sendAction(action, data);

        clickClose();
    };

    useEffect(() => {
        const keyInput = document.getElementsByName('key')[0] as unknown as HTMLInputElement;
        const titleInput = document.getElementsByName('title')[0] as unknown as HTMLInputElement;
        const descriptionInput = document.getElementsByName('description')[0] as unknown as HTMLInputElement;
        const locationInput = document.getElementsByName('location')[0] as unknown as HTMLInputElement;
        const dateInput = document.getElementsByName('date')[0] as unknown as HTMLInputElement;

        if (selectedItem !== undefined) {
            const { key, title, description, location, date, participants } = selectedItem;

            keyInput.value = key?.toString() ?? '';

            titleInput.value = title;

            descriptionInput.value = description;

            locationInput.value = location;

            dateInput.value = date.toString();

            if (participants !== undefined) {
                setPariticipantsQuantity(participants.length);

                setTimeout(() => {
                    const inputs = document.getElementsByName('participants[]') as unknown as HTMLInputElement[];
                    for (let i = 0; i < participants?.length; i++)
                        inputs[i].value = participants[i];
                }, 1);
            }
        }
    }, []);

    return <form onSubmit={submit}>
        <Stack justifyContent="space-between" height="calc(100vh - 16px)" gap={1}>
            <Stack height="3vh">
                <Typography level="h4" textAlign="center">{selectedItem !== undefined ? 'Edit' : 'New'} Vacation</Typography>
            </Stack>

            <Button variant="plain" onClick={clickClose} sx={{ position: 'absolute', top: '8px', right: '8px' }}>X</Button>

            <Grid container sx={{ height: '94vh', overflow: 'auto', paddingRight: '8px' }} columns={{ sm: 3, md: 6, lg: 6 }} spacing={1} alignContent="flex-start">
                <input type="hidden" name="key" />

                <InputLine name='title' required />

                <InputLine name="description" />

                <InputLine name="location" required />

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
                    return <Grid sm={1} md={1} lg={1} key={`participant-${key}`}><Input required name="participants[]" /></Grid>;
                })}
            </Grid>

            <Button color="primary" type="submit">Save</Button>
        </Stack>
    </form>;
}
