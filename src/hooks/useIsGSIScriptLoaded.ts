import * as React from 'react'

type IntervalID = number

export const useIsGSIScriptLoaded = (): boolean => {
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)
  const intervalRef = React.useRef<IntervalID>()

  React.useEffect(() => {
    if (!isLoaded) {
      intervalRef.current = setInterval(() => {
        // @ts-ignore window.google
        if (typeof window !== 'undefined' && window.google !== 'undefined') {
          setIsLoaded(true)
        }
      }, 100)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return isLoaded
}
