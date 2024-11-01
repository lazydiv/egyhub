import { Channel, ChannelType, Server } from "@prisma/client";
import {create} from "zustand"



export type ModelType = "CreateServer" | "invite" | "editServer" | "members" 
| "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel" | 'messageFile' | 'deleteMessage';






interface ModalData {
    server?: Server;
    channelType?: ChannelType;
    channel?: Channel;
    apiUrl?: string;
    query?: Record<string, any>;
    
}

interface ModelStore {
    type: ModelType | null;
    data: ModalData
    isOpen: boolean;
    onOpen: (type: ModelType, data?: ModalData) => void;
    onClose: () => void;
}


export const useModel = create<ModelStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({type, isOpen: true, data}),
    onClose: () => set({type: null, isOpen: false})
}))