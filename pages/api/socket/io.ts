import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as SocketIoServer } from 'socket.io';

import { NextApiResponseServerIO} from '@/types';


export const config = {
    api: {
        bodyParser: false,
    },
}

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        console.log('New Socket.io server');
        const path = '/api/socket/io';
        const httpServer: NetServer = res.socket.server as any;
        const io = new SocketIoServer(httpServer, {
            path,
            addTrailingSlash: false,
        });
        res.socket.server.io = io;
    }
    res.end();
}

export default ioHandler;