'use client'

import { Member, Message, Profile } from "@prisma/client";
import * as z from 'zod';

import { Delete, Edit, FileIcon, ShieldAlert, ShieldCheck, Trash, User, X } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useRouter, useParams } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from '@/components/ui/form'
import { Button } from "../ui/button";
import qs from "query-string";
import axios from "axios";
import { useModel } from "@/hooks/use-model-store";

interface ChatMessageProps {
    id: string
    content: string
    member: Member & {
        profile: Profile
    }
    timeStamp: string
    fileUrl: string | null
    deleted: boolean
    currentMember: Member
    isUpdated: boolean
    socketUrl: string
    socketQuery: Record<string, string>

}

const roleIconMap = {
    'GUEST': null,
    'MODERATOR': <ShieldCheck className="w-4 h-4 text-yellow-600" />,
    'ADMIN': <ShieldAlert className="w-4 h-4 text-rose-500" />,
}

const formSchema = z.object({
    content: z.string().min(1)
})

export const ChatMessage = ({
    id,
    content,
    member,
    timeStamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatMessageProps) => {
    const router = useRouter()
    const params = useParams()

    const [isEditing, setIsEditing] = useState(false)
    const {onOpen} = useModel()

    const fileType = fileUrl?.split('.').pop()

    const isAdmin = currentMember.role === 'ADMIN'
    const isModerator = currentMember.role === 'MODERATOR'
    const isOwner = currentMember.id === member.id
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPdf = fileType === 'pdf' && fileUrl;
    const isImage = !isPdf && fileUrl;

    const  onMemberClick = () => {
        if (member.id === currentMember.id) {
            return
        }

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content,
        }
    })

    useEffect(() => {
        form.reset({
            content: content
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });
           
            await axios.patch(url, values);
            form.reset()
            setIsEditing(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && e.keyCode === 27) {
            setIsEditing(false)
        }
        if (e.key === 'Enter' && e.metaKey) {
            form.handleSubmit(onSubmit)()
        }
    }

    useEffect(() => {
        if (isEditing) {
            window.addEventListener('keydown', handleKeyDown)
            return () => {
                window.removeEventListener('keydown', handleKeyDown)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, form])

    return (
        <div className="relative group flex  items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex  gap-x-2 items-start w-full">
                <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member?.profile.imageUrl} />
                </div>
                <div className="flex w-full flex-col">
                    <div className="flex  items-center gap-x-2 ">
                        <div className="flex items-center">
                            <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                                {member?.profile.name}
                            </p>
                            <ActionTooltip label={member?.role} >
                                <p className="ml-2">
                                    {roleIconMap[member?.role]}
                                </p>
                            </ActionTooltip>
                        </div>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400 ">
                            {timeStamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopner noreferrer"
                            className="relative aspect-square rounded-md mt-12 overflow-hidden border flex 
                          items-center bg-secondary h-48 w-48"
                        >
                            <Image
                                src={fileUrl}
                                alt="Image file"
                                fill className="object-cover"
                            />
                        </a>
                    )}
                    {isPdf && (
                        <div className='relative flex items-center p-2 mt-2 rounded-md bg-slate-400/30 dark:bg-white/10'>
                            <FileIcon className='h-10 w-10 dark:fill-yellow-500 dark:stroke-yellow-200  fill-red-500 stroke-red-300 ' />
                            <a href={fileUrl}
                                target='_blank'
                                rel='noreferrer noopener'
                                className='ml-2 text-sm dark:text-yellow-50 text-red-500 underline'
                            >
                                PDF FILE
                            </a>
                        </div >
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            'text-sm text-zinc-600 dark:text-zinc-300',
                            deleted && 'italic text-zinc-500 dark:text-zinc-400 text-sm mt-1'
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2  text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center w-full gap-x-2 pt-2 ">
                                <FormField
                                    control={form.control}
                                    name='content'
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <input
                                                        disabled={isLoading}
                                                        {...field}
                                                        className='p-2 rounded-sm bg-zinc-200/90 dark:bg-zinc-700/75 
                                                            border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                                                            text-zinc-600 dark:text-zinc-200 w-full focus:outline-none '
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button size='sm' variant='primary' disabled={isLoading}>
                                    Save
                                </Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-500 dark:text-zinc-400">
                                Press escape to cancel, enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute
                p-1 top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionTooltip label="edit">
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 
                                hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="delete">
                        <Trash 
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 
                            hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            onClick={() => onOpen('deleteMessage', { 
                                apiUrl: `${socketUrl}/${id}`,
                                query: socketQuery
                             })}
                            />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}