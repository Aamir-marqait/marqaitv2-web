import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { OnboardingProtectedRoute } from '@/components/auth/OnboardingProtectedRoute';
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { VerifyOtp } from '@/pages/auth/VerifyOtp';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';
import { Terms } from '@/pages/auth/Terms';
import { Privacy } from '@/pages/auth/Privacy';
import SubscriptionPage from '@/pages/onboarding/choose-plan';
import Step1 from '@/pages/onboarding/step1';
import NewBrand from '@/pages/onboarding/new-brand';
import BrandDetails from '@/pages/onboarding/brand-details';
import ColorPalette from '@/pages/onboarding/color-palette';
import LogoGeneration from '@/pages/onboarding/logo-generation';
import ExistingBrand from '@/pages/onboarding/existing-brand';
import ExistingBrandDetails from '@/pages/onboarding/existing-brand-details';
import ExistingBrandColorPalette from '@/pages/onboarding/existing-brand-color-palette';
import UploadLogo from '@/pages/onboarding/upload-logo';
import BrandBook from '@/pages/onboarding/brand-book';
import BrandAnalysis from '@/pages/onboarding/brand-analysis';
import EditLogo from '@/pages/onboarding/edit-logo';
import BusinessContentSetup from '@/pages/onboarding/business-content-setup';
import MediaGallerySetup from '@/pages/onboarding/media-gallery-setup';
import OnboardingComplete from '@/pages/onboarding/onboarding-complete';
import WelcomeChat from '@/pages/welcome/welcome-chat';
import StrategyCreationChat from '@/pages/welcome/strategy-creation-chat';
import StrategyDetail from '@/pages/welcome/strategy-detail';
import ContentCalendar from '@/pages/content-calendar';
import GeneratingContent from '@/pages/generating-content';
import MainLayout from '@/components/layouts/MainLayout';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/account/login" element={<Login />} />
      <Route path="/account/emailsignup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/account/forgot-password" element={<ForgotPassword />} />
      <Route path="/account/reset-password" element={<ResetPassword />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Protected routes */}
      <Route
        path="/choose-plan"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <SubscriptionPage />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/setup-your-brand"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <Step1 />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/new-brand"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <NewBrand />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/brand-details"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <BrandDetails />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/color-palette"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <ColorPalette />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/logo-generation"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <LogoGeneration />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/existing-brand"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <ExistingBrand />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/existing-brand-details"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <ExistingBrandDetails />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/existing-brand-color-palette"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <ExistingBrandColorPalette />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/upload-logo"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <UploadLogo />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/brand-book"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <BrandBook />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/brand-analysis"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <BrandAnalysis />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/edit-logo"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <EditLogo />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/business-content-setup"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <BusinessContentSetup />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/media-gallery-setup"
        element={
          <OnboardingProtectedRoute>
            <MainLayout>
              <MediaGallerySetup />
            </MainLayout>
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/onboarding/complete"
        element={
          <OnboardingProtectedRoute>
            <OnboardingComplete />
          </OnboardingProtectedRoute>
        }
      />
      <Route
        path="/welcome/chat"
        element={
          <ProtectedRoute>
            <MainLayout>
              <WelcomeChat />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/strategy-creation-chat"
        element={
          <ProtectedRoute>
            <MainLayout>
              <StrategyCreationChat />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/strategy-creation-chat/:slug"
        element={
          <ProtectedRoute>
            <MainLayout>
              <StrategyDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/content-calendar"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ContentCalendar />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/generating-content"
        element={
          <ProtectedRoute>
            <MainLayout>
              <GeneratingContent />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
