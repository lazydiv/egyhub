import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { ModeToggle } from "../toggle";
import { UserButton } from "@clerk/nextjs";
import { Pointer } from "lucide-react";

export const NavigationSidebar = async () => {
    const profile = await currentProfile();
    if (!profile) {
        return redirect("/");
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-white border-r dark:border-neutral-700 dark:bg-zinc-900 py-3 ">
            <NavigationAction />
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-neutral-700 
                rounded-md w-10 mx-auto"
            />
            <ScrollArea className='flex-1 items-center  w-full'>
                {servers.map((server) => (
                    <NavigationItem
                        imageUrl={server.imageUrl}
                        name={server.name}
                        id={server.id}
                        key={server.id}
                    />
                ))}
            </ScrollArea>
            <div className="pb-3 flex mt-auto items-center flex-col gap-y-4">
                <ModeToggle />
                <div className="z-50">

                    <UserButton
                        afterSignOutUrl="/"
                        
                        appearance={{
                        
                            elements: {
                                userButtonPopoverCard: { pointerEvents: 'initial'},
                               
                                avatrBox: "h-[20px] w-[20px] rounded-[8px] group-hover:"
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
