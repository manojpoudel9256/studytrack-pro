import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

const ActivitiesChart = ({ data }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full"
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
            <div className="h-64 w-full min-w-[300px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value) => [`${value}m`, 'Minutes']}
                        />
                        <Bar
                            dataKey="minutes"
                            fill="#4F46E5"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ActivitiesChart;
