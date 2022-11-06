import * as React from 'react'
import {useIsGSIScriptLoaded} from './useIsGSIScriptLoaded'
import {CredentialResponse, MomenListener} from '../types/gsi.types'
interface Props {
  onPrompt?: MomenListener
  onSuccess?: (codeResponse: CredentialResponse) => void | Promise<void>
  onError?: (codeResponse: CredentialResponse) => void | Promise<void>
}

export const useGoogleOneTapLogin = (props: Props): void => {
  const isScriptLoaded = useIsGSIScriptLoaded()
  const onErrorRef = React.useRef(props?.onError)
  const onPromptRef = React.useRef(props?.onPrompt)
  const onSuccessRef = React.useRef(props?.onSuccess)

  React.useEffect(() => {
    if (
      isScriptLoaded &&
      typeof window !== 'undefined' &&
      typeof window.google !== 'undefined'
    ) {
      window.google?.accounts.id.initialize({
        client_id: '',
        callback: (response: any) => {
          if (response.error) onErrorRef.current?.(response)
          else onSuccessRef.current?.(response)
        },
      })

      window.google?.accounts.id.prompt(onPromptRef.current)

      return () => {
        window.google?.accounts.id.cancel()
      }
    }
  }, [isScriptLoaded])

  React.useEffect(() => {
    onErrorRef.current = props?.onError
    onSuccessRef.current = props?.onSuccess
    onPromptRef.current = props?.onPrompt
  }, [props])
}
