import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, MapPin, Book, TrendingUp } from 'lucide-react'
import { usePhilosophers } from '@/context/PhilosopherContext'

function AboutPage() {
  const navigate = useNavigate()
  const { philosophers } = usePhilosophers()

  // İstatistikler
  const stats = useMemo(() => {
    const periods = {}
    const schools = {}
    const cities = {}
    
    philosophers.forEach(p => {
      periods[p.period] = (periods[p.period] || 0) + 1
      schools[p.school] = (schools[p.school] || 0) + 1
      cities[p.birthCity] = (cities[p.birthCity] || 0) + 1
    })

    const topPeriods = Object.entries(periods)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    const topSchools = Object.entries(schools)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    const topCities = Object.entries(cities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return {
      total: philosophers.length,
      periods: topPeriods,
      schools: topSchools,
      cities: topCities
    }
  }, [philosophers])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ana Menüye Dön
        </Button>

        <h1 className="text-3xl font-bold">Hakkımızda</h1>
        
        <div className="space-y-6 text-foreground">
          <p>
            İdea Atlası, filozofların hayatlarını, 
            eserlerini ve düşüncelerini interaktif bir harita üzerinden keşfetmenizi 
            sağlayan bir platformdur.
          </p>
          
          <p>
            Bu proje, felsefe tarihini görselleştirerek öğrenmeyi kolaylaştırmayı 
            ve filozofların yaşadıkları coğrafyaları keşfetmenizi amaçlamaktadır.
          </p>

          {/* Dashboard - İstatistikler */}
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">İstatistikler</h2>
            
            {/* Toplam Filozof Sayısı */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Toplam Filozof</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dönem Dağılımı */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Dönem Dağılımı</h3>
              </div>
              <div className="space-y-2">
                {stats.periods.map(([period, count]) => {
                  const percentage = ((count / stats.total) * 100).toFixed(1)
                  return (
                    <div key={period} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{period}</span>
                        <span className="text-muted-foreground">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Okul/Akım İstatistikleri */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Book className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">En Popüler Okullar/Akımlar</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats.schools.map(([school, count]) => (
                  <div key={school} className="flex justify-between items-center p-2 bg-background rounded">
                    <span className="text-sm">{school}</span>
                    <span className="text-sm font-semibold text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coğrafi Dağılım */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Coğrafi Dağılım</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats.cities.map(([city, count]) => (
                  <div key={city} className="flex justify-between items-center p-2 bg-background rounded">
                    <span className="text-sm">{city}</span>
                    <span className="text-sm font-semibold text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teknolojiler */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Teknolojiler</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>React</li>
              <li>Vite</li>
              <li>shadcn/ui</li>
              <li>Leaflet & OpenStreetMap</li>
              <li>React Router</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

