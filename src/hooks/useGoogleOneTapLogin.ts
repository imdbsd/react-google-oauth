import {CredentialResponse} from 'google-one-tap'
import * as React from 'react'
import {useLoadGSIScript} from './useLoadGSIScript'

interface Configs {
  clientId?: string
  onSuccess?: (credentialResponse: CredentialResponse) => void
  onError?: () => void
}

export const useGoogleOneTapLogin = (configs?: Configs) => {
  const scriptIsLoaded = useLoadGSIScript()

  const onSuccess = React.useRef<Configs['onSuccess']>(configs?.onSuccess)
  const onError = React.useRef<Configs['onError']>(configs?.onError)

  React.useEffect(() => {
    console.log('scriptIsLoaded: ', scriptIsLoaded)
    if (typeof google !== 'undefined' && configs?.clientId) {
      google.accounts.id.initialize({
        client_id: configs.clientId,
        callback: (credentialResponse: CredentialResponse) => {
          console.log(credentialResponse)
          if (!credentialResponse.clientId || !credentialResponse.credential) {
            return onError.current?.()
          }
          return onSuccess.current?.(credentialResponse)
        },
      })
      google.accounts.id.prompt((notification) => {
        console.log('notification: ', notification)
      })
    }
  }, [scriptIsLoaded, configs?.clientId])
}
