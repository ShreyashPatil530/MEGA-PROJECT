import React from 'react';
import { BarChart3, Cpu, Database, CheckCircle, ArrowRight, TableProperties } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Navbar Minimal */}
            <nav className="bg-white border-b border-gray-200 py-4 px-6 sm:px-8 lg:px-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Sales & Reviews Insights</span>
                </div>
                <button
                    onClick={onStart}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                >
                    Go to Dashboard
                </button>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
                {/* Decorative background shapes */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                        Production Ready v1.0
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
                        Analyze datasets with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            AI-Powered Precision
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Upload your CSV files to instantly generate real-time visual insights, automated data cleaning, and comprehensive AI reports—all in one place.
                    </p>

                    <button
                        onClick={onStart}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg border border-transparent font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Start Exploring Data
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>

                {/* Features Grid */}
                <div className="relative z-10 max-w-7xl mx-auto mt-24 mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                    <FeatureCard
                        icon={<TableProperties className="w-8 h-8 text-blue-500" />}
                        title="CSV Processing"
                        description="Drag & drop your datasets. Automatically detect schemas, outliers, and duplicates."
                    />
                    <FeatureCard
                        icon={<BarChart3 className="w-8 h-8 text-indigo-500" />}
                        title="Real-time Visuals"
                        description="View instant interactive charts and distributions of your numeric and categorical data."
                    />
                    <FeatureCard
                        icon={<Cpu className="w-8 h-8 text-purple-500" />}
                        title="Groq AI Reports"
                        description="Generate beautifully formatted markdown analytical reports using LLaMA-3.1."
                    />
                    <FeatureCard
                        icon={<CheckCircle className="w-8 h-8 text-emerald-500" />}
                        title="Data Cleaning"
                        description="Click a button to strip out entirely empty rows and identical duplicates. Download the cleaned file."
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8 px-6 text-center">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Sales & Reviews Insights. Enterprise Grade Analytics.
                </p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-left">
        <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);

export default LandingPage;
