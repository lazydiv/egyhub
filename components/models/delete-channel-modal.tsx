"use client";

import axios from "axios";
import { Check, Copy, Ghost, RefreshCw } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useModel } from "@/hooks/use-model-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useParams, useRouter } from "next/navigation"
import qs from "query-string";
export const DeleteChannelModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModel();
  const router = useRouter()

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  const [isLoading, setIsLoading] = useState(false);


  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        }
      })
      await axios.delete(url)
      onClose();
      router.push(`/servers/${server?.id}`)
      router.refresh();


    } catch (error) {
      console.log(error);

    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="dark:text-white  text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            Are you sure you want to Delete this channel
            <span className="font-semibold mx-2 text-red-500 dark:text-yellow-500">
              #{channel?.name} ?
            </span>
            This Action is permanent and can not be reversed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-foreground/5 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={() => onClose()}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onClick}
              variant="destructive"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}