import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App-github-pages'
import './index.css'

// GitHub Pages 专用入口文件
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)