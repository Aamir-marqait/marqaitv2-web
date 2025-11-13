import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface LogoContextType {
  selectedLogoUrl: string;
  setSelectedLogoUrl: (url: string) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export function LogoProvider({ children }: { children: ReactNode }) {
  const [selectedLogoUrl, setSelectedLogoUrl] = useState<string>("");

  return (
    <LogoContext.Provider value={{ selectedLogoUrl, setSelectedLogoUrl }}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error("useLogo must be used within a LogoProvider");
  }
  return context;
}
