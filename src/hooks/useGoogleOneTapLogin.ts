import * as React from 'react'
import {useIsGSIScriptLoaded} from './useIsGSIScriptLoaded'
import {
  GoogleCredentialResponse,
  MomenListener,
  IdConfiguration,
} from '../types/gsi.types'
interface Listener {
  onPrompt?: MomenListener
  onSuccess?: (codeResponse: GoogleCredentialResponse) => void | Promise<void>
  onError?: (codeResponse: GoogleCredentialResponse) => void | Promise<void>
}

export const useGoogleOneTapLogin = (
  configs: IdConfiguration,
  listener?: Listener
): void => {
  const isScriptLoaded = useIsGSIScriptLoaded()
  const onErrorRef = React.useRef(listener?.onError)
  const onPromptRef = React.useRef(listener?.onPrompt)
  const onSuccessRef = React.useRef(listener?.onSuccess)

  React.useEffect(() => {
    if (
      isScriptLoaded &&
      typeof window !== 'undefined' &&
      typeof window.google !== 'undefined'
    ) {
      const {client_id, callback, ...restConfigs} = configs
      window.google?.accounts.id.initialize({
        client_id: client_id,
        callback: (response: GoogleCredentialResponse) => {
          if (!response.credential) onErrorRef.current?.(response)
          else onSuccessRef.current?.(response)
          if (callback) callback(response)
        },
        ...restConfigs,
      })

      window.google?.accounts.id.prompt(onPromptRef.current)

      return () => {
        window.google?.accounts.id.cancel()
      }
    }
  }, [isScriptLoaded, configs])

  React.useEffect(() => {
    onErrorRef.current = listener?.onError
    onSuccessRef.current = listener?.onSuccess
    onPromptRef.current = listener?.onPrompt
  }, [listener])
}
