import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrandingProvider } from '@/contexts/BrandingContext';
import { MediaGalleryProvider } from '@/contexts/MediaGalleryContext';
import { OnboardingProgressProvider } from '@/contexts/OnboardingProgressContext';
import { LogoProvider } from '@/contexts/LogoContext';
import AppRoutes from '@/routes';

function App() {
  return (
    <AuthProvider>
      <BrandingProvider>
        <LogoProvider>
          <OnboardingProgressProvider>
            <MediaGalleryProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </MediaGalleryProvider>
          </OnboardingProgressProvider>
        </LogoProvider>
      </BrandingProvider>
    </AuthProvider>
  );
}

export default App;
