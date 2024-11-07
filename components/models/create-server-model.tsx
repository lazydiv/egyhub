'use client';

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogDescription
} from '@/components/ui/dialog';

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
import { FileUpload } from '../file-uplaod';

import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useModel } from '@/hooks/use-model-store';

const urlRegex = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i' // fragment locator
);

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'server name is required'
    }),
    imageUrl: z.string().min(1, {
        message: 'server image is required'
    }).refine((url) => urlRegex.test(url), {
        message: 'Invalid URL format'
    })
});

export const CreateServerModel = () => {
    const { isOpen, type, onClose } = useModel();
    const router = useRouter();
    const isModelOpen = isOpen && type === 'CreateServer';

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/servers', values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const onCloseModel = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModelOpen} onOpenChange={onCloseModel}>
            <DialogContent className=''>
                <DialogHeader>
                    <DialogTitle className='text-red-500 dark:text-yellow-50 text-center text-xl'>Create New Server !</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 '>
                            <div className=' flex items-center justify-center text-center'>
                                <FormField
                                    control={form.control}
                                    name='imageUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
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
                                        <FormLabel className='uppercase text-xm font-bold text-yellow-50'>
                                            server name
                                        </FormLabel>
                                        <FormControl>
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
                        <Button variant={'primary'} className='w-full' disabled={isLoading}>Create</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
