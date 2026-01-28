import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecord } from "../api/api";
import Layout from "../components/Layout";
import Input from "../components/Input";
import Button from "../components/Button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

function AddRecord() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [duration, setDuration] = useState("");
    const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createRecord({
                title,
                category,
                duration: Number(duration),
                record_date: recordDate,
            });
            navigate("/history");
        } catch (error) {
            console.error("Failed to create record", error);
            alert("Failed to create record");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('addRecord.title', 'Add New Record')}</h1>
                    <p className="text-gray-500">{t('addRecord.description', 'Manually log a study session to your history.')}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-indigo-600" />
                        {t('addRecord.sessionDetails', 'Session Details')}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label={t('addRecord.subject', 'Subject')}
                            placeholder={t('addRecord.subjectPlaceholder', 'What did you study?')}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label={t('addRecord.category', 'Category')}
                                placeholder={t('addRecord.categoryPlaceholder', 'Topic (e.g. Math, Coding)')}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <Input
                                label={t('addRecord.duration', 'Duration (Minutes)')}
                                type="number"
                                placeholder={t('addRecord.durationPlaceholder', '60')}
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </div>
                        <Input
                            label={t('addRecord.date', 'Date')}
                            type="date"
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                            required
                        />
                        <div className="pt-4">
                            <Button type="submit" disabled={loading} className="w-full md:w-auto md:px-8">
                                {loading ? t('addRecord.saving', 'Saving...') : t('addRecord.save', 'Save Record')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default AddRecord;
