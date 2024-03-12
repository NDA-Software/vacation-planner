import { FormLabel, Input, Stack } from '@mui/joy';

import { firstToUppercase } from 'ts-cornucopia/string';

type propType = {
    name: string,
    type?: string,
    required?: boolean
}

const defaultType = {
    type: 'text',
    required: false
};

export default function InputLine(props: propType): JSX.Element {
    const {
        name,
        type = defaultType.type,
        required = defaultType.required
    } = props;

    return <Stack gap={1}>
        <FormLabel>{firstToUppercase(name)}</FormLabel>
        <Input name={name} type={type} required={required} />
    </Stack>;
}
