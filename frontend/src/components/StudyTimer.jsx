import { useState } from "react";
import { Play, Pause, StopCircle, Award, Timer, Tag, Type } from "lucide-react";
import Button from "./Button";
import { motion, AnimatePresence } from "framer-motion";
import { useTimer } from "../context/TimerContext";

const StudyTimer = ({ onSave }) => {
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
            alert("Please enter a subject to focus on.");
            return;
        }
        startSession(subject, category);
    };

    const handleStop = () => {
        if (displaySeconds < 60) {
            if (confirm("Session less than 1 minute. Discard?")) {
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
                    <h3 className="text-2xl font-bold tracking-tight">Session Complete!</h3>
                    <p className="text-indigo-100 font-medium">Excellent Focus.</p>
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
                            <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider">{category}</span>
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
                        >
                            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                        </button>

                        <button
                            onClick={handleStop}
                            className="group flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 border border-slate-700 hover:border-red-500/50 transition-all"
                            title="End Session"
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
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Ready to Focus?</h3>
                    <p className="text-gray-500">Track your time and earn XP.</p>
                </div>

                <div className="flex-1 space-y-5">
                    <div className="group/input">
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 group-focus-within/input:text-indigo-600 transition-colors">
                            <Type className="w-4 h-4" /> Subject
                        </label>
                        <input
                            className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-gray-900 font-medium placeholder-gray-400 focus:ring-2 focus:ring-indigo-100 transition-all hover:bg-gray-100"
                            placeholder="What are you working on?"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="group/input">
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 group-focus-within/input:text-indigo-600 transition-colors">
                            <Tag className="w-4 h-4" /> Category
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {["General", "Coding", "Math", "Reading", "Science", "Writing"].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`text-sm px-3 py-2 rounded-lg border transition-all ${category === cat
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleStart}
                    className="w-full justify-center py-4 mt-6 text-lg font-semibold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all"
                >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Start Session
                </Button>
            </div>
        </div>
    );
};

export default StudyTimer;
