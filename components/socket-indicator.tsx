'use client'

import  {useSocket} from '@/components/providers/socket-provider'
import { Badge } from "@/components/ui/badge";


export const SocketIndicator = () => {
    const {isConnected} = useSocket();

    if (!isConnected) {
        return (
            <Badge
                className='bg-yellow-500 border-none text-white'
                variant="outline"
            >
                fallback: Polling every 1s
            </Badge>
        )
    }

    return (
        <Badge
            className='bg-emerald-600 text-white border-none'
            variant={'outline'}
        >
            Live: Real-time Updates
        </Badge>
    )
}