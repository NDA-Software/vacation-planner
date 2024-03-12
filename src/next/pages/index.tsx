import { readFileSync, existsSync, writeFileSync } from 'fs';

import { type ReactElement, useEffect, useState } from 'react';
import { CssVarsProvider, Sheet, CssBaseline, Typography, Stack } from '@mui/joy';

import Client, { type messageReceiver } from 'socket-actions/client';

import Form from '../components/Form';

type holidayType = {
    title: string,
    description: string,
    date: Date,
    location: string,
    participants: string[]
};

type propType = {
    startingData: holidayType[]
};

export default function Home(props: propType): ReactElement<any, any> {
    const [client, setClient] = useState<Client | undefined>();

    const connect = (onMessage: messageReceiver): void => {
        setClient(new Client({
            url: 'ws://localhost:3001',
            onMessage,
            onClose: async () => {
                console.log('Connection lost.');
                console.log('Trying again in 5 seconds...');

                setTimeout(() => {
                    connect(onMessage);
                }, 5000);
            }
        }));
    };

    useEffect(() => {
        connect(async ({ data }) => {
            console.log(data);
        });

        console.log(client);
    }, []);

    return (
        <CssVarsProvider defaultMode="dark">
            <CssBaseline />

            <Sheet sx={{ padding: '8px 0 8px 8px', scrollbarGutter: 'stable', overflow: 'auto', height: '100vh', width: '100vw' }}>
                {client === undefined
                    ? <Stack alignContent="center" justifyContent="center" height="100%">
                        <Typography level="h1" textAlign="center">
                            Trying to connect to server...
                        </Typography>

                        <Typography level="h4" textAlign="center">
                            If this message persists, the server is offline or unreachable.
                        </Typography>
                    </Stack>
                    : <Form client={client} />
                }
            </Sheet>
        </CssVarsProvider>
    );
}

export const getServerSideProps = (): Record<string, object> => {
    let startingData = [];

    const fileName = '../../data.json';

    if (!existsSync(fileName))
        writeFileSync(fileName, '[]');

    const data = readFileSync('../../data.json').toString();

    startingData = JSON.parse(data);

    return {
        props: {
            startingData
        }
    };
};
