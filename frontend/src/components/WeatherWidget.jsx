import { useState, useEffect } from "react";
import axios from "axios";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const WeatherWidget = ({ onWeatherChange }) => {
    const { t, i18n } = useTranslation();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Try to get user location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            await getWeatherData(position.coords.latitude, position.coords.longitude);
                        },
                        async () => {
                            // Permission denied or error, fallback to default (Tokyo)
                            await getWeatherData();
                        }
                    );
                } else {
                    await getWeatherData();
                }
            } catch (err) {
                console.error("Weather widget init error", err);
                setLoading(false);
            }
        };

        fetchWeather();
    }, [i18n.language]);

    const getWeatherData = async (lat = null, lon = null) => {
        try {
            setLoading(true);
            const lang = i18n.language.split('-')[0]; // 'ja-JP' -> 'ja'
            let url = `http://localhost:3001/api/weather?lang=${lang}`;
            if (lat && lon) {
                url += `&lat=${lat}&lon=${lon}`;
            }

            // Get token if exists (though this route might be public, good practice to pass if needed later)
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get(url, { headers });
            setWeather(response.data);
            if (onWeatherChange && response.data.condition) {
                onWeatherChange(response.data.condition);
            }
            setError(null);
        } catch (err) {
            console.error("Failed to fetch weather", err);
            setError("Failed to load weather");
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (condition) => {
        if (!condition) return <Sun className="w-8 h-8 text-yellow-500" />;
        const main = condition.toLowerCase();

        if (main.includes('cloud')) return <Cloud className="w-8 h-8 text-gray-500" />;
        if (main.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
        if (main.includes('snow')) return <CloudSnow className="w-8 h-8 text-blue-300" />;
        if (main.includes('thunder')) return <CloudLightning className="w-8 h-8 text-purple-500" />;
        if (main.includes('clear')) return <Sun className="w-8 h-8 text-yellow-500" />;
        return <Cloud className="w-8 h-8 text-gray-400" />;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-center items-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center h-48 text-gray-400">
                <Cloud className="w-8 h-8 mb-2" />
                <span className="text-sm">{t('weather.error', 'Weather unavailable')}</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {weather.city}, {weather.country}
                    </h3>
                    <p className="text-indigo-100 text-sm capitalize">{weather.description}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {getWeatherIcon(weather.condition)}
                </div>
            </div>

            <div className="mt-6 flex items-end justify-between relative z-10">
                <div>
                    <span className="text-5xl font-bold tracking-tighter">{weather.temp}°</span>
                </div>
                <div className="flex gap-4 text-sm text-indigo-100">
                    <div className="flex items-center gap-1">
                        <Droplets className="w-4 h-4" />
                        <span>{weather.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Wind className="w-4 h-4" />
                        <span>{weather.windSpeed} m/s</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default WeatherWidget;
