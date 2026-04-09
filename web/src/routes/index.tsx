import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import AppLayout from '@/layout/app-layout';
import AuthPage from '@/pages/auth';
import SignOutPage from '@/pages/auth/sign-out';
import SettingsPage from '@/pages/settings';

import RootLayout from './root-layout';
import RouteGuard from './route-guard';
import { protectedRoutesPaths, publicRoutesPaths } from './routes';

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      {/* Protected Routes */}
      <Route element={<RouteGuard requireAuth={true} />}>
        <Route element={<AppLayout />}>
          {protectedRoutesPaths?.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
          <Route path="account/settings" element={<SettingsPage />} />
          <Route path="account/security" element={<SettingsPage />} />
        </Route>
        <Route path="auth/sign-out" element={<SignOutPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<RouteGuard requireAuth={false} />}>
        <Route path="auth/sign-in" element={<AuthPage />} />
        <Route path="auth/sign-up" element={<AuthPage />} />
        <Route path="auth/forgot-password" element={<AuthPage />} />
        <Route path="auth/reset-password" element={<AuthPage />} />
        <Route path="auth/callback" element={<AuthPage />} />
      </Route>

      {/* Public Routes */}
      <Route>
        {publicRoutesPaths?.map(({ path, element: Element }) => (
          <Route key={path} path={path} element={<Element />} />
        ))}
      </Route>

      <Route path="*" element={<>Not Found</>} />
    </Route>,
  ),
);
