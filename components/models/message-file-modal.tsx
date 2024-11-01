'use client';

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogDescription

} from '@/components/ui/dialog'

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormField,
    FormLabel,
    FormItem,
    FormControl,
    FormMessage
} from '@/components/ui/form';
import {FileUpload} from '../file-uplaod'

import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useModel } from '@/hooks/use-model-store';
import qs from 'query-string';

const formSchema = z.object({


    fileUrl: z.string().min(1, {
        message: 'Attachment is required'
    }),
})



export const MessageFileModal = () => {

    const router = useRouter();
    const {isOpen, onClose, type, data} = useModel();
    const isModalOpen = isOpen && type === 'messageFile';

    const form = useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                fileUrl: '',
            }
        }
    );
    const  {apiUrl, query} = data;

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query: query
            });

            await axios.post(url, {
                ...values,
                content: values.fileUrl
            });
            form.reset();
            router.refresh()
            handleClose();
        } catch (error) {

            console.log(error);
        }
    }

    const  handleClose = () => {
        form.reset();
        onClose();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='text-center'>
                <DialogHeader>
                    <DialogTitle className='dark:text-yellow-50 font-bold  text-xl'>Add an attachment</DialogTitle>
                </DialogHeader>
                <DialogDescription className='text-sm'>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    send a file to your friends
                </DialogDescription>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 '>
                        <div className='space-y-8 '>
                            <div className=' flex items-center justify-center text-center'>
                                <FormField
                                    control={form.control}
                                    name='fileUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl >
                                                <FileUpload 
                                                    endpoint='messageFile'
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>


                        <Button variant={'primary'} className='w-full' disabled={isLoading}>uplaod</Button>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
