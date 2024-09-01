import { Hash, Menu } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";


interface ChatHeaderProps {
  name?: string;
  serverId: string;
  type?: 'channel' | 'conversation';
  imageUrl?: string;

}



export const ChatHeader = (
  { name, serverId, type, imageUrl }: ChatHeaderProps
) => {
  return (
    <div className="flex items-center text-md font-semibold 
    justify-between px-3 h-12 border-neutral-200
     dark:border-neutral-800 border-b-2
    ">
      <div className="flex items-center">
        <MobileToggle serverId={serverId}/>
        {type === 'channel' && (
          <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        )}
        <h1 className="ml-2 text-md font-semibold">{name}</h1>
      </div>
       
      
    </div>
  );
};
