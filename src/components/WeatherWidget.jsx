import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Droplets, MapPin, Loader2 } from 'lucide-react';

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeGradient, setTimeGradient] = useState('');

  // Determine iridescent gradient based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) {
      // Dawn: Soft pinks and dawn blues
      setTimeGradient('from-rose-100/60 via-fuchsia-100/40 to-indigo-100/60 text-gray-800');
    } else if (hour >= 9 && hour < 17) {
      // Day: Bright sky blues and soft yellows
      setTimeGradient('from-blue-100/50 via-cyan-50/50 to-amber-50/50 text-gray-800');
    } else if (hour >= 17 && hour < 20) {
      // Dusk: Deep oranges and purples
      setTimeGradient('from-orange-200/50 via-pink-200/50 to-purple-200/50 text-gray-800');
    } else {
      // Night: Deep slate and iridescent indigo
      setTimeGradient('from-slate-700/80 via-indigo-900/80 to-blue-900/80 text-white border-white/10');
    }
  }, []);

  const fetchWeather = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          // Open-Meteo Free API (No keys required)
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&timezone=auto`);
          const data = await res.json();
          setWeatherData({
            temp: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m
          });
        } catch (err) {
          setError("Failed to fetch climate data.");
          // Handled gracefully in UI via error state
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied.");
        setLoading(false);
      }
    );
  };

  // The Intelligence Logic Mapping
  const getAuraTip = (humidity) => {
    if (humidity > 75) {
      return {
        title: "Pore-Clog Alert",
        desc: "High moisture in the air. Stick to lightweight, gel-based 'Safe' products to prevent sweat-induced flares.",
        icon: <Droplets className="text-blue-500" size={24} />
      };
    } else if (humidity < 40) {
      return {
        title: "Dry Air Alert",
        desc: "Your skin may lose moisture fast. Use a fungal-safe occlusive (like Squalane) to seal your barrier.",
        icon: <Sun className="text-amber-500" size={24} />
      };
    } else {
      return {
        title: "Balanced Climate",
        desc: "Optimal humidity levels. Maintain your standard FA-safe routine today.",
        icon: <CloudRain className="text-[#9EAB9A]" size={24} />
      };
    }
  };

  return (
    <div className={`w-full h-full min-h-[300px] md:min-h-0 flex flex-col justify-center bg-gradient-to-br ${timeGradient} backdrop-blur-lg rounded-[2.5rem] border border-white/60 shadow-[0_10px_40px_-10px_rgba(46,32,24,0.12)] transition-all duration-700 p-6 relative overflow-hidden group font-sans`}>
      <h2 className="absolute top-6 left-6 text-sm font-bold tracking-wider uppercase opacity-80 flex items-center gap-1.5 z-10 font-sans text-[#2E2018]">
        <MapPin size={14} /> Climate
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full mt-8">
        {!weatherData && !loading && (
          <div className="text-center">
            <p className="text-sm font-medium opacity-70 mb-6 max-w-[200px] mx-auto leading-relaxed">
              Enable location access for a climate-adaptive Aura Tip
            </p>
            <button 
              onClick={fetchWeather}
              className="bg-white/80 backdrop-blur text-gray-800 hover:bg-white border border-white/60 px-6 py-3 rounded-full shadow-lg font-bold text-sm transition-all active:scale-95"
            >
              Get Local Tip
            </button>
            {error && <p className="text-red-500 text-xs mt-4 font-bold bg-red-100/50 p-2 rounded">{error}</p>}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center opacity-70">
            <Loader2 className="animate-spin mb-3 relative top-0 animate-[spin_2s_linear_infinite]" size={32} />
            <span className="text-xs font-bold tracking-widest uppercase">Connecting...</span>
          </div>
        )}

        {weatherData && !loading && (
          <div className="w-full flex flex-col h-full animate-[fade-in_0.5s_ease-out]">
            <div className="flex items-end justify-between border-b border-black/10 dark:border-white/10 pb-4 mb-4">
              <div>
                <span className="text-5xl font-black tracking-tighter">
                  {Math.round(weatherData.temp)}&deg;
                </span>
              </div>
              <div className="text-right">
                 <p className="text-3xl font-bold opacity-80">{weatherData.humidity}%</p>
                 <p className="text-xs font-bold uppercase tracking-widest opacity-60">Humidity</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                {getAuraTip(weatherData.humidity).icon}
                <h3 className="text-lg font-black tracking-tight leading-none">
                  {getAuraTip(weatherData.humidity).title}
                </h3>
              </div>
              <p className="text-sm font-medium opacity-80 leading-snug">
                {getAuraTip(weatherData.humidity).desc}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Iridescent Frost Overlay */}
      <div className="absolute inset-0 bg-white/20 mix-blend-overlay pointer-events-none" />
    </div>
  );
}
