import { ChatHeader } from "@/components/chats/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
};



const ChannelIdPage = async ({
  params
} : ChannelIdPageProps) => {

  const  profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
      serverId: params.serverId
    },
   
  })

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId
    }
  });


  if (!channel || !member) {
    return null;
  }

  
  return (
    <div className="bg-white dark:bg-zinc-800">
      <ChatHeader 
        name={channel.name}
        serverId={params.serverId}
        type="channel"
        
      
      />
    </div>
  )
}

export default ChannelIdPage