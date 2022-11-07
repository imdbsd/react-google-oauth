import {
  OverridableTokenClientConfig,
  IdConfiguration,
  MomenListener,
  GsiButtonConfiguration,
  TokenClientConfig,
  CodeClientConfig,
  TokenResponse,
} from './gsi.types'

export interface GoogleOauth2TokenClient {
  requestAccessToken: (
    overridableClientConfig?: OverridableTokenClientConfig
  ) => void
}

export interface GoogleOauth2CodeClient {
  requestCode: () => void
}

export interface GoogleAccountsId {
  initialize: (input: IdConfiguration) => void
  prompt: (momentListener?: MomenListener) => void
  renderButton: (
    parent: HTMLElement,
    options: GsiButtonConfiguration,
    clickHandler?: () => void
  ) => void
  disableAutoSelect: () => void
  storeCredential: (
    credential: {id: string; password: string},
    callback?: () => void
  ) => void
  cancel: () => void
  onGoogleLibraryLoad: Function
  revoke: (accessToken: string, done: () => void) => void
}

export interface GoogleAccountsOauth2 {
  initTokenClient: (config: TokenClientConfig) => GoogleOauth2TokenClient
  initCodeClient: (config: CodeClientConfig) => GoogleOauth2CodeClient
  hasGrantedAnyScope: (
    tokenRsponse: TokenResponse,
    firstScope: string,
    ...restScopes: string[]
  ) => boolean
  hasGrantedAllScopes: (
    tokenRsponse: TokenResponse,
    firstScope: string,
    ...restScopes: string[]
  ) => boolean
  revoke: (accessToken: string, done?: () => void) => void
}
