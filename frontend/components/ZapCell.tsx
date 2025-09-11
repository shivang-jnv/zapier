export const ZapCell = ({
  name,
  index,
  onClick,
}: {
  name?: string;
  index: number;
  onClick: () => void;
}) => {
  return (
    <div onClick={onClick} className="border border-black py-4 px-8 flex flex-col max-w-md justify-center cursor-pointer w-[300px]">
      <div className="flex justify-center">
        <div className="font-bold px-1">
          {index}.
        </div>
        <div className="font-bold">
          {name}
        </div>
      </div>
    </div>
  )
}