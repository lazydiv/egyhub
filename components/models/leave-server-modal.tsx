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
import { useRouter } from "next/navigation"
export const LeaveServerModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModel();
  const router = useRouter()

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`)
      onClose();
      router.push('/')
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
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            Are you sure you want to leave this server
            <span className="font-semibold mx-2 text-red-500 dark:text-yellow-500">
              {server?.name} ?
            </span>
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