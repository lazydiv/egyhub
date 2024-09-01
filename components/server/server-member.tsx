'use client'

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconeMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-red-500 dark:text-yellow-200" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />
}

const ServerMember = ({
  member,
  server
}: ServerMemberProps) => {
  const params = useParams()
  const router = useRouter()
  const icon = roleIconeMap[member.role]



  return (
    <button className={cn('group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
      params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-800')}
      onClick={() => router.push(`/servers/${server.id}/conversations/${member.id}`)}>
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn('text-sm font-semibold group-hover:text-zinc-600 text-zinc-500 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.memberId === member.id && 'text-primary dark:group-hover:text-white'
         )}
      >
        {member.profile.name}
      </p>
      {icon}

    </button>
  )
}

export default ServerMember