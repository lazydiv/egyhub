'use client';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import qs from 'query-string';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FileUpload } from '../file-uplaod';
import { Button } from '../ui/button';

import { Input } from '@/components/ui/input';
import { useModel } from '@/hooks/use-model-store'; 
import { ChannelType } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'channel name is required'
    }).refine(
        name => name !== "general",
        {
            message: "channel name can't be 'general'"
        }
    ),

    type: z.nativeEnum(ChannelType)
})



export const EditChannelModel = () => {
    const { isOpen, type, onClose, data } = useModel();
    const router = useRouter();
    const params = useParams()
    const isModelOpen = isOpen && type === 'editChannel';
    const { channel, server } = data;

    const form = useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                name: '',
                type: channel?.type || ChannelType.TEXT,
            }
        }
    );

    useEffect(() => {
        if (channel) {
            form.setValue('name', channel.name)
            form.setValue('type', channel.type)
        }
    }, [form, channel])


    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: params?.serverId
                }
            })
            await axios.patch(url, values);
            form.reset();
            router.refresh()
            onClose();
        } catch (error) {


            console.log(error);
        }
    }
    const onCloseModel = () => {
        form.reset()
        onClose()
    }


    return (
        <Dialog open={isModelOpen} onOpenChange={onCloseModel}>
            <DialogContent className=''>
                <DialogHeader>
                    <DialogTitle className='text-red-500 dark:text-yellow-50 text-center text-xl'>Edit Channel !</DialogTitle>
                </DialogHeader>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 '>

                            <FormField
                                control={form.control}
                                name='name'


                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className='uppercase text-xm font-bold  dark:text-yellow-50'

                                        >
                                            Channel name
                                        </FormLabel>
                                        <FormControl >
                                            <Input
                                                disabled={isLoading}
                                                placeholder='Enter channel name'
                                                className='bg-foreground/5 w-full dark:text-yellow-50'
                                                {...field}
                                            />
                                            

                                        </FormControl>
                                        <FormMessage className='text-red-600 absolute text-xs' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='type'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Type</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className='focus:ring-0 bg-foreground/5  dark:text-yellow-50 ring-offset-0
                                                        focus:ring-offset-0 capitalize
                                                        outline-none'

                                                >
                                                    <SelectValue placeholder="Select a Channel Type" />
                                                    




                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem key={type} value={type} className='capitalize'>
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}

                            />
                        </div>
                        <DialogFooter className='py-4'>
                            <Button variant={'primary'} className='w-full' disabled={isLoading}>Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
