"use client"
import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css"
import { Button } from './ui/button';

interface Props {
    onChange: (url?: string) => void;
    value: string;
    endpoint: 'messageFile' | 'serverImage'
}
export const FileUpload = (
    { onChange,
        value,
        endpoint }: Props
) => {

    const fileType = value?.split('.').pop();

    if (value && fileType !== 'pdf') {
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt='server image'
                    className='rounded-full'
                />
                <button
                    className='bg-red-700 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm '
                    type='button'
                    onClick={() => onChange('')}
                // title='remove Image'
                >
                    <X className='h-4 w-4' />

                </button>
            </div>
        )
    }

    if (value && fileType === 'pdf') {
        return (
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-slate-400/30 dark:bg-white/10'>
                <FileIcon className='h-10 w-10 dark:fill-yellow-500 dark:stroke-yellow-200  fill-red-500 stroke-red-300 ' />
                <a href={value}
                    target='_blank'
                    rel='noreferrer noopener'
                    className='ml-2 text-sm dark:text-yellow-50 text-red-500 underline'>
                    {value}
                </a>
                <button
                    className='bg-rose-600 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm '
                    type='button'
                    onClick={() => onChange('')}
                // title='remove Image'
                > 
                    <X className='h-4 w-4' />

                </button>


            </div >
        )
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                //eslint-disable-next-line 
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error) => {
                console.error(error)
            }}
        />
    )
}
