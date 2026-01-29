import { motion, AnimatePresence } from "framer-motion";

const WeatherBackground = ({ condition }) => {
    // Normalizing condition (OpenWeatherMap 'main' property)
    // Common: 'Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist', 'Fog'
    const weatherType = condition ? condition.toLowerCase() : "default";

    const variants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 2 } },
        exit: { opacity: 0, transition: { duration: 2 } }
    };

    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
            <AnimatePresence mode="wait">
                {/* CLEAR / SUNNY */}
                {(weatherType === 'clear' || weatherType === 'sunny') && (
                    <motion.div
                        key="sunny"
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-sky-50/30 to-white"
                    >
                        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px] animate-pulse-slow"></div>
                        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-yellow-100/30 rounded-full blur-[80px]"></div>
                    </motion.div>
                )}

                {/* CLOUDS */}
                {(weatherType === 'clouds' || weatherType === 'mist' || weatherType === 'fog') && (
                    <motion.div
                        key="clouds"
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 bg-gradient-to-b from-slate-100/50 to-white"
                    >
                        <motion.div
                            animate={{ x: [0, 50, 0] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-slate-200/20 to-transparent blur-3xl"
                        />
                    </motion.div>
                )}

                {/* RAIN / DRIZZLE */}
                {(weatherType === 'rain' || weatherType === 'drizzle') && (
                    <motion.div
                        key="rain"
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 bg-gradient-to-b from-slate-200/30 via-slate-100/20 to-white"
                    >
                        <div className="rain-container absolute inset-0 opacity-30">
                            {/* CSS-based Rain Animation */}
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-[1px] h-[50px] bg-gradient-to-b from-transparent to-blue-300 rounded-full animate-rain"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `-${Math.random() * 20}%`,
                                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                                        animationDelay: `${Math.random() * 2}s`
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* THUNDERSTORM */}
                {weatherType === 'thunderstorm' && (
                    <motion.div
                        key="thunder"
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 bg-gradient-to-b from-slate-300/30 via-slate-100/10 to-white"
                    >
                        {/* Subtle Flash Overlay */}
                        <motion.div
                            animate={{ opacity: [0, 0, 0.1, 0] }}
                            transition={{ duration: 5, repeat: Infinity, repeatDelay: Math.random() * 10 }}
                            className="absolute inset-0 bg-indigo-200/30 mix-blend-overlay"
                        />
                    </motion.div>
                )}

                {/* SNOW */}
                {weatherType === 'snow' && (
                    <motion.div
                        key="snow"
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 bg-gradient-to-b from-slate-200/80 via-blue-50/30 to-white"
                    >
                        {[...Array(50)].map((_, i) => {
                            const size = Math.random() * 6 + 4; // 4px to 10px
                            return (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, 1000],
                                        x: [0, Math.random() * 100 - 50]
                                    }}
                                    transition={{
                                        duration: 8 + Math.random() * 10,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: Math.random() * 5
                                    }}
                                    className="absolute bg-white rounded-full shadow-sm"
                                    style={{
                                        width: size,
                                        height: size,
                                        left: `${Math.random() * 100}%`,
                                        top: -20,
                                        opacity: 0.7 + Math.random() * 0.3
                                    }}
                                />
                            );
                        })}
                    </motion.div>
                )}

                {/* DEFAULT FALLBACK (Subtle Gradient) */}
                {!['clear', 'sunny', 'clouds', 'mist', 'fog', 'rain', 'drizzle', 'thunderstorm', 'snow'].includes(weatherType) && (
                    <motion.div
                        key="default"
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-white to-white"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default WeatherBackground;
