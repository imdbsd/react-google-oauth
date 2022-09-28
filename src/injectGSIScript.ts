import {CredentialResponse, PromptMomentNotification} from 'google-one-tap'

export const injectGSIScript = (
  googleClientId: string,
  onUserSignIn: (credentialResponse: CredentialResponse) => Promise<void>
) => {
  if (document && typeof google === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: onUserSignIn,
      })
      google.accounts.id.prompt((notification: PromptMomentNotification) => {
        const momentType = notification.getMomentType()
        const isDisplayed = notification.isDisplayed()
        const dismissedReason = notification.getDismissedReason()
        // if (isDisplayed && momentType === 'display') {
        //   impression('view')
        // }
        const isUserTapOutside = !isDisplayed && momentType === 'skipped'
        const isUserCloseByNavigate =
          momentType === 'dismissed' &&
          !isDisplayed &&
          dismissedReason === 'cancel_called'
        // if (isUserTapOutside || isUserCloseByNavigate) {
        //   impression('close')
        // }
      })
    }
    script.async = true
    script.defer = true
    const body = document.querySelector('body')
    if (body) {
      body.appendChild(script)
    }
  }
}
