import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './hooks/useToast.tsx'
import { VehiclesProvider } from './hooks/useVehicles.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <VehiclesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </VehiclesProvider>
    </ToastProvider>
  </StrictMode>,
)
