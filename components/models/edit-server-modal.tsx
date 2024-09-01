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
import { FileUpload } from '../file-uplaod'

import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useModel } from '@/hooks/use-model-store';
import { Settings } from 'lucide-react';

const formSchema = z.object({

    name: z.string().min(1, {
        message: 'server name is required'
    }),
    imageUrl: z.string().min(1, {
        message: 'server image is required'
    }),
})



export const EditServerModal = () => {

    const { isOpen, type, onClose, data } = useModel();

    const router = useRouter();
    const { server } = data;
    const isModelOpen = isOpen && type === 'editServer';



    const form =  useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                name: '',
                imageUrl: '',
            }
        }
    );

    useEffect(() => {
        if (server) {
            form.setValue('name', server.name);
            form.setValue('imageUrl', server.imageUrl);

        }
    }, [form, server])



    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/servers/${server?.id}`, values);
            router.refresh()
            onClose();
            form.reset();
        } catch (error) {


            console.log(error);
        }
    }

    const onCloseModel = () => {
        onClose()
        
        form.reset();
    }


    return (
        <Dialog open={isModelOpen} onOpenChange={onCloseModel}>
            <DialogContent className=''>
                <DialogHeader>
                    <DialogTitle className='text-red-500 dark:text-yellow-50 text-center text-xl flex mx-auto items-center'>Edit Your Server !</DialogTitle>
                </DialogHeader>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 '>
                            <div className=' flex items-center justify-center text-center'>
                                <FormField
                                    control={form.control}
                                    name='imageUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl >
                                                <FileUpload
                                                    endpoint='serverImage'
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name='name'


                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className='uppercase text-xm font-bold text-black dark:text-yellow-50'

                                        >
                                            server name
                                        </FormLabel>
                                        <FormControl >
                                            <Input
                                                disabled={isLoading}
                                                placeholder='Enter server name'

                                                {...field}
                                            />

                                        </FormControl>
                                        <FormMessage className='text-red-600 absolute text-xs' />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <Button variant={'primary'} className='w-full' disabled={isLoading}>Save</Button>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
