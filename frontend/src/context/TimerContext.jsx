import React, { createContext, useContext, useState, useEffect } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    // Persistent State
    const [isActive, setIsActive] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);

    // Core Timer Logic
    // Store as separate atoms to avoid interval drift and allow resumption
    const [elapsedTime, setElapsedTime] = useState(0); // Time accumulated before current active session
    const [startTime, setStartTime] = useState(null); // Timestamp when current session started

    // Metadata
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("General");

    // Calculated Value for Display
    const [displaySeconds, setDisplaySeconds] = useState(0);

    // Sync loop: Update displaySeconds every second if active
    useEffect(() => {
        let interval = null;
        if (isActive && startTime) {
            // Update immediately to avoid lag
            const updateTime = () => {
                const now = Date.now();
                const sessionSeconds = Math.floor((now - startTime) / 1000);
                setDisplaySeconds(elapsedTime + sessionSeconds);
            };

            updateTime();
            interval = setInterval(updateTime, 1000);
        } else {
            // If paused/stopped, just show elapsed
            setDisplaySeconds(elapsedTime);
        }
        return () => clearInterval(interval);
    }, [isActive, startTime, elapsedTime]);


    const startSession = (subj, cat) => {
        if (subj) setSubject(subj);
        if (cat) setCategory(cat);

        setIsFocusMode(true);
        setIsActive(true);
        setStartTime(Date.now());
    };

    const pauseSession = () => {
        setIsActive(false);
        if (startTime) {
            const now = Date.now();
            const sessionSeconds = Math.floor((now - startTime) / 1000);
            setElapsedTime(prev => prev + sessionSeconds);
            setStartTime(null);
        }
    };

    const resumeSession = () => {
        setIsActive(true);
        setStartTime(Date.now());
    };

    const stopSession = () => {
        // Calculate final total time
        let total = elapsedTime;
        if (isActive && startTime) {
            const now = Date.now();
            total += Math.floor((now - startTime) / 1000);
        }

        const data = {
            title: subject,
            category,
            duration: Math.round(total / 60), // minutes
            rawSeconds: total
        };

        resetSession();
        return data;
    };

    const resetSession = () => {
        setIsActive(false);
        setIsFocusMode(false);
        setStartTime(null);
        setElapsedTime(0);
        setSubject("");
        setCategory("General");
        setDisplaySeconds(0);
    };

    const value = {
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
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error("useTimer must be used within a TimerProvider");
    }
    return context;
};
