'use client'
import { ReactNode } from "react";

export const LinkButton = ({children, onClick}: {children: ReactNode, onClick: () => void }) => {
  return ( 
    <div className="px-2 py-1 cursor-pointer hover:bg-[#ebe9df] font-light text-sm rounded" onClick={onClick}>
      {children}
    </div>
   );
}
