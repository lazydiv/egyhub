"use client"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip";

interface ActionTooltipProps {
    children: React.ReactNode;
    label: string;
    side?: 'left' | 'top' | 'right' | 'bottom';
    align?: 'start' | 'center' | 'end';

}

export const ActionTooltip = ({ children, label, side, align }: ActionTooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>

                <TooltipTrigger
                    asChild
                >
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm capitalize">

                        {label.toLowerCase()}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}