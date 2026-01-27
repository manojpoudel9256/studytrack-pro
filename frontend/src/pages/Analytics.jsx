import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecords, createRecord } from "../api/api";
import StudyTimer from "../components/StudyTimer";
import Layout from "../components/Layout";
import { Target } from "lucide-react";

function Analytics() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            getRecords().then(setRecords).catch(err => {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            });
        }
    }, [navigate]);

    const handleTimerSave = async (data) => {
        try {
            await createRecord({
                title: data.title,
                category: data.category,
                duration: data.duration,
                record_date: new Date().toISOString().split('T')[0]
            });
            // Refresh records
            const res = await getRecords();
            setRecords(res);
        } catch (error) {
            console.error("Failed to save timer session", error);
        }
    };

    return (
        <Layout>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Target className="w-8 h-8 text-indigo-600" />
                        Focus Session
                    </h1>
                    <p className="text-gray-500">Eliminate distractions and track your study time.</p>
                </div>

                <div className="w-full">
                    <StudyTimer onSave={handleTimerSave} />
                </div>
            </div>
        </Layout>
    );
}

export default Analytics;
