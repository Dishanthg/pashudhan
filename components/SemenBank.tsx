
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import type { MilkEntry, Language, Animal, VaccinationEntry } from '../types';
import { useTranslations } from '../hooks/useTranslations';
// Added import for TranslationStrings to fix compilation error
import type { TranslationStrings } from '../data/translations';
import { ErrorMessage } from './ErrorMessage';
import { initialVaccinationData } from '../data/vaccinationData';

// Color palette for multiple series
const CHART_COLORS = [
    '#059669', // Emerald
    '#2563eb', // Blue
    '#d97706', // Amber
    '#7c3aed', // Purple
    '#db2777', // Pink
    '#4b5563', // Gray
];

const initialMilkProductionData: MilkEntry[] = [
  { animalTagId: 'IN001234', date: '2025-09-16', liters: 11.5 },
  { animalTagId: 'IN001234', date: '2025-09-17', liters: 11.2 },
  { animalTagId: 'IN001234', date: '2025-09-18', liters: 12.0 },
  { animalTagId: 'IN005678', date: '2025-09-16', liters: 14.5 },
  { animalTagId: 'IN005678', date: '2025-09-17', liters: 14.2 },
  { animalTagId: 'IN005678', date: '2025-09-18', liters: 15.0 },
  { animalTagId: 'IN009012', date: '2025-09-16', liters: 9.5 },
  { animalTagId: 'IN009012', date: '2025-09-17', liters: 10.2 },
  { animalTagId: 'IN009012', date: '2025-09-18', liters: 10.0 },
];

interface ProductionChartProps {
  entries: MilkEntry[];
  herd: Animal[];
  language: Language;
}

