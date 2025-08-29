
const api = import.meta.env['API_URL'];

export const Endpoint = {

  /* Account endpoints */
  ACCOUNT_SETUP: `${api}account/setup`,
  ACCOUNT_PROFILE: `${api}account/profile`,
  CHANGE_PASSWORD: `${api}account/change-password`,
  CHANGE_EMAIL: `${api}account/change-email`,

  /* Authorization endpoints */
  VERIFY_FORGOT_PASSWORD: `${api}auth/forgot-password/verify/`,
  FORGOT_PASSWORD: `${api}auth/forgot-password`,
  REFRESH_TOKEN: `${api}auth/refresh-token`,
  SIGN_IN: `${api}auth/login`,
  RESEND_VERIF: `${api}auth/signup/resend-verification`,
  RESEND_VERIF_CHANGE_EMAIL: `${api}auth/signup/resend-verification`,
  SIGN_UP: `${api}auth/signup`,
}
