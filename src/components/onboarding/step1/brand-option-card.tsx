interface BrandOptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  outline: boolean;
}

export default function BrandOptionCard({
  selected,
  onClick,
  icon,
  title,
  description,
  outline,
}: BrandOptionCardProps) {
  return (
    <div
      className={`flex flex-col items-center p-8 bg-linear-to-br from-[#F5E9FF] to-white rounded-2xl shadow-sm transition-all duration-300 cursor-pointer h-full ${
        outline
          ? "border-[3px] border-dashed border-purple-400"
          : "border border-[#E4E4E4]"
      } ${selected ? "shadow-lg" : ""}`}
      onClick={onClick}
      style={{
        backgroundImage:
          "linear-gradient(113.8deg, #F5E9FF 2.02%, #FFFFFF 98.94%)",
      }}
    >
      <div className="mb-4 w-[90px] h-[90px] rounded-[20px] bg-white flex items-center justify-center">{icon}</div>
      <h3 className="font-inter text-[28px] font-normal leading-[100%] tracking-normal text-center text-[#11001E] mb-3">
        {title}
      </h3>
      <p className="font-inter text-base font-normal leading-[100%] tracking-normal text-center text-[#6B7280] mb-6">
        {description}
      </p>
      <div className="mt-auto flex items-center justify-center">
        <span
          className={`inline-flex w-7 h-7 rounded-full border-2 ${
            selected ? "border-[#DFB6FF]" : "border-gray-300"
          } items-center justify-center`}
        >
          {selected && (
            <span className="w-3.5 h-3.5 bg-[#8F00FF] rounded-full" />
          )}
        </span>
      </div>
    </div>
  );
}
