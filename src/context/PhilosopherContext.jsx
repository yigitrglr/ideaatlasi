import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'
import philosophersData from '@/data/philosophers.json'

const PhilosopherContext = createContext()

export function PhilosopherProvider({ children }) {
  const [philosophers] = useState(philosophersData)
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    period: 'all',
    school: 'all',
    city: 'all'
  })
  
  // Zaman aralığı sınırları - memoize edilmiş
  const { minYear, maxYear } = useMemo(() => ({
    minYear: Math.min(...philosophers.map(p => p.birthYear)),
    maxYear: Math.max(...philosophers.map(p => p.deathYear))
  }), [philosophers])

  const [timeRange, setTimeRange] = useState({
    start: minYear,
    end: maxYear
  })

  // minYear veya maxYear değiştiğinde timeRange'i güncelle
  useEffect(() => {
    // Use functional update to avoid dependency on timeRange
    setTimeRange(prev => {
      if (prev.start === minYear && prev.end === maxYear) {
        return prev // No change needed
      }
      return {
        start: minYear,
        end: maxYear
      }
    })
  }, [minYear, maxYear])

  // Benzersiz dönemler - memoize edilmiş
  const periods = useMemo(() => 
    [...new Set(philosophers.map(p => p.period))].sort(),
    [philosophers]
  )

  // Benzersiz okullar - memoize edilmiş
  const schools = useMemo(() => 
    [...new Set(philosophers.map(p => p.school))].sort(),
    [philosophers]
  )

  // Benzersiz şehirler - memoize edilmiş
  const cities = useMemo(() => 
    [...new Set(philosophers.map(p => p.birthCity))].sort(),
    [philosophers]
  )

  // Son görüntülenen filozoflar
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem('recentlyViewed')
      if (stored) {
        const parsed = JSON.parse(stored)
        // ID'leri kullanarak filozofları bul
        return parsed.map(id => philosophers.find(p => p.id === id)).filter(Boolean)
      }
    } catch (e) {
      console.error('Error loading recently viewed:', e)
    }
    return []
  })

  // Favoriler - localStorage'dan yükle
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('favorites')
      if (stored) {
        const parsed = JSON.parse(stored)
        // ID'leri kullanarak filozofları bul
        return parsed.map(id => philosophers.find(p => p.id === id)).filter(Boolean)
      }
    } catch (e) {
      console.error('Error loading favorites:', e)
    }
    return []
  })

  // Favorileri philosophers değiştiğinde güncelle
  useEffect(() => {
    try {
      const stored = localStorage.getItem('favorites')
      if (stored) {
        const parsed = JSON.parse(stored)
        const updated = parsed.map(id => philosophers.find(p => p.id === id)).filter(Boolean)
        setFavorites(updated)
      }
    } catch (e) {
      console.error('Error updating favorites:', e)
    }
  }, [philosophers])

  // Filozof görüntülendiğinde kaydet
  const addToRecentlyViewed = useCallback((philosopher) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== philosopher.id)
      const updated = [philosopher, ...filtered].slice(0, 5) // Son 5 tanesi
      // Sadece ID'leri kaydet
      localStorage.setItem('recentlyViewed', JSON.stringify(updated.map(p => p.id)))
      return updated
    })
  }, [])

  // Favorilere ekle/çıkar
  const toggleFavorite = useCallback((philosopher) => {
    setFavorites(prev => {
      const isFavorite = prev.some(p => p.id === philosopher.id)
      let updated
      if (isFavorite) {
        // Favorilerden çıkar
        updated = prev.filter(p => p.id !== philosopher.id)
      } else {
        // Favorilere ekle
        updated = [...prev, philosopher]
      }
      // Sadece ID'leri kaydet
      localStorage.setItem('favorites', JSON.stringify(updated.map(p => p.id)))
      return updated
    })
  }, [])

  // Filozof favori mi kontrol et
  const isFavorite = useCallback((philosopherId) => {
    return favorites.some(p => p.id === philosopherId)
  }, [favorites])

  // Arama geçmişi
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('searchHistory')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Arama geçmişine ekle (sadece manuel olarak çağrıldığında)
  const addToSearchHistory = useCallback((query) => {
    if (!query || query.trim() === '') return
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase())
      const updated = [query.trim(), ...filtered].slice(0, 10) // Son 10 arama
      localStorage.setItem('searchHistory', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Arama geçmişini güncelle (localStorage'dan)
  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('searchHistory')
        if (stored) {
          const parsed = JSON.parse(stored)
          setSearchHistory(parsed)
        } else {
          setSearchHistory([])
        }
      } catch (e) {
        console.error('Error loading search history:', e)
      }
    }
    
    loadHistory()
    
    // Custom storage event'lerini dinle (aynı tab'dan gelen değişiklikler için)
    const handleCustomStorage = (e) => {
      if (e.key === 'searchHistory' || !e.key) {
        loadHistory()
      }
    }
    
    window.addEventListener('storage', handleCustomStorage)
    // Custom event için de dinle
    window.addEventListener('searchHistoryUpdated', loadHistory)
    
    return () => {
      window.removeEventListener('storage', handleCustomStorage)
      window.removeEventListener('searchHistoryUpdated', loadHistory)
    }
  }, [])

  // Fuzzy search helper - Levenshtein distance benzeri basit fuzzy matching
  const fuzzyMatch = useCallback((text, query) => {
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    
    // Tam eşleşme
    if (lowerText.includes(lowerQuery)) return 1
    
    // Karakter bazlı eşleşme (basit fuzzy)
    let textIndex = 0
    for (let i = 0; i < lowerQuery.length; i++) {
      const char = lowerQuery[i]
      const foundIndex = lowerText.indexOf(char, textIndex)
      if (foundIndex === -1) return 0
      textIndex = foundIndex + 1
    }
    return 0.5 // Kısmi eşleşme
  }, [])

  // Filtrelenmiş filozoflar - memoize edilmiş (gelişmiş arama ile)
  const filteredPhilosophers = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase()
    
    return philosophers.filter(philosopher => {
      // Gelişmiş arama - tam metin arama (eserler, fikirler dahil)
      let matchesSearch = searchQuery === ''
      
      if (searchQuery !== '') {
        // İsim araması
        const nameMatch = philosopher.name.toLowerCase().includes(lowerSearchQuery) ||
          philosopher.nameEn.toLowerCase().includes(lowerSearchQuery)
        
        // Şehir ve okul araması
        const locationMatch = philosopher.birthCity.toLowerCase().includes(lowerSearchQuery) ||
          philosopher.school.toLowerCase().includes(lowerSearchQuery)
        
        // Eserler araması
        const worksMatch = philosopher.works?.some(work =>
          work.title.toLowerCase().includes(lowerSearchQuery) ||
          (work.description && work.description.toLowerCase().includes(lowerSearchQuery))
        ) || false
        
        // Fikirler araması
        const ideasMatch = philosopher.keyIdeas?.some(idea =>
          idea.toLowerCase().includes(lowerSearchQuery)
        ) || false
        
        // Biyografi araması
        const bioMatch = philosopher.biography?.toLowerCase().includes(lowerSearchQuery) || false
        
        // Fuzzy search (eğer tam eşleşme yoksa)
        const fuzzyNameMatch = !nameMatch && fuzzyMatch(philosopher.name, searchQuery) > 0
        const fuzzyNameEnMatch = !nameMatch && fuzzyMatch(philosopher.nameEn, searchQuery) > 0
        
        matchesSearch = nameMatch || locationMatch || worksMatch || ideasMatch || bioMatch || 
          fuzzyNameMatch || fuzzyNameEnMatch
      }

      // Dönem filtresi
      const matchesPeriod = filters.period === 'all' || philosopher.period === filters.period

      // Okul filtresi
      const matchesSchool = filters.school === 'all' || philosopher.school === filters.school

      // Şehir filtresi
      const matchesCity = filters.city === 'all' || philosopher.birthCity === filters.city

      // Zaman aralığı filtresi - filozofun yaşam süresi zaman aralığıyla kesişiyorsa göster
      const matchesTimeRange = philosopher.birthYear <= timeRange.end && 
        philosopher.deathYear >= timeRange.start

      return matchesSearch && matchesPeriod && matchesSchool && matchesCity && matchesTimeRange
    })
  }, [philosophers, searchQuery, filters, timeRange, fuzzyMatch])

  const value = {
    philosophers,
    filteredPhilosophers,
    selectedPhilosopher,
    setSelectedPhilosopher,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    timeRange,
    setTimeRange,
    periods,
    schools,
    cities,
    minYear,
    maxYear,
    recentlyViewed,
    addToRecentlyViewed,
    favorites,
    toggleFavorite,
    isFavorite,
    searchHistory,
    addToSearchHistory
  }

  return (
    <PhilosopherContext.Provider value={value}>
      {children}
    </PhilosopherContext.Provider>
  )
}

export function usePhilosophers() {
  const context = useContext(PhilosopherContext)
  if (!context) {
    throw new Error('usePhilosophers must be used within PhilosopherProvider')
  }
  return context
}

