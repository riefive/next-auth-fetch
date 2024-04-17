'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

type Props = {
    className?: string;
    callbackUrl?: string | null;
};

const Login = (props: Props) => {
    const router = useRouter();
    const emailVal = useRef('');
    const passwordVal = useRef('');
    const [errorVal, setErrorVal] = useState(false)
    const [errorMessageVal, setErrorMessageVal] = useState('')

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorVal(false)
        setErrorMessageVal('')
        const isRedirect = false
        let options = {}
        if (isRedirect) {
            options = { 
                email: emailVal.current,
                password: passwordVal.current,
                redirect: true,
                callbackUrl: '/',
            }
        } else {
            options = { 
                email: emailVal.current,
                password: passwordVal.current,
                redirect: false,
            }
        }

        const res = await signIn('credentials', options);

        if (!res) return null
        
        if (res?.error) {
            setErrorVal(true)
            try {
                const errorMessage = JSON.parse(res.error)
                setErrorMessageVal(errorMessage?.response?.message || '')
            } catch (error) {
                console.log(error)
            }
            return null
        }

        router.push(props.callbackUrl ?? 'http://localhost:3000');
    };

    return (
        <Box component="section" sx={{ p: 2, width: '450px', height: '450px', border: '1px solid #A9A9A9', borderRadius: 1,  margin: '20px auto' }}>  
            <Stack sx={{ width: '400px', margin: '20px auto' }} spacing={2}>
                {errorVal && (
                        <Alert severity="success" color="warning">
                            { errorMessageVal ?? 'Authentication Failed' }
                        </Alert>
                )}
                <h1 className="text-xl text-center font-semibold uppercase">Login Form</h1>
                <form onSubmit={onSubmit} className="p-2 flex flex-col gap-3">
                    <TextField label="Email" name="email" variant="outlined" onChange={(e) => (emailVal.current = e.target.value)} />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        onChange={(e) => (passwordVal.current = e.target.value)}
                    />
                    <div className="my-2"></div>
                    <Stack direction="column" useFlexGap flexWrap="wrap" spacing={2}>
                        <Button type="submit" variant="contained" size="large" className="capitalize">Sign In</Button>
                        <Button variant="outlined" color="error" size="large" className="capitalize" onClick={() => router.push(props.callbackUrl ?? "http://localhost:3000")}>
                            Cancel
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Box>
    )
};

export default Login;

