import * as React from 'react'
import {useIsGSIScriptLoaded} from './useIsGSIScriptLoaded'
import {CredentialResponse, TokenResponse} from '../types/gsi.types'

interface Props {
  onSuccess?: (
    codeResponse: CredentialResponse | TokenResponse
  ) => void | Promise<void>
  onError?: (
    codeResponse: CredentialResponse | TokenResponse
  ) => void | Promise<void>
}
type GoogleLoginFn = () => void

export const useGoogleLogin = (props?: Props): GoogleLoginFn => {
  const isScriptLoaded = useIsGSIScriptLoaded()
  const googleClientRef = React.useRef(null)
  const onErrorRef = React.useRef(props?.onError)
  const onSuccessRef = React.useRef(props?.onSuccess)

  const onGoogleLogin = React.useCallback(() => {
    if (googleClientRef.current) {
      googleClientRef.current.requestAccessToken()
    }
  }, [])

  React.useEffect(() => {
    if (
      isScriptLoaded &&
      typeof window !== 'undefined' &&
      typeof window.google !== 'undefined'
    ) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: '',
        scope: `openid profile email ${googleScope}`,
        callback: (response: CredentialResponse | TokenResponse) => {
          if (response.error) onErrorRef.current?.(response)
          else onSuccessRef.current?.(response)
        },
      })
      googleClientRef.current = client
    }
  }, [isScriptLoaded])

  React.useEffect(() => {
    onErrorRef.current = props?.onError
    onSuccessRef.current = props?.onSuccess
  }, [props])

  return onGoogleLogin
}
