import React from "react";
import { BotIcon } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

export const WebAgentLink: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 text-white">
      <BotIcon size={18} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://robotipa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium hover:underline"
            >
              Agente Web
            </a>
          </TooltipTrigger>
          <TooltipContent>
            Conocer más de Robotipa Agente Web v1.0
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};