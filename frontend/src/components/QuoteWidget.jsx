import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import localQuotes from "../data/quotes.json";

const QuoteWidget = () => {
    const { i18n } = useTranslation();
    const [quote, setQuote] = useState({ text: "", author: "" });
    const [loading, setLoading] = useState(true);

    const isJapanese = i18n.language.startsWith("ja");

    useEffect(() => {
        fetchQuote();
    }, [i18n.language]);

    const fetchQuote = async () => {
        setLoading(true);
        try {
            if (isJapanese) {
                // Use local JSON for Japanese (API availability is poor for free JP quotes)
                // Add a small delay to simulate network feel (optional, but nice for UI consistency)
                await new Promise(resolve => setTimeout(resolve, 500));

                const randomQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
                setQuote({
                    text: randomQuote.text_ja,
                    author: randomQuote.author_ja
                });
            } else {
                // Try API first, fallback to local
                // Note: Many free quote APIs have CORS or stability issues.
                // We use a short timeout to fail fast and fall back to local data to prevent hanging.
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

                    const response = await fetch("https://dummyjson.com/quotes/random", { signal: controller.signal });
                    clearTimeout(timeoutId);

                    if (!response.ok) throw new Error("API Response not ok");

                    const data = await response.json();
                    if (data.quote) {
                        setQuote({
                            text: data.quote,
                            author: data.author
                        });
                    } else {
                        throw new Error("No data");
                    }
                } catch (apiError) {
                    // Silent fallback - user doesn't need to know API failed
                    const randomQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
                    setQuote({
                        text: randomQuote.text,
                        author: randomQuote.author
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching quote:", error);
            const fallback = localQuotes[0];
            setQuote({
                text: isJapanese ? fallback.text_ja : fallback.text,
                author: isJapanese ? fallback.author_ja : fallback.author
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
                <Quote size={100} />
            </div>

            <div className="relative z-10">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-24 flex items-center justify-center"
                        >
                            <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <p className="text-lg md:text-xl font-medium leading-relaxed font-serif italic opacity-95">
                                "{quote.text}"
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-indigo-100">
                                <span className="w-8 h-[1px] bg-indigo-200/50"></span>
                                <span>{quote.author}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default QuoteWidget;
