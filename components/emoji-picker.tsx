import React from 'react'
import { Popover , PopoverContent, PopoverTrigger } from './ui/popover';
import { Smile } from 'lucide-react';
import Picker  from '@emoji-mart/react';
import data from '@emoji-mart/data'

import { useTheme } from 'next-themes';

interface EmojiPickerProps {
    onChange: (value: string) => void;
}


export const EmojiPicker = ({
    onChange
}: EmojiPickerProps) => {
  const { theme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Smile 
          className='text-zinc-500 dark:text-zinc-400 hover:text-zinc-400 dark:hover:text-zinc-300
          transition'
        />
        
      </PopoverTrigger>
      <PopoverContent
        side='right'
        sideOffset={40}
        
        className='bg-transparent border-none shadow-none transition drop-shadow-none mb-20'
      >
        <Picker 
          theme={theme}
          
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />

      </PopoverContent>
    </Popover>
  )
}
