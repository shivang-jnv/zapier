import { ReactNode } from "react";

const PrimaryButton = ({children, onClick, size="small"}: {
  children: ReactNode,
  onClick: () => void,
  size?: "big" | "small"
}) => {
  return ( 
  <div onClick={onClick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 py-2" : "px-14 py-3"} bg-[#FF4F00] cursor-pointer text-white rounded-full hover:shadow-md text-center flex flex-col justify-center`}>
    {children}
  </div> 
  );
}
 
export default PrimaryButton;