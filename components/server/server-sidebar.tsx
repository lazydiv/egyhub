


import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect, useParams, useRouter } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./server-search";
import { HashIcon, Mic, Shield, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "./severSection";
import { channel } from "diagnostics_channel";
import { ServerChannel } from "./server-channel";
import ServerMember from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <HashIcon className="mr-2 h-4 w-4 " />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4 " />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4 " />
}

const roleIconeMap = {

  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-red-500 dark:text-yellow-200" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />


}
export const ServerSidebar = async ({
  serverId
}: ServerSidebarProps) => {
  const profile = await currentProfile();


  if (!profile) {
    return redirect("/");
  }




  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc",
        }
      },
    },
  });


  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
  const members = server?.members.filter((member) => member.profileId !== profile.id)

  if (!server) return redirect('/')


  const role = server.members.find((member) => member.profileId === profile.id)?.role;
  return (
    <div className="flex border-neutral-200
                        dark:border-neutral-800 
                         flex-col text-primary w-full h-full 
                         border-r-2  dark:bg-[#2b2d31]
                          bg-[#f2f3f5]">
      <ServerHeader
        server={server}
        role={role}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch data={[
            {
              label: "Text Channels",
              type: "channel",
              data: textChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]
              }))
            },
            {
              label: "Voice Channels",
              type: "channel",
              data: audioChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]
              }))
            },
            {
              label: "Video Channels",
              type: "channel",
              data: videoChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]
              }))
            },
            {
              label: "Members",
              type: "member",
              data: members?.map((member) => ({
                id: member.id,
                name: member.profile.name,
                icon: roleIconeMap[member.role]
              }))
            }
          ]} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

        {!!textChannels?.length && (
          <div className="mb-2">

            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />


            {textChannels?.map((channel) => (

              <ServerChannel
                server={server}
                channel={channel}
                key={channel.id}

                role={role}

              />
            ))}
          </div>

        )}
        {/* audio is here */}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Audio Channels"
            />


            {audioChannels?.map((channel) => (

              <ServerChannel
                server={server}
                channel={channel}
                key={channel.id}

                role={role}

              />
            ))}
          </div>

        )}
        {/* video is here    */}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />


            {videoChannels?.map((channel) => (

              <ServerChannel
                server={server}
                channel={channel}
                key={channel.id}

                role={role}

              />
            ))}
          </div>

        )}

        {/* memvbers is here    */}
        {!!members?.length && (
          <div className="mb-2">
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />


            {members?.map((member) => (

              <ServerMember
                server={server}
                member={member}
                key={member.id}

              />
            ))}
          </div>

        )}
      </ScrollArea>
    </div>


  );
};