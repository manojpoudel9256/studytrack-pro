import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getRecords } from "../api/api";
import ActivitiesChart from "../components/ActivitiesChart";
import CategoryChart from "../components/CategoryChart";
import Layout from "../components/Layout";
import { BarChart2 } from "lucide-react";
import { useTranslation } from "react-i18next";

function ChartAnalysis() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            getRecords()
                .then(setRecords)
                .catch(err => {
                    if (err.response && err.response.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [navigate]);

    const stats = useMemo(() => {
        // Weekly Data
        const weeklyMap = new Map();
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            weeklyMap.set(dateStr, { name: dayName, minutes: 0 });
        }

        records.forEach(r => {
            const d = r.record_date.split('T')[0];
            if (weeklyMap.has(d)) {
                weeklyMap.get(d).minutes += r.duration;
            }
        });
        const weeklyData = Array.from(weeklyMap.values());

        // Category Data
        const catMap = {};
        records.forEach(r => {
            const cat = r.category || "Other";
            catMap[cat] = (catMap[cat] || 0) + r.duration;
        });
        const categoryData = Object.entries(catMap)
            .sort(([, a], [, b]) => b - a)
            .map(([name, value]) => ({ name, value }));

        return { weeklyData, categoryData };
    }, [records]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart2 className="w-8 h-8 text-indigo-600" />
                        {t('charts.title', 'Chart Analysis')}
                    </h1>
                    <p className="text-gray-500">{t('charts.description', 'Deep dive into your study patterns.')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700">{t('charts.weeklyActivity', 'Weekly Activity')}</h2>
                        <ActivitiesChart data={stats.weeklyData} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700">{t('charts.subjectDistribution', 'Subject Distribution')}</h2>
                        <CategoryChart data={stats.categoryData} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ChartAnalysis;
