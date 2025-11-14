import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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
          <ProtectedRoute>
            <MainLayout>
              <SubscriptionPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup-your-brand"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Step1 />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/new-brand"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NewBrand />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/brand-details"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BrandDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/color-palette"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ColorPalette />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/logo-generation"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LogoGeneration />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/existing-brand"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExistingBrand />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/existing-brand-details"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExistingBrandDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/existing-brand-color-palette"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExistingBrandColorPalette />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/upload-logo"
        element={
          <ProtectedRoute>
            <MainLayout>
              <UploadLogo />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/brand-book"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BrandBook />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/brand-analysis"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BrandAnalysis />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/edit-logo"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditLogo />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/business-content-setup"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BusinessContentSetup />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/media-gallery-setup"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MediaGallerySetup />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/complete"
        element={
          <ProtectedRoute>
            <OnboardingComplete />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
