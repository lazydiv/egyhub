import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";




interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };

}

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    const profile = await currentProfile()
    if (!profile) return redirect('/')
    if (!params.inviteCode) return redirect('/')

    const inServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some:{
                    profileId: profile.id
                }
            }
        }
    })

    if (inServer) return redirect(`/servers/${inServer.id}`)

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    })

    if (server) return redirect(`/servers/${server.id}`)


    return null
}

export default InviteCodePage