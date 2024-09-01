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

const formSchema = z.object({

    name: z.string().min(1, {
        message: 'server name is required'
    }),
    imageUrl: z.string().min(1, {
        message: 'server image is required'
    }),
})



export const InitalModel = () => {
    const [isMonted, setIsMonted] = useState(false)
    const router = useRouter();
    

    useEffect(() => {
        setIsMonted(true)
    }, [])


    const form = useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                name: '',
                imageUrl: '',
            }
        }
    );


    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/servers', values);
            form.reset();
            router.refresh()
            window.location.reload();
        } catch (error) {

            console.log(error);
        }
    }
    if (!isMonted) return null;

    return (
        <Dialog open>
            <DialogContent className=''>
                <DialogHeader>
                    <DialogTitle className='text-yellow-50 text-left text-xl'>Welcome to EgyHub!</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    To get started, you'll need to customzie your server.
                </DialogDescription>
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
                                            className='uppercase text-xm font-bold  text-yellow-50'

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


                        <Button variant={'primary'} className='w-full' disabled={isLoading}>Create</Button>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
