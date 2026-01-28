import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageToggle = ({ className = "" }) => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith('en') ? 'ja' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem("language_selected", "true");
    };

    return (
        <button
            onClick={toggleLanguage}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80 border border-gray-200 shadow-sm backdrop-blur-sm transition-all text-sm font-medium text-gray-700 hover:text-indigo-600 ${className}`}
            title="Toggle Language"
        >
            <Globe className="w-4 h-4" />
            <span>{i18n.language.startsWith('en') ? 'English' : '日本語'}</span>
        </button>
    );
};

export default LanguageToggle;
