import { ReactNode } from "react";

const PrimaryButton = ({children, onClick, size="small"}: {
  children: ReactNode,
  onClick: () => void,
  size?: "big" | "small"
}) => {
  return ( 
  <div onClick={onClick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 py-2" : "px-14 py-3"} bg-purple-700 cursor-pointer text-white rounded-full hover:shadow-md text-center`}>
    {children}
  </div> 
  );
}
 
export default PrimaryButton;