"use client"

import { ServerWithMembersWithProfiles } from "@/types"
import { MemberRole, Server } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { ChevronDown, Delete, LogOut, PlusCircle, Settings, UserPlus, Users } from "lucide-react";
import { TrashIcon } from "@radix-ui/react-icons";
import { useModel } from "@/hooks/use-model-store";


interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?: MemberRole;

}


export const ServerHeader = ({
    server,
    role
}: ServerHeaderProps) => {

    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR
    const { onOpen } = useModel()


    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="focus:outline-none"
                    asChild
                >
                    <button
                        className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200
                        dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
                        dark:hover:bg-zinc-700/50 transition"
                    >
                        {server.name}
                        <ChevronDown className="h-5 w-5 ml-auto" />
                    </button>

                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-56 text-xs font-medium text-neutral-700
                    dark:text-neutral-400 space-y-[2px]"

                >
                    {isModerator && (
                        <DropdownMenuItem
                            onClick={() => onOpen('invite', { server })}
                            className="text-red-500 dark:text-yellow-100
                            px-2 py-2 text-sm cursor-pointer"

                        >
                            Invite People
                            <UserPlus className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}

                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => onOpen('editServer', { server })}
                            className="
                            px-2 py-2 text-sm c, ursor-pointer"

                        >
                            Server Settings
                            <Settings className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => onOpen('members', { server })}
                            className="
                            px-2 py-2 text-sm cursor-pointer"

                        >
                            Manage Members
                            <Users className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isModerator && (
                        <DropdownMenuItem
                            onClick={() => onOpen('createChannel')}
                            className="
                            px-2 py-2 text-sm cursor-pointer"

                        >
                            Create Channel
                            <PlusCircle className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isModerator && (
                        <DropdownMenuSeparator />
                    )}
                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => onOpen("deleteServer", { server })}
                            className="
                            px-2 py-2 text-sm cursor-pointer text-rose-500"

                        >
                            Delete Server
                            <TrashIcon className="h-4 w-4 ml-auto" />

                        </DropdownMenuItem>
                    )}
                    {!isAdmin && (
                        <DropdownMenuItem
                            onClick={() => onOpen("leaveServer", { server })}
                            className="
                            px-2 py-2 text-sm cursor-pointer text-rose-500"

                        >
                            Leave Server
                            <LogOut className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}

                </DropdownMenuContent>

            </DropdownMenu>
        </div>
    )
}
