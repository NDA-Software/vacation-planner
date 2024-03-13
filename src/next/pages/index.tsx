import { readFileSync, existsSync, writeFileSync } from 'fs';

import { type ReactElement, useEffect, useState } from 'react';
import { CssVarsProvider, Sheet, CssBaseline, Typography, Stack, Table, Button } from '@mui/joy';

import Client, { type messageReceiver } from 'socket-actions/client';

import Form from '../components/Form';
import { useRouter } from 'next/router';

type holidayType = {
    title: string,
    description: string,
    date: Date,
    location: string,
    participants?: string[]
};

type propType = {
    startingData: holidayType[]
};

export default function Home({ startingData }: propType): ReactElement<any, any> {
    const [client, setClient] = useState<Client | undefined>();
    const [data, setData] = useState<holidayType[]>(startingData);

    const router = useRouter();

    const { formActive } = router.query;

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

    const clickNew = (): void => {
        router.push({
            pathname: '/',
            query: {
                formActive: '1'
            }
        }).then(() => {}
        ).catch(() => {});
    };

    useEffect(() => {
        connect(async (message) => {
            const { newData } = JSON.parse(message.data);

            setData(newData);
        });
    }, []);

    return (
        <CssVarsProvider defaultMode="dark">
            <CssBaseline />

            <Sheet sx={{ padding: '8px', height: '100%', width: '100%', boxSizing: 'border-box' }}>
                {client === undefined
                    ? <Stack alignContent="center" justifyContent="center" height="100%">
                        <Typography level="h1" textAlign="center">
                            Trying to connect to server...
                        </Typography>

                        <Typography level="h4" textAlign="center">
                            If this message persists, the server is offline or unreachable.
                        </Typography>
                    </Stack>
                    : formActive === '1'
                        ? <Form client={client} />
                        : <Table stickyHeader hoverRow>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Participants</th>
                                    <th style={{ width: '15%' }}>Actions <Button variant="plain" onClick={clickNew}>+</Button></th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.map(({ title, description, date, location, participants }) => {
                                    const dateString = new Date(date).toLocaleDateString();
                                    const participatnsString = (participants ?? []).join(', ');

                                    return <tr key={Math.random()}>
                                        <th>{title}</th>
                                        <th>{description}</th>
                                        <th>{dateString}</th>
                                        <th>{location}</th>
                                        <th>{participatnsString}</th>
                                        <th>
                                            <Stack direction="row" gap={1}>
                                                <Button variant='plain'>+</Button><Button variant='plain' color="danger">X</Button>
                                            </Stack>
                                        </th>
                                    </tr>;
                                })}
                            </tbody>
                        </Table>
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
