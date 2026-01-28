import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import LanguageToggle from "../components/LanguageToggle";
import { useTranslation } from "react-i18next";

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/auth/login", form);
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data?.message || t('auth.loginFailed', "Login failed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 bg-size-200 animate-gradient-xy py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                {/* Floating Orbs */}
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-indigo-300/30 to-purple-300/30 blur-3xl animate-float" style={{ animationDelay: '0s' }} />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-l from-indigo-400/20 to-blue-300/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-t from-amber-200/20 to-indigo-200/20 blur-3xl animate-float" style={{ animationDelay: '4s' }} />

                {/* Moving Objects (Shapes) */}
                <div className="absolute top-20 left-10 w-16 h-16 border-4 border-white/20 rounded-xl animate-float animate-spin-slow" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-32 right-20 w-24 h-24 border-4 border-white/20 rounded-full animate-float" style={{ animationDelay: '3s', animationDuration: '8s' }} />
                <div className="absolute top-1/2 left-20 w-12 h-12 bg-white/10 rounded-lg rotate-45 animate-float" style={{ animationDelay: '5s' }} />
                <div className="absolute bottom-10 left-1/2 w-20 h-20 border-t-4 border-l-4 border-white/20 rounded-tl-3xl animate-spin-slow" style={{ animationDelay: '2s', animationDuration: '15s' }} />
            </div>

            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20">
                <LanguageToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {t('auth.loginTitle', "Sign in to your account")}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {t('auth.loginSubtitle', "Welcome back to StudyTrack Pro")}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label={t('auth.email', "Email address")}
                            name="email"
                            type="email"
                            placeholder={t('auth.emailPlaceholder', "Enter your email")}
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label={t('auth.password', "Password")}
                            name="password"
                            type="password"
                            placeholder={t('auth.passwordPlaceholder', "Enter your password")}
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2.5"
                    >
                        {loading ? t('auth.signingIn', "Signing in...") : t('auth.signIn', "Sign in")}
                    </Button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        {t('auth.noAccount', "Don't have an account?")}{" "}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
                            {t('auth.registerHere', "Register here")}
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
