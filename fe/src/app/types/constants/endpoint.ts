import { environment } from '../../../environments/environment';

const api = `${environment.apiUrl}/`;

export const Endpoint = {
  /* Auth endpoints */
  LOGIN: `${api}auth/login`,
  LOGOUT: `${api}auth/logout`,
  REFRESH: `${api}auth/refresh`,

  /* Admin endpoints */
  INVITE_USER: `${api}admin/invite-user`,
  RESEND_VERIFICATION: `${api}admin/resend-verification`,
  VERIFY_USER: `${api}admin/verify-user`,
  PERMISSIONS: `${api}admin/permissions`,

  USERS: `${api}users`,

  // /* Account endpoints */
  // ACCOUNT_SETUP: `${api}account/setup`,
  // ACCOUNT_PROFILE: `${api}account/profile`,
  // CHANGE_PASSWORD: `${api}account/change-password`,
  // CHANGE_EMAIL: `${api}account/change-email`,

  // VERIFY_FORGOT_PASSWORD: `${api}auth/forgot-password/verify/`,
  // FORGOT_PASSWORD: `${api}auth/forgot-password`,
  // REFRESH_TOKEN: `${api}auth/refresh-token`,
  // RESEND_VERIF: `${api}auth/signup/resend-verification`,
  // RESEND_VERIF_CHANGE_EMAIL: `${api}auth/signup/resend-verification`,
  // SIGN_UP: `${api}auth/signup`,
}
