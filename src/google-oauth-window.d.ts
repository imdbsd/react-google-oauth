import {
  GoogleAccountsId,
  GoogleAccountsOauth2,
} from './types/googleAccounts.type'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId
        oauth2: GoogleAccountsOauth2
      }
    }
  }
}
