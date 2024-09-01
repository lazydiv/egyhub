import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole, Profile } from '@prisma/client';
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get('serverId');

        if (!profile) return new NextResponse("Unauthorized", { status: 401 })
        if (!serverId) return new NextResponse("Missing server id", { status: 400 })
        if (name === 'general') return new NextResponse("Name can not be 'general'", { status: 400 })


        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }

                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            }
        })
        
        return NextResponse.json(server)

    } catch (error) {
        console.log('[Channels_post]', error);
        return new NextResponse("Interna Error", { status: 500 });
    }

}