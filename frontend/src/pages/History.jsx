import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRecords, deleteRecord } from "../api/api";
import Layout from "../components/Layout";
import { Clock, Calendar, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

function History() {
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
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('history.title', 'Study History')}</h1>
                        <p className="text-gray-500">{t('history.description', 'A complete log of all your learning sessions.')}</p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                        {t('history.recordsCount', { count: records.length, defaultValue: '{{count}} Records' })}
                    </span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {records.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            {t('history.noRecords', 'No records found.')}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {records.map((r) => (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={r.id}
                                    className="px-6 py-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between group gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                                            {r.duration > 60 ? '2h+' : '1h'}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{r.title}</h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{r.category || 'General'}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(r.record_date).toLocaleDateString()}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-14 sm:pl-0">
                                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{r.duration}m</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                            title={t('common.delete', 'Delete')}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default History;
