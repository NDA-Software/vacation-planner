import { readFileSync, existsSync, writeFileSync } from 'fs';

import { type ReactElement, useEffect, useState, useRef } from 'react';
import { CssVarsProvider, Sheet, CssBaseline, Typography, Stack, Table, Button, Tooltip } from '@mui/joy';

import { useReactToPrint } from 'react-to-print';

import Client, { type messageReceiver } from 'socket-actions/client';

import Form from '../components/Form';
import { useRouter } from 'next/router';

export type vacationType = {
    title: string,
    description: string,
    date: Date,
    location: string,
    participants?: string[],
    key?: number
};

type propType = {
    startingData: vacationType[]
};

export default function Home({ startingData }: propType): ReactElement<any, any> {
    const [client, setClient] = useState<Client | undefined>();
    const [data, setData] = useState<vacationType[]>(startingData);

    const router = useRouter();

    const { formActive: formActiveQuery, key: itemKey } = router.query;

    const [formActive, setFormActive] = useState<boolean>(formActiveQuery === '1');
    const [selectedItem, setSelectedItem] = useState<vacationType | undefined>(itemKey !== undefined ? data[Number(itemKey)] : undefined);

    const [printing, setPrinting] = useState<boolean>(false);

    const printRef = useRef<HTMLTableElement>(null);

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
        setSelectedItem(undefined);

        window.history.pushState('', '', '/?formActive=1');

        setFormActive(true);
    };

    const clickClose = (): void => {
        window.history.pushState('', '', '/');

        setFormActive(false);
    };

    const clickEdit = (data: vacationType, key: number): void => {
        setSelectedItem({ ...data, key });

        window.history.pushState('', '', `/?formActive=1&key=${key}`);

        setFormActive(true);
    };

    const clickRemove = (key: number): void => {
        client?.sendAction('removePlan', { key });
    };

    const print = useReactToPrint({
        content: () => printRef.current,
        pageStyle: () => 'margin: 50px',
        onAfterPrint: () => { setPrinting(false); }
    });

    const clickPrint = (): void => {
        setPrinting(true);

        setTimeout(print, 1);
        setTimeout(print, 1);
    };

    useEffect(() => {
        connect(async (message) => {
            const { newData } = JSON.parse(message.data);

            setData(newData);
        });
    }, []);

    return (
        <CssVarsProvider defaultMode={printing ? 'light' : 'dark'}>
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
                    : formActive
                        ? <Form client={client} clickClose={clickClose} selectedItem={selectedItem} />
                        : <>
                            <Typography level="h3" textAlign="center">
                                    Vacations
                            </Typography>

                            <Button variant="plain" onClick={clickNew} sx={{ position: 'absolute', top: '8px', right: '70px' }}>New</Button>

                            <Button variant="plain" onClick={clickPrint} sx={{ position: 'absolute', top: '8px', right: '8px' }}>Print</Button>

                            <Table stickyHeader hoverRow sx={{ height: '100%' }} ref={printRef} >
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Location</th>
                                        <th>Participants</th>
                                        <th style={!printing ? { width: '16%' } : { display: 'none' }}>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map((item, key) => {
                                        const { title, description, date, location, participants } = item;

                                        const dateString = new Date(date).toLocaleDateString();
                                        const participatnsString = (participants ?? []).join(', ');

                                        return <tr key={`vacation-${key}`}>
                                            <Tooltip title={title}>
                                                <th>{title}</th>
                                            </Tooltip>

                                            <Tooltip title={description}>
                                                <th>{description}</th>
                                            </Tooltip>

                                            <Tooltip title={dateString}>
                                                <th>{dateString}</th>
                                            </Tooltip>

                                            <Tooltip title={location}>
                                                <th>{location}</th>
                                            </Tooltip>

                                            <Tooltip title={participatnsString}>
                                                <th>{participatnsString}</th>
                                            </Tooltip>

                                            <th style={{ display: (printing ? 'none' : 'block') }}>
                                                <Stack direction="row" gap={1}>
                                                    <Button variant='plain' onClick={() => { clickEdit(item, key); }}>+</Button>

                                                    <Button variant='plain' color="danger" onClick={() => { clickRemove(key); }}>X</Button>
                                                </Stack>
                                            </th>
                                        </tr>;
                                    })}
                                </tbody>
                            </Table>
                        </>
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
