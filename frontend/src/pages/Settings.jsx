import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Globe } from "lucide-react";

const Settings = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language_selected", "true"); // Update logic if needed
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('common.settings')}</h1>
                    <p className="text-gray-500">Manage your preferences</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-indigo-600" />
                            {t('common.language')}
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${i18n.language === 'en'
                                        ? 'border-indigo-600 bg-indigo-50'
                                        : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-900">English</span>
                                    {i18n.language === 'en' && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                </div>
                            </button>

                            <button
                                onClick={() => changeLanguage('ja')}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${i18n.language === 'ja' || i18n.language.startsWith('ja')
                                        ? 'border-indigo-600 bg-indigo-50'
                                        : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-900">日本語</span>
                                    {(i18n.language === 'ja' || i18n.language.startsWith('ja')) && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
