import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, BookOpen, ArrowRight, Upload } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import LanguageToggle from "../components/LanguageToggle";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("password", formData.password);
            if (file) {
                data.append("profile_picture", file);
            }

            await axios.post("http://localhost:3001/api/auth/register", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 bg-size-200 animate-gradient-xy flex flex-col justify-center sm:px-6 lg:px-8 relative overflow-hidden">
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

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <BookOpen className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {t('auth.registerTitle', "Create your account")}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {t('auth.or', "Or")}{" "}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        {t('auth.registerSubtitle', "sign in to your account")}
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {error}
                            </div>
                        )}

                        <Input
                            label={t('auth.fullName', "Full Name")}
                            type="text"
                            icon={User}
                            placeholder={t('auth.fullNamePlaceholder', "John Doe")}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            maxLength={30}
                        />

                        <Input
                            label={t('auth.email', "Email address")}
                            type="email"
                            icon={Mail}
                            placeholder={t('auth.emailPlaceholder', "you@example.com")}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            maxLength={50}
                        />

                        <Input
                            label={t('auth.password', "Password")}
                            type="password"
                            icon={Lock}
                            placeholder={t('auth.passwordPlaceholderConfirm', "••••••••")}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            maxLength={30}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('auth.profilePicture', "Profile Picture (Optional)")}
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors bg-gray-50 hover:bg-indigo-50/50 cursor-pointer relative">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                            <span>{t('auth.uploadFile', "Upload a file")}</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">{t('auth.fileHelp', "PNG, JPG, GIF up to 5MB")}</p>
                                    {file && <p className="text-sm text-indigo-600 font-semibold">{file.name}</p>}
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full justify-center" loading={loading}>
                            {t('auth.createAccount', "Create Account")} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
