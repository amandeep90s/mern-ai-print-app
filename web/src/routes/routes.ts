import DesignPage from '@/pages/design';
import HomePage from '@/pages/home';
import ListingsPage from '@/pages/listings';
import SingleListingPage from '@/pages/listings/single-listing';
import ThankYouPage from '@/pages/listings/thank-you';
import OrdersPage from '@/pages/orders';

// These are the routes related to authentication. They will be rendered only if the user is not authenticated.
export const AUTH_ROUTES = {
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',
};

// These are the routes that require authentication to access. They will be rendered only if the user is authenticated.
export const PROTECTED_ROUTES = {
  HOME: '/',
  DESIGN: '/design/:product_id',
  LISTINGS: '/listings',
  ORDERS: '/orders',
};

// These are the routes that can be accessed without authentication. They will be rendered regardless of the user's authentication status.
export const publicRoutesPaths = [
  {
    path: '/listing/:slug',
    element: SingleListingPage,
  },
  {
    path: '/thank-you',
    element: ThankYouPage,
  },
];

// These are the routes that require authentication to access. They will be rendered only if the user is authenticated.
export const protectedRoutesPaths = [
  {
    path: PROTECTED_ROUTES.HOME,
    element: HomePage,
  },
  {
    path: PROTECTED_ROUTES.DESIGN,
    element: DesignPage,
  },
  {
    path: PROTECTED_ROUTES.LISTINGS,
    element: ListingsPage,
  },
  {
    path: PROTECTED_ROUTES.ORDERS,
    element: OrdersPage,
  },
];