const MultiHerdProductionChart: React.FC<ProductionChartProps> = ({ entries, herd, language }) => {
    const t = useTranslations(language);
    const width = 600;
    const height = 280;
    const margin = { top: 30, right: 120, bottom: 50, left: 40 };

    const { groupedData, xLabels, yAxisLabels, animalsInChart } = useMemo(() => {
        if (entries.length === 0) return { groupedData: {}, xLabels: [], yAxisLabels: [], yMax: 20, animalsInChart: [] };

        const groups: Record<string, MilkEntry[]> = {};
        const datesSet = new Set<string>();
        
        entries.forEach(e => {
            if (!groups[e.animalTagId]) groups[e.animalTagId] = [];
            groups[e.animalTagId].push(e);
            datesSet.add(e.date);
        });

        const sortedDates = Array.from(datesSet).sort();
        const allLiters = entries.map(e => e.liters);
        const yMax = Math.ceil(Math.max(...allLiters) + 2);

        const getX = (dateStr: string) => {
            const index = sortedDates.indexOf(dateStr);
            return margin.left + (index / Math.max(1, sortedDates.length - 1)) * (width - margin.left - margin.right);
        };
        const getY = (val: number) => height - margin.bottom - (val / yMax) * (height - margin.top - margin.bottom);

        const plotData: Record<string, string> = {};
        Object.keys(groups).forEach(tagId => {
            const animalEntries = [...groups[tagId]].sort((a, b) => a.date.localeCompare(b.date));
            plotData[tagId] = animalEntries.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.date)} ${getY(d.liters)}`).join(' ');
        });

        const animalsInChart = Object.keys(groups).map(tagId => herd.find(a => a.tagId === tagId)).filter(Boolean) as Animal[];

        const yAxisLabels = [];
        for (let i = 0; i <= yMax; i += Math.ceil(yMax / 5)) {
            yAxisLabels.push({ value: i, y: getY(i) });
        }

        return { groupedData: plotData, xLabels: sortedDates, yAxisLabels, yMax, animalsInChart };
    }, [entries, herd]);

    if (entries.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-brand-brown-50 dark:bg-brand-brown-800/50 rounded-2xl border-2 border-dashed border-brand-brown-200 dark:border-brand-brown-700">
                <p className="text-brand-brown-600 dark:text-brand-brown-400 font-bold">{t.reports_no_data}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-brand-brown-950 p-4 rounded-2xl border border-brand-brown-100 dark:border-brand-brown-800 shadow-inner overflow-x-auto">
                <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[500px] h-auto">
                    {yAxisLabels.map(label => (
                        <g key={label.value}>
                            <line x1={margin.left} y1={label.y} x2={width - margin.right} y2={label.y} className="stroke-brand-brown-100 dark:stroke-brand-brown-800" strokeWidth="1" strokeDasharray="4" />
                            <text x={margin.left - 10} y={label.y + 4} textAnchor="end" fontSize="10" className="fill-brand-brown-400 font-bold tabular-nums">{label.value}L</text>
                        </g>
                    ))}

                    {xLabels.map((date, i) => {
                        const showLabel = xLabels.length <= 7 || i === 0 || i === xLabels.length - 1 || i === Math.floor(xLabels.length / 2);
                        if (!showLabel) return null;
                        const x = margin.left + (i / Math.max(1, xLabels.length - 1)) * (width - margin.left - margin.right);
                        return (
                            <text key={date} x={x} y={height - margin.bottom + 20} textAnchor="middle" fontSize="10" className="fill-brand-brown-500 font-bold">
                                {new Date(date).toLocaleDateString(language, { month: 'short', day: 'numeric' })}
                            </text>
                        );
                    })}

                    {Object.keys(groupedData).map((tagId, index) => (
                        <path 
                            key={tagId} 
                            d={groupedData[tagId]} 
                            fill="none" 
                            stroke={CHART_COLORS[index % CHART_COLORS.length]} 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    ))}
                </svg>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
                {animalsInChart.map((animal, index) => (
                    <div key={animal.tagId} className="flex items-center gap-2 bg-white dark:bg-brand-brown-900 px-4 py-2 rounded-xl shadow-sm border border-brand-brown-100 dark:border-brand-brown-800">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                        <span className="text-sm font-black text-brand-brown-900 dark:text-brand-brown-100">{animal.breed}</span>
                        <span className="text-xs font-bold text-brand-brown-400 tabular-nums">({animal.tagId})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SemenBank: React.FC<{ herd: Animal[]; onBack: () => void; language: Language; }> = ({ herd, onBack, language }) => {
    const [activeTab, setActiveTab] = useState<'production' | 'vaccination'>('production');
    const [milkEntries, setMilkEntries] = useState<MilkEntry[]>(initialMilkProductionData);
    const [vaccEntries, setVaccEntries] = useState<VaccinationEntry[]>(initialVaccinationData);
    
    // Form States
    const [selectedTagId, setSelectedTagId] = useState<string>('');
    const [date, setDate] = useState('');
    const [liters, setLiters] = useState('');
    const [vaccName, setVaccName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dose, setDose] = useState('');
    const [notes, setNotes] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    
    const t = useTranslations(language);
    const selectedAnimal = useMemo(() => herd.find(a => a.tagId === selectedTagId), [herd, selectedTagId]);

    const handleMilkSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);
        if (!selectedTagId) return setValidationError("Please select an animal.");
        const val = parseFloat(liters);
        if (!date || isNaN(val) || val <= 0) return setValidationError(t.reports_alert_invalid_input);
        const selDate = new Date(date);
        if (selDate > new Date()) return setValidationError("Date cannot be in future.");
        if (selectedAnimal && selDate < new Date(selectedAnimal.registrationDate)) return setValidationError("Date before registration.");
        if (milkEntries.some(e => e.animalTagId === selectedTagId && e.date === date)) return setValidationError("Record already exists.");

        setMilkEntries(prev => [...prev, { animalTagId: selectedTagId, date, liters: val }]);
        setLiters('');
    };

    const handleVaccSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);
        if (!selectedTagId) return setValidationError("Please select an animal.");
        if (!vaccName || !date || !dose) return setValidationError("Missing required fields.");
        
        const vaccDate = new Date(date);
        const nextDate = dueDate ? new Date(dueDate) : null;
        const today = new Date();

        if (vaccDate > today) return setValidationError("Vaccination date cannot be in future.");
        if (selectedAnimal && vaccDate < new Date(selectedAnimal.registrationDate)) return setValidationError("Date before registration.");
        if (nextDate && nextDate <= vaccDate) return setValidationError("Due date must be after vaccination date.");

        const newEntry: VaccinationEntry = {
            id: `vacc_${Date.now()}`,
            animalTagId: selectedTagId,
            vaccineName: vaccName,
            date: date,
            dueDate: dueDate || undefined,
            doseNumber: dose,
            notes: notes,
        };

        setVaccEntries(prev => [...prev, newEntry]);
        setVaccName('');
        setDueDate('');
        setDose('');
        setNotes('');
    };

    const getVaccStatus = (dueDate?: string) => {
        if (!dueDate) return 'completed';
        const d = new Date(dueDate);
        const now = new Date();
        const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'overdue';
        if (diffDays <= 15) return 'due_soon';
        return 'upcoming';
    };

    return (
        <div className="w-full max-w-5xl space-y-10 animate-fade-in mx-auto px-4">
            {/* Header with Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-4 mr-4 rounded-2xl bg-white dark:bg-brand-brown-900 shadow-sm border border-gray-100 dark:border-brand-brown-800 hover:bg-brand-brown-100 transition-all">
                        <Icon name="arrow-left" className="w-6 h-6 text-[#104b5c] dark:text-brand-brown-200" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-[#104b5c] dark:text-brand-green-400 tracking-tighter">Herd Management</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1 w-8 bg-brand-green-500 rounded-full"></div>
                            <span className="text-brand-brown-500 font-bold uppercase tracking-widest text-[10px]">Analytics & Health</span>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="bg-brand-brown-50 dark:bg-brand-brown-900 p-1.5 rounded-2xl flex items-center shadow-inner border border-brand-brown-100 dark:border-brand-brown-800">
                    <button 
                        onClick={() => setActiveTab('production')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${activeTab === 'production' ? 'bg-white dark:bg-brand-brown-800 text-[#104b5c] shadow-md scale-[1.02]' : 'text-brand-brown-400 hover:text-brand-brown-600'}`}
                    >
                        <Icon name="milk" className="w-4 h-4" />
                        {t.reports_milk_tracker_title}
                    </button>
                    <button 
                        onClick={() => setActiveTab('vaccination')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${activeTab === 'vaccination' ? 'bg-white dark:bg-brand-brown-800 text-[#104b5c] shadow-md scale-[1.02]' : 'text-brand-brown-400 hover:text-brand-brown-600'}`}
                    >
                        <Icon name="shield-check" className="w-4 h-4" />
                        {t.nav_vaccination}
                    </button>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                
                {/* Form Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-brand-brown-900 p-8 rounded-[40px] border border-gray-100 dark:border-brand-brown-800 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-brand-green-500/20"></div>
                        <h3 className="text-2xl font-black text-brand-brown-900 dark:text-brand-brown-100 mb-8 flex items-center gap-3">
                            {activeTab === 'production' ? t.reports_add_entry_title : t.vacc_add_entry}
                        </h3>

                        <form onSubmit={activeTab === 'production' ? handleMilkSubmit : handleVaccSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-brand-brown-400 uppercase tracking-[0.2em]">{t.vacc_herd_label}</label>
                                <select 
                                    value={selectedTagId} onChange={e => setSelectedTagId(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-brand-brown-50 dark:bg-brand-brown-800 border-2 border-transparent focus:border-brand-green-500 rounded-2xl text-base font-bold outline-none transition-all dark:text-white"
                                >
                                    <option value="">-- Choose Animal --</option>
                                    {herd.map(a => <option key={a.tagId} value={a.tagId}>{a.breed} ({a.tagId})</option>)}
                                </select>
                            </div>

                            {activeTab === 'production' ? (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-brand-brown-400 uppercase tracking-[0.2em]">{t.reports_date_label}</label>
                                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-5 py-3.5 bg-brand-brown-50 dark:bg-brand-brown-800 border-2 border-transparent focus:border-brand-green-500 rounded-2xl text-base font-bold outline-none transition-all dark:text-white" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-brand-brown-400 uppercase tracking-[0.2em]">{t.reports_liters_label}</label>
                                        <div className="relative">
                                            <input type="number" step="0.1" placeholder="0.0" value={liters} onChange={e => setLiters(e.target.value)} className="w-full px-5 py-3.5 bg-brand-brown-50 dark:bg-brand-brown-800 border-2 border-transparent focus:border-brand-green-500 rounded-2xl text-lg font-black outline-none transition-all dark:text-white" />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-brown-300 font-black">LITERS</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-brand-brown-400 uppercase tracking-[0.2em]">{t.vacc_name_label}</label>
                                        <input type="text" placeholder={t.vacc_vaccine_placeholder} value={vaccName} onChange={e => setVaccName(e.target.value)} className="w-full px-5 py-3.5 bg-brand-brown-50 dark:bg-brand-brown-800 border-2 border-transparent focus:border-brand-green-500 rounded-2xl text-base font-bold outline-none transition-all dark:text-white" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-brand-brown-400 uppercase tracking-[0.2em]">{t.vacc_date_label}</label>
                                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-brand-brown-50 dark:bg-brand-brown-800 border-2 border-transparent focus:border-brand-green-500 rounded-2xl text-sm font-bold outline-none transition-all dark:text-white" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-brand-brown-400 uppercase tracking-[0.2em]">{t.vacc_due_date_label}</label>
                                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-4 py-3 bg-brand-brown-50 dark:bg-brand-brown-800 border-2 border-transparent focus:border-brand-green-500 rounded-2xl text-sm font-bold outline-none transition-all dark:text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-brand-brown-400 uppercase tracking-[0.2em]">{t.vacc_dose_label}</label>
                                        <select value={dose} onChange={e => setDose(e.target.value)} className="w-full px-5 py-3.5 bg-brand-brown-50 dark:bg-brand-brown-800 border-2 border-transparent focus:border-brand-green-500 rounded-2xl text-base font-bold outline-none transition-all dark:text-white">
                                            <option value="">-- Choose Dose --</option>
                                            <option value="1st">1st Dose</option>
                                            <option value="2nd">2nd Dose</option>
                                            <option value="Booster">Booster</option>
                                            <option value="Annual">Annual</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-brand-brown-400 uppercase tracking-[0.2em]">{t.vacc_notes_label}</label>
                                        <input type="text" placeholder={t.vacc_notes_placeholder} value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-5 py-3.5 bg-brand-brown-50 dark:bg-brand-brown-800 border-2 border-transparent focus:border-brand-green-500 rounded-2xl text-base font-bold outline-none transition-all dark:text-white" />
                                    </div>
                                </>
                            )}

                            <ErrorMessage message={validationError} />
                            <button type="submit" className="w-full py-4 bg-[#104b5c] text-white text-lg font-black rounded-[20px] shadow-lg hover:bg-[#155a6e] transition-all transform active:scale-95 flex items-center justify-center gap-3">
                                <Icon name="plus-circle" className="w-5 h-5" />
                                {t.add} {activeTab === 'production' ? 'Production' : 'Vaccination'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'production' ? (
                        <>
                            <div className="bg-white dark:bg-brand-brown-900 p-8 rounded-[40px] border border-gray-100 dark:border-brand-brown-800 shadow-xl">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black text-[#104b5c] dark:text-brand-green-400">{t.reports_production_trend_title}</h3>
                                    <div className="bg-brand-green-50 dark:bg-brand-brown-800 px-4 py-1.5 rounded-full text-[10px] font-black text-brand-green-700 uppercase tracking-widest border border-brand-green-100">Live Trend Analysis</div>
                                </div>
                                <MultiHerdProductionChart entries={milkEntries} herd={herd} language={language} />
                            </div>

                            <div className="bg-white dark:bg-brand-brown-900 p-8 rounded-[40px] border border-gray-100 dark:border-brand-brown-800 shadow-xl">
                                <h3 className="text-2xl font-black text-brand-brown-900 dark:text-brand-brown-100 mb-8">{t.reports_production_log_title}</h3>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {[...milkEntries].sort((a,b) => b.date.localeCompare(a.date)).map((e) => {
                                        const animal = herd.find(a => a.tagId === e.animalTagId);
                                        return (
                                            <div key={`${e.animalTagId}-${e.date}`} className="flex items-center justify-between p-5 bg-brand-brown-50 dark:bg-brand-brown-800/40 rounded-[28px] border border-transparent hover:border-brand-green-100 transition-all group">
                                                <div className="flex items-center gap-5">
                                                    <div className="bg-white dark:bg-brand-brown-900 w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center font-black text-brand-green-600 text-lg">{e.liters}L</div>
                                                    <div>
                                                        <p className="font-black text-brand-brown-900 dark:text-brand-brown-100">{animal?.breed}</p>
                                                        <p className="text-[10px] font-bold text-brand-brown-400 uppercase tracking-wider">{e.date} • #{e.animalTagId}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setMilkEntries(prev => prev.filter(x => !(x.animalTagId === e.animalTagId && x.date === e.date)))} className="p-2 text-brand-brown-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Icon name="x-mark" className="w-5 h-5" /></button>
                                            </div>
                                        );
                                    })}
                                    {milkEntries.length === 0 && <p className="text-center py-10 text-brand-brown-400 font-bold italic">No records found.</p>}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Vaccination Management View */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-[#eefcf3] p-6 rounded-[32px] border border-[#d6f3e0] text-[#1a5b33]">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Vaccinations</p>
                                    <p className="text-4xl font-black">{vaccEntries.length}</p>
                                </div>
                                <div className="bg-[#fef9c3] p-6 rounded-[32px] border border-[#fef08a] text-[#854d0e]">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Pending Doses</p>
                                    <p className="text-4xl font-black">{vaccEntries.filter(e => e.dueDate && getVaccStatus(e.dueDate) !== 'completed').length}</p>
                                </div>
                                <div className="bg-[#fef2f2] p-6 rounded-[32px] border border-[#fee2e2] text-[#991b1b]">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Critical Alerts</p>
                                    <p className="text-4xl font-black">{vaccEntries.filter(e => e.dueDate && getVaccStatus(e.dueDate) === 'overdue').length}</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-brand-brown-900 p-8 rounded-[40px] border border-gray-100 dark:border-brand-brown-800 shadow-xl">
                                <h3 className="text-2xl font-black text-[#104b5c] dark:text-brand-green-400 mb-8">{t.vacc_title} Log</h3>
                                <div className="space-y-6">
                                    {herd.map(animal => {
                                        const animalVaccs = vaccEntries.filter(v => v.animalTagId === animal.tagId).sort((a,b) => b.date.localeCompare(a.date));
                                        if (animalVaccs.length === 0) return null;
                                        return (
                                            <div key={animal.tagId} className="space-y-4">
                                                <div className="flex items-center gap-3 ml-2">
                                                    <div className="w-1.5 h-6 bg-brand-green-500 rounded-full"></div>
                                                    <h4 className="text-xl font-black text-brand-brown-800 dark:text-brand-brown-200">{animal.breed} <span className="text-brand-brown-400 font-bold">#{animal.tagId}</span></h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {animalVaccs.map(v => {
                                                        const status = getVaccStatus(v.dueDate);
                                                        return (
                                                            <div key={v.id} className="bg-brand-brown-50 dark:bg-brand-brown-800/40 p-6 rounded-3xl border border-transparent hover:border-brand-green-200 transition-all group relative">
                                                                <div className="flex items-start justify-between mb-4">
                                                                    <div className="bg-white dark:bg-brand-brown-900 p-2.5 rounded-xl shadow-sm">
                                                                        <Icon name="shield-check" className="w-5 h-5 text-brand-green-600" />
                                                                    </div>
                                                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                        status === 'overdue' ? 'bg-red-100 text-red-700' :
                                                                        status === 'due_soon' ? 'bg-amber-100 text-amber-700' :
                                                                        status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                                                        'bg-green-100 text-green-700'
                                                                    }`}>
                                                                        {t[`vacc_status_${status}` as keyof TranslationStrings]}
                                                                    </div>
                                                                </div>
                                                                <h5 className="text-xl font-black text-brand-brown-900 dark:text-brand-brown-100 mb-1">{v.vaccineName}</h5>
                                                                <p className="text-xs font-bold text-brand-brown-400 uppercase tracking-widest mb-4">{v.doseNumber} Dose</p>
                                                                
                                                                <div className="flex items-center justify-between py-2 border-t border-brand-brown-100 dark:border-brand-brown-700">
                                                                    <span className="text-[10px] font-black text-brand-brown-400 uppercase">Vaccinated</span>
                                                                    <span className="text-sm font-black text-brand-brown-700 dark:text-brand-brown-300">{v.date}</span>
                                                                </div>
                                                                {v.dueDate && (
                                                                    <div className="flex items-center justify-between py-2 border-t border-brand-brown-100 dark:border-brand-brown-700">
                                                                        <span className="text-[10px] font-black text-brand-brown-400 uppercase">Next Due</span>
                                                                        <span className="text-sm font-black text-[#104b5c] dark:text-brand-green-400">{v.dueDate}</span>
                                                                    </div>
                                                                )}
                                                                {v.notes && <p className="mt-3 text-[11px] font-medium text-brand-brown-500 italic">"{v.notes}"</p>}
                                                                
                                                                <button onClick={() => setVaccEntries(prev => prev.filter(x => x.id !== v.id))} className="absolute top-4 right-4 p-2 text-brand-brown-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Icon name="x-mark" className="w-4 h-4" /></button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {vaccEntries.length === 0 && <p className="text-center py-10 text-brand-brown-400 font-bold italic">No vaccination history recorded.</p>}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </div>
    );
};
