"use client"

import { Plus } from "lucide-react"
import { ActionTooltip } from "../action-tooltip"
import { useModel } from "@/hooks/use-model-store"

export const NavigationAction = () => {
    const {onOpen} = useModel()



    return (
        <div className="">
            <ActionTooltip
                label="Add a server"
                side="right"
                align="center"
            >

                <button
                    className="group flex items-center"
                    onClick={() => onOpen("CreateServer")}
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden
                items-center justify-center bg-gray-100 dark:bg-neutral-700
                group-hover:bg-yellow-300 group-hover:dark:bg-yellow-00">

                        <Plus
                            className="group-hover:text-yellow-100 group-hover:dark:text-red-500 transition text-red-500 dark:text-yellow-100"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}