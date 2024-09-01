"use client"
import { X } from 'lucide-react'
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