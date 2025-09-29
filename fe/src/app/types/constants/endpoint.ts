import { environment } from '../../../environments/environment';

const api = `${environment.apiUrl}/`;

export const Endpoint = {
  /* Auth endpoints */
  LOGIN: `${api}auth/login`,
  LOGOUT: `${api}auth/logout`,
  REFRESH: `${api}auth/refresh`,

  USERS: `${api}users`,
  ROLES: `${api}roles`,
  ROLES_ID: (id: string)=> {
    return `${api}roles/${id}`
  },

  /* Admin endpoints */
  INVITE_USER: `${api}users/invite-user`,
  RESEND_VERIFICATION: `${api}users/resend-verification`,
  VERIFY_USER: `${api}users/verify-user`,
  PERMISSIONS: `${api}users/permission-list`,


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
