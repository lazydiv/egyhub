"use client"

import { CreateServerModel } from "../models/create-server-model"
import { useEffect, useState } from "react"
import { InviteModal } from "@/components/models/invite-modal"
import { EditServerModal } from "../models/edit-server-modal"
import { MembersModal } from "../models/members-modal"
import { CreateChannelModel } from "../models/create-channel-modal"
import { LeaveServerModal } from "../models/leave-server-modal"
import { DeleteServerModal } from "../models/delete-server-modal"
import { DeleteChannelModal } from "../models/delete-channel-modal"
import { EditChannelModel } from "../models/edit-channel-modal"



export const ModelProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null
    
    return (
        <>
            <CreateServerModel />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <LeaveServerModal />
            <CreateChannelModel />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModel />
        </>
    )
}