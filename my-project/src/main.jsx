import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CSVUploader from './components/CSVUploader'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CSVUploader />
  </StrictMode>,
)
