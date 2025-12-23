import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PhilosopherProvider } from './context/PhilosopherContext'
import { ThemeProvider } from './context/ThemeContext'
import MenuPage from './pages/MenuPage'

// Get base path from Vite environment
const basePath = import.meta.env.BASE_URL

// Code Splitting - Lazy loading
const MapPage = lazy(() => import('./pages/MapPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <PhilosopherProvider>
        <Router basename={basePath === '/' ? undefined : basePath.slice(0, -1)}>
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route 
              path="/map" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <MapPage />
                </Suspense>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <SettingsPage />
                </Suspense>
              } 
            />
            <Route 
              path="/about" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AboutPage />
                </Suspense>
              } 
            />
          </Routes>
        </Router>
      </PhilosopherProvider>
    </ThemeProvider>
  )
}

export default App

