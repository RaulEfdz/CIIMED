import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
  } from "@/components/ui/tooltip";
  
  export const PoweredBy: React.FC = () => {
    return (
      <div className="mt-6 text-xs text-gray-400 ">
        Power by 
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a 
                href="https://robotipa.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className=" font-semibold ml-1  cursor-pointer hover:text-gray-800"
              >
                <label className="mx-1 font-bold"> Robotipa</label>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              Conocenos
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };