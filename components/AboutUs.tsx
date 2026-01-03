import React from 'react';
import { Icon } from './Icon';
import { useTranslations } from '../hooks/useTranslations';
import type { Language } from '../types';

interface AboutUsProps {
    language: Language;
    onBack: () => void;
}

const InfoSection: React.FC<{ title: string; children: React.ReactNode; icon: any; variant?: 'default' | 'highlight' }> = ({ title, children, icon, variant = 'default' }) => (
    <div className={`p-10 rounded-[40px] shadow-lg border transition-all duration-500 hover:shadow-2xl ${
        variant === 'highlight' 
        ? 'bg-brand-green-50 border-brand-green-100 dark:bg-brand-green-900/10 dark:border-brand-green-800' 
        : 'bg-white border-gray-100 dark:bg-brand-brown-900 dark:border-brand-brown-800'
    }`}>
        <div className="flex items-center gap-6 mb-8">
            <div className={`p-4 rounded-2xl ${
                variant === 'highlight' ? 'bg-brand-green-600 text-white' : 'bg-brand-green-50 dark:bg-brand-green-900/20 text-brand-green-600 dark:text-brand-green-400'
            }`}>
                <Icon name={icon} className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-[#104b5c] dark:text-brand-green-400 tracking-tight">{title}</h3>
        </div>
        <div className="text-xl text-brand-brown-700 dark:text-brand-brown-300 leading-relaxed font-medium">
            {children}
        </div>
    </div>
);

const ValueCard: React.FC<{ title: string; desc: string; icon: any }> = ({ title, desc, icon }) => (
    <div className="group p-8 bg-white dark:bg-brand-brown-900 rounded-3xl border border-gray-100 dark:border-brand-brown-800 transition-all hover:-translate-y-2">
        <Icon name={icon} className="w-10 h-10 text-brand-green-600 dark:text-brand-green-400 mb-6 group-hover:scale-110 transition-transform" />
        <h4 className="text-2xl font-black text-[#104b5c] dark:text-brand-green-400 mb-3">{title}</h4>
        <p className="text-brand-brown-600 dark:text-brand-brown-400 font-medium leading-relaxed">{desc}</p>
    </div>
);

export const AboutUs: React.FC<AboutUsProps> = ({ language, onBack }) => {
    const t = useTranslations(language);

    return (
        <div className="animate-fade-in space-y-16 pb-24">
            {/* Header */}
            <div className="flex items-center">
                <button
                    onClick={onBack}
                    className="p-4 mr-6 rounded-2xl bg-white dark:bg-brand-brown-900 shadow-sm border border-gray-100 dark:border-brand-brown-800 hover:bg-brand-brown-100 transition-all"
                >
                    <Icon name="arrow-left" className="w-8 h-8 text-[#104b5c] dark:text-brand-brown-200" />
                </button>
                <div className="flex flex-col">
                    <span className="text-brand-green-600 dark:text-brand-green-400 font-black uppercase tracking-widest text-sm mb-1">Our Journey</span>
                    <h2 className="text-5xl font-black text-[#104b5c] dark:text-brand-green-400 tracking-tighter">
                        {t.nav_about}
                    </h2>
                </div>
            </div>

            {/* Mission & Dev Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <InfoSection title={t.about_mission_title} icon="leaf">
                    <p>{t.about_mission_desc}</p>
                    <div className="mt-8 flex gap-4">
                        <div className="px-4 py-2 bg-[#104b5c] text-white rounded-lg text-sm font-bold">Innovation</div>
                        <div className="px-4 py-2 bg-brand-green-500 text-white rounded-lg text-sm font-bold">Welfare</div>
                        <div className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold">Growth</div>
                    </div>
                </InfoSection>

                <InfoSection title={t.about_dev_title} icon="dna" variant="highlight">
                    <p>{t.about_dev_desc}</p>
                    <div className="mt-8 p-8 bg-white dark:bg-brand-brown-800 rounded-3xl border border-brand-green-100 dark:border-brand-green-700 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-2 h-8 bg-brand-green-600 rounded-full"></div>
                            <p className="text-sm font-black uppercase tracking-widest text-brand-brown-400">Institutional Hub</p>
                        </div>
                        <p className="text-3xl font-black text-[#104b5c] dark:text-brand-green-400 leading-tight">BMS Institute of Technology & Management</p>
                        <p className="text-xl font-bold text-brand-brown-600 dark:text-brand-brown-400 mt-2">Department of Computer Science & Engineering</p>
                    </div>
                </InfoSection>
            </div>

            {/* Core Values Section */}
            <section className="py-12">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-3 h-10 bg-amber-500 rounded-full"></div>
                    <h3 className="text-3xl font-black text-[#104b5c] dark:text-brand-green-400">Our Core Principles</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ValueCard 
                        title="AI-Driven" 
                        desc="Harnessing deep learning to automate complex livestock identification tasks." 
                        icon="microscope" 
                    />
                    <ValueCard 
                        title="Farmer First" 
                        desc="Designing interfaces that work in the field, even with low connectivity or literacy." 
                        icon="users" 
                    />
                    <ValueCard 
                        title="Data Integrity" 
                        desc="Ensuring every record of your herd is secure, immutable, and easily accessible." 
                        icon="shield-check" 
                    />
                    <ValueCard 
                        title="Sustainability" 
                        desc="Promoting healthy breeding practices to ensure the future of Indian dairy." 
                        icon="leaf" 
                    />
                </div>
            </section>

            {/* Comparison Section */}
            <div className="bg-[#104b5c] rounded-[60px] p-16 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green-400/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                        <div className="flex items-center gap-6">
                            <div className="bg-white/10 p-5 rounded-[28px] backdrop-blur-xl border border-white/20">
                                <Icon name="chart-bar" className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-5xl font-black tracking-tighter max-w-lg leading-[1.1]">{t.about_comp_title}</h3>
                        </div>
                        <div className="hidden lg:block h-px flex-grow bg-white/10 mx-10"></div>
                        <div className="bg-white/10 px-8 py-4 rounded-full backdrop-blur-md border border-white/10 text-xl font-bold">
                            Powered by Gemini 2.5
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="group space-y-6 p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="h-1.5 w-16 bg-brand-green-400 rounded-full"></div>
                            <h4 className="text-2xl font-black">Zero Manual Entry</h4>
                            <p className="text-white/70 font-medium text-lg leading-relaxed">Pashudhan uses real-time Computer Vision. Just point your camera, and we handle the identification. No more typos or confusing government forms.</p>
                        </div>
                        <div className="group space-y-6 p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="h-1.5 w-16 bg-amber-400 rounded-full"></div>
                            <h4 className="text-2xl font-black">Ultra-Fluid Experience</h4>
                            <p className="text-white/70 font-medium text-lg leading-relaxed">Unlike legacy portals with heavy loading screens, Pashudhan is built as a PWA (Progressive Web App), ensuring lightning-fast performance on any network.</p>
                        </div>
                        <div className="group space-y-6 p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="h-1.5 w-16 bg-sky-400 rounded-full"></div>
                            <h4 className="text-2xl font-black">Predictive Insights</h4>
                            <p className="text-white/70 font-medium text-lg leading-relaxed">We don't just store data; we analyze it. Our system predicts future milk yields and sends proactive vaccination alerts before health issues arise.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Tagline */}
            <div className="text-center py-12">
                <p className="text-brand-brown-400 font-bold uppercase tracking-[0.3em] text-sm mb-4">Final Year Engineering Project</p>
                <div className="flex justify-center items-center gap-4">
                    <div className="h-px w-12 bg-gray-200"></div>
                    <Icon name="cow" className="w-8 h-8 text-brand-green-600 opacity-50" />
                    <div className="h-px w-12 bg-gray-200"></div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    );
};