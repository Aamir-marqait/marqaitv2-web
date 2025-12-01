import { Spinner } from "@/components/ui/Spinner";

interface SubmitButtonProps {
  text: string;
  isLoading?: boolean;
}

export function SubmitButton({ text, isLoading = false }: SubmitButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Button clicked");
    if (isLoading) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <button
      type="submit"
      disabled={isLoading}
      onClick={handleClick}
      className="cursor-pointer hover:border-4 w-full py-3 md:py-4 mt-2 rounded-lg md:rounded-xl text-sm md:text-[16px] font-semibold leading-[100%] tracking-normal font-inter uppercase text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      style={{
        background:
          "radial-gradient(43.57% 80% at 49.09% 100%, #DAABFF 0%, #8F00FF 100%)",
        border: "1px solid transparent",
        backgroundClip: "padding-box",
      }}
    >
      {isLoading && <Spinner className="w-5 h-5" />}
      {text}
    </button>
  );
}
