
import { currentProfile } from "@/lib/current-profile";
import { db } from '@/lib/db';
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile()
        const { name, imageUrl } = await req.json()

        if (!profile) {
            return new NextResponse("unauthorized", { status: 401 })
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl
            }
        })
        return NextResponse.json(server)

    } catch (error) {
        console.log("[server_id_patch]", error);
        return new NextResponse("internal error", { status: 500 })
    }
}





export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {

        const profile = await currentProfile();
        
        


        if (!profile) return new NextResponse('unauthorized', { status: 401 })
        if (!params.serverId) return new NextResponse('Server id messing', { status: 400 })
        
        const server = await db.server.delete({
            where: {
                profileId: profile.id,
                id: params.serverId
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("[Server_delete] Error", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}