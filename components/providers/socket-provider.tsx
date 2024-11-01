'use client';




import { Client } from '@clerk/nextjs/server';
import { create } from 'domain';
import { useState, useContext, useEffect, createContext } from 'react';

import { io as ClientIo } from 'socket.io-client';





type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
}


const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});


export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<any | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = new (ClientIo as any)(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            path: '/api/socket/io',
            addTrailingSlash: false,
        });

        socketInstance.on('connect', () => {
            setIsConnected(true);
        });
        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}