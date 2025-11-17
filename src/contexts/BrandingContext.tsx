/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, type ReactNode } from 'react';

// New Brand Flow Data Types
export interface NewBrandData {
  businessName: string;
  industry: string;
}

export interface BrandDetailsData {
  targetAudience: string;
  brandPersonality: string;
  coreValues: string;
  styleReferences: string;
}

export interface ColorPaletteData {
  selectedColors: string[];
}

export interface LogoData {
  generatedLogo?: string;
  editedLogo?: string;
  generatedLogoUrls?: string[]; // Six logo variations from API
}

export interface BusinessContentData {
  businessDescription: string;
  offerings: string;
  customers: string;
  businessGoal: string;
  marketingBudget: string;
}

// Combined Branding Data
export interface BrandingData {
  // Flow type
  flowType: 'new' | 'existing' | null;

  // Business ID from API
  businessId: string | null;

  // New Brand Flow
  newBrand: NewBrandData;
  brandDetails: BrandDetailsData;
  colorPalette: ColorPaletteData;
  logo: LogoData;

  // Business Content (both flows)
  businessContent: BusinessContentData;

  // Existing Brand Flow
  existingBrandLogo?: File;
}

export interface BrandingContextType {
  brandingData: BrandingData;
  setFlowType: (flowType: 'new' | 'existing') => void;
  setBusinessId: (businessId: string) => void;
  setNewBrandData: (data: NewBrandData) => void;
  setBrandDetailsData: (data: BrandDetailsData) => void;
  setColorPaletteData: (data: ColorPaletteData) => void;
  setLogoData: (data: LogoData) => void;
  setBusinessContentData: (data: BusinessContentData) => void;
  setExistingBrandLogo: (logo: File) => void;
  resetBrandingData: () => void;
}

export const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

interface BrandingProviderProps {
  children: ReactNode;
}

const initialBrandingData: BrandingData = {
  flowType: null,
  businessId: null,
  newBrand: {
    businessName: '',
    industry: '',
  },
  brandDetails: {
    targetAudience: '',
    brandPersonality: '',
    coreValues: '',
    styleReferences: '',
  },
  colorPalette: {
    selectedColors: [],
  },
  logo: {},
  businessContent: {
    businessDescription: '',
    offerings: '',
    customers: '',
    businessGoal: '',
    marketingBudget: '',
  },
};

export function BrandingProvider({ children }: BrandingProviderProps) {
  const [brandingData, setBrandingData] = useState<BrandingData>(initialBrandingData);

  const setFlowType = useCallback((flowType: 'new' | 'existing') => {
    setBrandingData(prev => ({ ...prev, flowType }));
  }, []);

  const setBusinessId = useCallback((businessId: string) => {
    setBrandingData(prev => ({ ...prev, businessId }));
  }, []);

  const setNewBrandData = useCallback((data: NewBrandData) => {
    setBrandingData(prev => ({ ...prev, newBrand: data }));
  }, []);

  const setBrandDetailsData = useCallback((data: BrandDetailsData) => {
    setBrandingData(prev => ({ ...prev, brandDetails: data }));
  }, []);

  const setColorPaletteData = useCallback((data: ColorPaletteData) => {
    setBrandingData(prev => ({ ...prev, colorPalette: data }));
  }, []);

  const setLogoData = useCallback((data: LogoData) => {
    setBrandingData(prev => ({ ...prev, logo: data }));
  }, []);

  const setBusinessContentData = useCallback((data: BusinessContentData) => {
    setBrandingData(prev => ({ ...prev, businessContent: data }));
  }, []);

  const setExistingBrandLogo = useCallback((logo: File) => {
    setBrandingData(prev => ({ ...prev, existingBrandLogo: logo }));
  }, []);

  const resetBrandingData = useCallback(() => {
    setBrandingData(initialBrandingData);
  }, []);

  const value: BrandingContextType = {
    brandingData,
    setFlowType,
    setBusinessId,
    setNewBrandData,
    setBrandDetailsData,
    setColorPaletteData,
    setLogoData,
    setBusinessContentData,
    setExistingBrandLogo,
    resetBrandingData,
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
}
