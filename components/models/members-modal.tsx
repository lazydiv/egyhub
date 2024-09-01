"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModel } from "@/hooks/use-model-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { UserAvatar } from "../user-avatar";
import { Check, Gavel, Loader, MoreVertical, MoreVerticalIcon, Shield, ShieldAlertIcon, ShieldCheck, ShieldCheckIcon, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import { url } from "inspector";
import axios from "axios";
import { useRouter } from "next/navigation";


const roleIconMap = {
  "GUEST": "",
  "MODERATOR": <ShieldCheckIcon className="h-4 w-4 ml-2 text-red-500 dark:text-yellow-500" />,
  "ADMIN": <ShieldAlertIcon className="h-4 w-4 ml-2 text-red-500 dark:text-yellow-500" />

}

export const MembersModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModel();
  const router = useRouter()
  const [loadingId, setLoadingId] = useState("")
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      })
      const res = await axios.patch(url, {role})
      router.refresh()
      onOpen("members", {server: res.data})
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }



  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      })

      const res = await axios.delete(url)
      router.refresh()
      onOpen('members', {server: res.data})
      
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }



  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} >
      <DialogContent className="dark:text-white   text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className=" text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div className="flex items-center gap-x-2 mb-6 " key={member.id}>
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className=" text-xs font-semibold flex  items-center">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="opacity-50 text-sm">
                  {member.profile.email}
                </p>

              </div>
              {server?.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <MoreVertical className="h-4 w-4 opacity-75 hover:opacity-100" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger
                            className="flex  items-center"
                          >
                            <ShieldQuestion
                              className="w-4 h-4 mr-2"
                            />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="ml-2">
                              <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                <Shield
                                  className="w-4 h-4 mr-2"
                                />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check
                                    className="w-4 h-4 ml-auto"
                                  />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                <ShieldCheck
                                  className="w-4 h-4 mr-2"
                                />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check
                                    className="w-4 h-4 ml-auto"
                                  />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader
                  className="h-4 w-4 mr-2 animate-spin  ml-auto opacity-70"
                />
              )}
            </div>
          ))}
        </ScrollArea>

      </DialogContent>
    </Dialog>
  )
}