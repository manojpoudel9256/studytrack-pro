import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from "framer-motion";

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const CategoryChart = ({ data }) => {
    // Generate distinct colors for many categories if needed, repeating the palette
    const getParamColor = (index) => COLORS[index % COLORS.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[30rem] lg:h-[26rem]"
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Subject Distribution</h3>

            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
                {/* Chart Section */}
                <div className="h-[250px] lg:h-full flex-none lg:flex-1 relative min-w-[200px]">
                    <div className="absolute inset-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getParamColor(index)} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value}m`, 'Duration']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Centered Total or Label if desired */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="text-sm text-gray-400 font-medium">Total</span>
                            <p className="text-xl font-bold text-gray-800">
                                {data.reduce((acc, curr) => acc + curr.value, 0)}m
                            </p>
                        </div>
                    </div>
                </div>

                {/* Custom Scrollable Legend */}
                <div className="flex-1 min-h-0 lg:flex-none lg:w-1/3 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-4 pt-4 lg:pt-0">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</h4>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {data.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: getParamColor(index) }}
                                    />
                                    <span className="text-sm text-gray-700 font-medium truncate" title={entry.name}>
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                                    {entry.value}m
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CategoryChart;
