
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";


export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }

) {
    try {
        
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');

        if (!serverId) return new NextResponse("ServerId is missing", { status: 400 });
        if (!profile) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.channelId) return new NextResponse("ChannelId is missing", { status: 400 });


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
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)


    } catch (error) {




        console.log('[Channels_delete]', error);
        return new NextResponse("Interna Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }

) {
    try {
        
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { name, type } = await req.json();
        const serverId = searchParams.get('serverId');

        if (!serverId) return new NextResponse("ServerId is missing", { status: 400 });
        if (!profile) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.channelId) return new NextResponse("ChannelId is missing", { status: 400 });


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
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general"
                            }
                        },
                        data: {
                            name: {
                                set: name
                            },
                            type: {
                                set: type
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)


    } catch (error) {




        console.log('[channel_update]', error);
        return new NextResponse("Interna Error", { status: 500 });
    }
}
