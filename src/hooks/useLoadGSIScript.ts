import * as React from 'react'

interface LoadGSIConfig {
  onLoad: () => void
}

export const injectGSIScript = (config: LoadGSIConfig) => {
  if (document && typeof google === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      config.onLoad()
    }
    script.async = true
    script.defer = true
    const body = document.querySelector('body')
    if (body) {
      body.appendChild(script)
    }
  }
}

export const useLoadGSIScript = () => {
  const [scriptIsLoaded, setScriptIsLoaded] = React.useState(false)

  const onLoad = React.useCallback(() => {
    setScriptIsLoaded(true)
  }, [])

  React.useEffect(() => {
    injectGSIScript({
      onLoad,
    })
  }, [])

  return scriptIsLoaded
}
