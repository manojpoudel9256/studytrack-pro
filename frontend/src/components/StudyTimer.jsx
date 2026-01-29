import { useState } from "react";
import { Play, Pause, StopCircle, Award, Timer, Tag, Type, X, Plus, Pencil, Check, MinusCircle, Trash2 } from "lucide-react";
import Button from "./Button";
import { motion, AnimatePresence } from "framer-motion";
import { useTimer } from "../context/TimerContext";
import { useTranslation } from "react-i18next";

const StudyTimer = ({ onSave }) => {
    const { t } = useTranslation();
    const {
        isActive,
        isFocusMode,
        displaySeconds,
        subject,
        category,
        setSubject,
        setCategory,
        startSession,
        pauseSession,
        resumeSession,
        stopSession,
        resetSession
    } = useTimer();

    const [showXP, setShowXP] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);

    // Category State
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem("study_categories");
        return saved ? JSON.parse(saved) : ["General", "Coding", "Math", "Reading", "Science", "Writing"];
    });
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        const updated = [...categories, newCategoryName.trim()];
        setCategories(updated);
        localStorage.setItem("study_categories", JSON.stringify(updated));
        setCategory(newCategoryName.trim());
        setNewCategoryName("");
        setIsAddingCategory(false);
    };

    const handleDeleteCategory = (catToDelete, e) => {
        e.stopPropagation();
        if (confirm(t('timer.deleteCategoryConfirm', `Delete category "${catToDelete}"?`))) {
            const updated = categories.filter(c => c !== catToDelete);
            setCategories(updated);
            localStorage.setItem("study_categories", JSON.stringify(updated));
            if (category === catToDelete) {
                setCategory(updated[0] || "");
            }
        }
    };

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return {
            h: h.toString().padStart(2, '0'),
            m: m.toString().padStart(2, '0'),
            s: s.toString().padStart(2, '0')
        };
    };

    const timeObj = formatTime(displaySeconds);

    const handleStart = () => {
        if (!subject.trim()) {
            alert(t('timer.enterSubject', "Please enter a subject to focus on."));
            return;
        }
        startSession(subject, category);
    };

    const handleStop = () => {
        if (displaySeconds < 60) {
            if (confirm(t('timer.discardConfirm', "Session less than 1 minute. Discard?"))) {
                resetSession();
            }
            return;
        }

        const data = stopSession();
        onSave(data);
        const xp = data.duration * 10;
        setXpEarned(xp);
        setShowXP(true);
        setTimeout(() => setShowXP(false), 3000);
    };

    // XP Toast
    if (showXP) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center space-y-4 text-center aspect-square md:aspect-auto md:h-96"
            >
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                    <Award className="w-12 h-12 text-yellow-300" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">{t('timer.complete', 'Session Complete!')}</h3>
                    <p className="text-indigo-100 font-medium">{t('timer.excellent', 'Excellent Focus.')}</p>
                </div>
                <div className="text-5xl font-black text-yellow-300 tracking-tighter drop-shadow-sm">
                    +{xpEarned} <span className="text-2xl font-bold text-yellow-200/80">XP</span>
                </div>
            </motion.div>
        )
    }

    // Active Focus Mode - Premium Design
    if (isFocusMode) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-2xl md:h-96 flex flex-col items-center justify-center p-8 border border-slate-800"
            >
                {/* Dynamic Background Glow */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-500/20 blur-3xl rounded-full transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-30'}`} />

                <div className="z-10 w-full max-w-sm flex flex-col items-center gap-8">
                    {/* Header */}
                    <div className="text-center space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 backdrop-blur rounded-full border border-slate-700">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider">{t(`timer.categories.${category}`, category)}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white truncate max-w-[200px] mx-auto">{subject}</h3>
                    </div>

                    {/* Timer Display */}
                    <div className="flex items-end justify-center font-mono font-bold tracking-tighter text-slate-100 drop-shadow-2xl">
                        <span className="text-7xl">{timeObj.h}</span>
                        <span className="text-2xl opacity-50 mb-4 mx-1">:</span>
                        <span className="text-7xl">{timeObj.m}</span>
                        <span className="text-2xl opacity-50 mb-4 mx-1">:</span>
                        <span className="text-7xl w-[1.1em] text-center">{timeObj.s}</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={isActive ? pauseSession : resumeSession}
                            className="bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 border-0"
                        >
                            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                        </button>

                        <button
                            onClick={handleStop}
                            className="group flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 border border-slate-700 hover:border-red-500/50 transition-all"
                            title={t('timer.end', "End Session")}
                        >
                            <StopCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Default Setup Mode - Premium Card
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Timer className="w-32 h-32 text-indigo-600 -rotate-12 transform translate-x-8 -translate-y-8" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{t('timer.ready', "Ready to Focus?")}</h3>
                    <p className="text-gray-500">{t('timer.track', "Track your time and earn XP.")}</p>
                </div>

                <div className="flex-1 space-y-5">
                    <div className="group/input">
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 group-focus-within/input:text-indigo-600 transition-colors">
                            <Type className="w-4 h-4" /> {t('timer.subject', "Subject")}
                        </label>
                        <input
                            className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-gray-900 font-medium placeholder-gray-400 focus:ring-2 focus:ring-indigo-100 transition-all hover:bg-gray-100"
                            placeholder={t('timer.subjectPlaceholder', "What are you working on?")}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="group/input">
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider group-focus-within/input:text-indigo-600 transition-colors">
                                <Tag className="w-4 h-4" /> {t('timer.category', "Category")}
                            </label>
                            <button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent any form submission or label bubbling
                                    setIsManaging(!isManaging);
                                }}
                                className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-colors ${isManaging ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {isManaging ? <Check className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                                {isManaging ? t('common.done', 'Done') : t('common.edit', 'Edit')}
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {categories.map((cat) => (
                                <div
                                    key={cat}
                                    onClick={() => !isManaging && setCategory(cat)}
                                    className={`relative text-sm px-3 py-2 rounded-lg border transition-all truncate flex items-center justify-between gap-2 select-none ${category === cat && !isManaging
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-md shadow-purple-200'
                                        : 'bg-white border-gray-200 text-gray-600'
                                        } ${!isManaging ? 'hover:border-indigo-200 hover:bg-gray-50 cursor-pointer' : ''} ${isManaging ? 'ring-1 ring-red-100 border-red-200 bg-red-50/10' : ''}`}
                                >
                                    <span className={`truncate ${isManaging ? 'text-gray-400' : ''}`}>{t(`timer.categories.${cat}`, cat)}</span>
                                    {isManaging && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCategory(cat, e);
                                            }}
                                            className="p-1 -mr-1 rounded-full hover:bg-red-100 text-red-400 hover:text-red-500 transition-colors z-10"
                                            title={t('common.delete', 'Delete')}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {/* Add Category Button - Hide in Manage Mode */}
                            {!isManaging && (
                                <button
                                    onClick={() => setIsAddingCategory(true)}
                                    className="text-sm px-3 py-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center font-bold"
                                    title="Add Category"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add Category Modal */}
                <AnimatePresence>
                    {isAddingCategory && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white w-full max-w-xs shadow-2xl rounded-2xl border border-gray-100 p-6"
                            >
                                <h4 className="text-lg font-bold text-gray-900 mb-4">{t('timer.addCategory', 'Add Category')}</h4>
                                <input
                                    autoFocus
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder={t('timer.categoryNamePlaceholder', "Category Name")}
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setIsAddingCategory(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                    >
                                        {t('common.cancel', 'Cancel')}
                                    </button>
                                    <button
                                        onClick={handleAddCategory}
                                        disabled={!newCategoryName.trim()}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {t('timer.add', 'Add')}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <Button
                    onClick={handleStart}
                    className="w-full justify-center py-4 mt-6 text-lg font-semibold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all"
                >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    {t('timer.start', "Start Session")}
                </Button>
            </div>
        </div>
    );
};

export default StudyTimer;
