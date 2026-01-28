
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRecords, deleteRecord } from "../api/api";
import StatsCard from "../components/StatsCard";
import Layout from "../components/Layout";
import QuoteWidget from "../components/QuoteWidget";
import { BookOpen, Calendar, Zap, Award, Target, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

function Dashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);

    const loadRecords = () => {
        getRecords().then(setRecords).catch(err => {
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            loadRecords();
        }
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!confirm(t('common.deleteConfirm', "Are you sure you want to delete this record?"))) return;
        try {
            await deleteRecord(id);
            loadRecords();
        } catch (error) {
            console.error("Failed to delete record", error);
        }
    }

    // Derived Data for Dashboard
    const stats = useMemo(() => {
        const totalMinutes = records.reduce((acc, r) => acc + r.duration, 0);
        const totalHours = Math.round(totalMinutes / 60);

        // Distinct days
        const sortedDates = [...new Set(records.map(r => r.record_date.split('T')[0]))];
        const activeDays = sortedDates.length;

        return { totalHours, activeDays };
    }, [records]);

    return (
        <Layout>
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title', 'Dashboard')}</h1>
                        <p className="text-gray-500">{t('dashboard.welcome', "Welcome back! Here's your study overview.")}</p>
                    </div>
                    <div className="lg:col-span-1">
                        <QuoteWidget />
                    </div>
                </div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <StatsCard
                        title={t('dashboard.totalHours', 'Total Study Hours')}
                        value={stats.totalHours}
                        subtext={t('dashboard.lifetime', 'Lifetime')}
                        icon={BookOpen}
                        color="indigo"
                    />
                    <StatsCard
                        title={t('dashboard.activeDays', 'Active Days')}
                        value={stats.activeDays}
                        subtext={t('dashboard.totalDaysStudied', 'Total days studied')}
                        icon={Calendar}
                        color="blue"
                    />
                    <StatsCard
                        title={t('dashboard.focusGoal', 'Focus Goal')}
                        value="85%"
                        subtext={t('dashboard.dailyCompletion', 'Daily completion')}
                        icon={Target}
                        color="green"
                    />
                    <StatsCard
                        title={t('dashboard.currentLevel', 'Current Level')}
                        value="Scholar"
                        subtext={t('dashboard.top10', 'Top 10%')}
                        icon={Award}
                        color="gold" // Using new custom gold color
                    />
                </motion.div>

                {/* Recent History Snippet */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.recentActivity', 'Recent Activity')}</h3>
                        <span className="text-sm text-gray-500">{t('dashboard.last5Records', 'Last 5 records')}</span>
                    </div>

                    {records.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            {t('dashboard.noRecords', 'No records found. Start your first session!')}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {records.slice(0, 5).map((r) => (
                                <div key={r.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            {r.duration > 60 ? '2h+' : '1h'}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{r.title}</h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{r.category || 'General'}</span>
                                                <span>•</span>
                                                <span>{new Date(r.record_date).toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-900">{r.duration}m</span>
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="p-2 text-gray-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
