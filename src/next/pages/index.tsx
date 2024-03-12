import { readFileSync, existsSync, writeFileSync } from 'fs';

import { type ReactElement, useEffect } from 'react';
import { CssVarsProvider, Sheet, CssBaseline } from '@mui/joy';

import Client, { type messageReceiver } from 'socket-actions/client';

let client: Client | null = null;

const connect = (onMessage: messageReceiver): void => {
    client = new Client({
        url: 'ws://localhost:3001',
        onMessage,
        onClose: async () => {
            console.log('Connection lost.');
            console.log('Trying again in 5 seconds...');

            setTimeout(() => {
                connect(onMessage);
            }, 5000);
        }
    });
};

type propType = {
    startingData: Record<string, any>
};

export default function Home(props: propType): ReactElement<any, any> {
    useEffect(() => {
        connect(async ({ data }) => {
            console.log(data);
        });

        console.log(client);
    }, []);

    return (
        <CssVarsProvider defaultMode="dark">
            <CssBaseline />

            <Sheet sx={{ px: 5, py: 5, height: '100vh', width: '100vw' }}>
                Test
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
