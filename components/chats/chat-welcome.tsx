import { Hash } from "lucide-react";

interface ChatWelcomeProps {
    type: 'channel' | 'conversation';
    name: string;
}


export const ChatWelcome = ({
    type,
    name
}: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4 ">
        {type === 'channel' && (
            <div className="h-[75px] w-[75px] rounded-full flex items-center justify-center bg-zinc-500 dark:bg-zinc-700">
            
                <Hash className="w-12 h-12 text-white " />
            </div>
        )}
        <p className="text-xl md:text-3xl font-bold">
            Welcome to {type === 'channel' ? `#${name}` : name}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm ">
             {type === 'channel' ? `This is the beginning of the #${name}` : `This is the start of your conversaion ${name}`} with {name}.
        </p>
   
    </div>
  )
}
