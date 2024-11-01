import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from "next/server"



const MESSAGE_PATCH = 10


export async function GET(req:Request) {

    try {
        const profile = await currentProfile()  
        const {searchParams} = new URL(req.url)

        const cursor = searchParams.get('cursor')
        const channelId = searchParams.get('channelId')

        if (!profile) {
            return new NextResponse('unauthorized', { status: 401 })
        }

        if (!channelId) {
            return new NextResponse('channelId is required', { status: 400 })
        }

        let messages: Message[] = []

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGE_PATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId,
                 
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
            })

        } else {
            messages = await db.message.findMany({
                take: MESSAGE_PATCH,
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                
            })
        }
        

        let nextCursor = null

        if (messages.length === MESSAGE_PATCH) {
            nextCursor = messages[messages.length - 1].id
        }


        return NextResponse.json({
            items: messages,
            nextCursor
        })


    } catch (error) {
        console.log('[messages error]', error)
        return new NextResponse('internal server error', { status: 500 })
    }
}