import * as React from 'react'

interface InjectGSIOptions {
  onLoad?: () => void
  onError?: () => void
}

const injectGSIScript = (args?: InjectGSIOptions) => {
  if (document && typeof google === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      args?.onLoad?.()
    }
    script.onerror = () => {
      args?.onError?.()
    }
    script.async = true
    script.defer = true
    const body = document.querySelector('body')
    if (body) {
      body.appendChild(script)
    }
  }
}

interface Props {
  when?: boolean | (() => boolean)
}

export const useLoadGSIScript = (props?: Props): boolean => {
  const [scriptLoaded, setScriptLoaded] = React.useState(false)
  const shouldInject = React.useCallback((when?: boolean | (() => boolean)) => {
    if (typeof when === 'boolean' || typeof when === 'function') {
      return typeof when === 'function' ? when() : when
    }
    return true
  }, [])

  const onError = React.useCallback(() => {
    setScriptLoaded(false)
  }, [])

  const onLoad = React.useCallback(() => {
    setScriptLoaded(true)
  }, [])

  React.useEffect(() => {
    if (shouldInject(props?.when)) {
      injectGSIScript({
        onLoad,
        onError,
      })
    }
  }, [shouldInject, props])

  return scriptLoaded
}
