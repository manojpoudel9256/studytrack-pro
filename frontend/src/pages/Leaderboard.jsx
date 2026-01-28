import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../api/api";
import Layout from "../components/Layout";
import { Trophy, Medal, Crown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

function Leaderboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        getLeaderboard()
            .then(setUsers)
            .catch(err => {
                console.error("Failed to fetch leaderboard", err);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const getRankIcon = (rank) => {
        if (rank === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
        if (rank === 1) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-orange-400" />;
        return <span className="font-bold text-gray-400 w-6 text-center">{rank + 1}</span>;
    };

    const getRankColor = (rank) => {
        if (rank === 0) return "bg-yellow-50 border-yellow-200";
        if (rank === 1) return "bg-gray-50 border-gray-200";
        if (rank === 2) return "bg-orange-50 border-orange-100";
        return "bg-white border-gray-100 hover:bg-gray-50";
    };

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
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        {t('leaderboard.title', 'Leaderboard')}
                    </h1>
                    <p className="text-gray-500">{t('leaderboard.description', 'Top students dedicated to learning.')}</p>
                </div>

                <div className="space-y-3">
                    {users.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                            {t('leaderboard.noRecords', 'No records yet. Be the first!')}
                        </div>
                    ) : (
                        users.map((user, index) => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${getRankColor(index)}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 w-8 flex justify-center">
                                        {getRankIcon(index)}
                                    </div>
                                    <div
                                        className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden border border-indigo-200 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => user.profile_picture && setSelectedImage(user.profile_picture)}
                                    >
                                        {user.profile_picture ? (
                                            <img src={`http://localhost:5000${user.profile_picture}`} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name[0].toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                                Lvl {user.level || 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-indigo-600">
                                        {user.total_xp || 0} XP
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {t('leaderboard.totalScore', 'Total Score')}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Image Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <img
                                    src={`http://localhost:5000${selectedImage}`}
                                    alt="Full Size"
                                    className="w-full h-auto max-h-[80vh] object-contain bg-gray-100"
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}

export default Leaderboard;
