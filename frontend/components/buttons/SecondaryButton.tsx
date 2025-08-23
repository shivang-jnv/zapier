import { ReactNode } from "react";

const SecondaryButton = ({children, onClick, size="small"}: {
  children: ReactNode,
  onClick: () => void,
  size?: "big" | "small"
}) => {
  return ( 
  <div onClick={onClick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 py-2" : "px-16 py-3"} cursor-pointer text-black rounded-full hover:shadow-md border`}>
    {children}
  </div> 
  );
}
 
export default SecondaryButton;