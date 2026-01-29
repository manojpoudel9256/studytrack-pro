const axios = require('axios');

exports.getWeather = async (req, res) => {
    try {
        const { lat, lon, city, lang } = req.query;
        const apiKey = process.env.WEATHER_API_KEY;
        const language = lang || 'en';

        if (!apiKey) {
            return res.status(500).json({ message: "Server configuration error: Missing API Key" });
        }

        let url = '';
        if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${language}&appid=${apiKey}`;
        } else {
            // Default to Tokyo if no location provided
            const queryCity = city || 'Tokyo';
            url = `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&units=metric&lang=${language}&appid=${apiKey}`;
        }

        const response = await axios.get(url);
        const data = response.data;

        // Simplify response for frontend
        const weatherData = {
            city: data.name,
            country: data.sys.country,
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            condition: data.weather[0].main,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };

        res.json(weatherData);

    } catch (error) {
        console.error("Weather API Error:", error.message);
        if (error.response) {
            return res.status(error.response.status).json({ message: error.response.data.message });
        }
        res.status(500).json({ message: "Failed to fetch weather data" });
    }
};
