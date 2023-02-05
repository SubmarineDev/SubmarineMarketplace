import React, { useState, useEffect, Suspense } from 'react'

// ** Router Import
import Router from './router/Router'

// ** Routes & Default Routes
import { getRoutes } from './router/routes'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'
import Loading from 'react-loading-components'

const App = () => {
  const [allRoutes, setAllRoutes] = useState([])

  // ** Hooks
  const { layout } = useLayout()

  useEffect(() => {
    setAllRoutes(getRoutes(layout))
  }, [layout])

  return (
    <Suspense fallback={null}>
      <Router allRoutes={allRoutes} />
       {/* <div style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%', backgroundColor: '#000', opacity: '0.5', zIndex: '10000' }}>
          <div 
            style={{
              position: 'fixed',
              top: 'calc(50vh - 50px)',
              left: 'calc(50vw - 50px)'
            }}
          >
             <Loading type='puff' width={100} height={100} fill='#7367f0'/>
          </div>
        </div> */}
    </Suspense>
  )
}

export default App
