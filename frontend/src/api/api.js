import api from "../services/api";

export const getUserProfile = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const getRecords = async () => {
    const res = await api.get("/records");
    return res.data;
};

export const getLeaderboard = async () => {
    const res = await api.get("/records/leaderboard");
    return res.data;
};

export const createRecord = async (data) => {
    const res = await api.post("/records", data);
    return res.data;
};

export const deleteRecord = async (id) => {
    const res = await api.delete(`/records/${id}`);
    return res.data;
};

// Kept for backward compatibility if any, though likely unused now
export const loginUser = async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
};
