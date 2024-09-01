import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NEXT_REQUEST_META } from 'next/dist/server/request-meta';
import { useParams } from 'next/navigation';
import { NextResponse } from 'next/server';


export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("unauthorized", { status: 401 })
        }
        if (!params.serverId) {
            return new NextResponse("sever id messing", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("[Server_ID_LEAVE]",error);
        return new NextResponse("internal error", {status: 500})
    }
}