import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecord } from "../api/api";
import Layout from "../components/Layout";
import Input from "../components/Input";
import Button from "../components/Button";
import { Plus } from "lucide-react";

function AddRecord() {
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
                    <h1 className="text-2xl font-bold text-gray-900">Add New Record</h1>
                    <p className="text-gray-500">Manually log a study session to your history.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-indigo-600" />
                        Session Details
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Subject"
                            placeholder="What did you study?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Category"
                                placeholder="Topic (e.g. Math, Coding)"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <Input
                                label="Duration (Minutes)"
                                type="number"
                                placeholder="60"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </div>
                        <Input
                            label="Date"
                            type="date"
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                            required
                        />
                        <div className="pt-4">
                            <Button type="submit" disabled={loading} className="w-full md:w-auto md:px-8">
                                {loading ? "Saving..." : "Save Record"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default AddRecord;
