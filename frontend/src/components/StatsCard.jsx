import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon: Icon, color = "indigo", subtext }) => {
    const colorClasses = {
        indigo: "bg-indigo-100 text-indigo-600",
        green: "bg-green-100 text-green-600",
        orange: "bg-orange-100 text-orange-600",
        blue: "bg-blue-100 text-blue-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
                {subtext && <span className="text-sm text-gray-500">{subtext}</span>}
            </div>
        </motion.div>
    );
};

export default StatsCard;
