import { db } from "./db";



export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {

    // Find conversation
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);
    

    // If conversation doesn't exist, create one
    if (!conversation) {
        conversation = await createConversation(memberOneId, memberTwoId);
    }

    // Return conversation
    return conversation;
} 


const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        // Find conversation by ID
        return await db.conversations.findFirst({
            where: {
                AND: [
                    {
                        memberOneId
                    },
                    {
                        memberTwoId
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    },

                }
            },
        });
    } catch (error) {
        console.error(error);
    }



}


const createConversation = async (memberOneId: string, memberTwoId: string) => {

    // Create conversation
    try {
        return await db.conversations.create({
            data: {
                memberOneId,
                memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    },

                }
            },
        });

    } catch (error) {
        console.error(error);

    }
}

const getConversations = async (userId: string) => {

    // Get conversations
    const conversations = await db.conversations.findMany({
        where: {
            OR: [
                {
                    memberOneId: userId
                },
                {
                    memberTwoId: userId
                }
            ]
        },
        include: {
            memberOne: {
                include: {
                    profile: true
                }
            },
            memberTwo: {
                include: {
                    profile: true
                },

            }
        }
    });

    // Return conversations
    return conversations;
}