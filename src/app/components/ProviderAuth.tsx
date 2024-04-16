'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProviderProps {
    children: ReactNode | ReactNode[];
}

const ProviderAuth = ({ children }: ProviderProps) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default ProviderAuth;
