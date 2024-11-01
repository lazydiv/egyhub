import { channel } from 'diagnostics_channel';
import { currentProfile } from '@/lib/current-profile';
import { currentProfilePages } from '@/lib/current-profile-page';
import { NextApiResponseServerIO } from '@/types';

import { NextApiRequest } from 'next';
import { error } from 'console';
import { db } from '@/lib/db';


export default async function handler(
    req: NextApiRequest,
     res: NextApiResponseServerIO
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const profile = await currentProfilePages(req);
        const {content , fileUrl} = req.body
        const  {serverId, channelId} = req.query

        if (!profile) {
            return res.status(401).json({ error: 'Unauthroized' })
        }
        if (!serverId) {
            return res.status(400).json({ error: 'serverid is messing' })
        }
        if (!channelId) {
            return res.status(400).json({ error: 'channelid is messing' })
        }
        if (!content) {
            return res.status(400).json({ error: 'content is messing' })
        }


        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        });
        
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }
        

        const member = server.members.find((member) => member.profileId === profile.id);    
        
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                memberId: member.id,
                channelId: channelId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });


        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io.emit(channelKey, message);

        return res.status(200).json({ message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
        
    }

    
}