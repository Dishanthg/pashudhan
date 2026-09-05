import React, { useMemo, useState } from 'react';
import { Icon } from './Icon';
import { ErrorMessage } from './ErrorMessage';
import type { Animal, Language, MilkEntry, VaccinationEntry } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { initialVaccinationData } from '../data/vaccinationData';

const initialMilkEntries: MilkEntry[] = [
  { animalTagId: 'IN001234', date: '2025-09-16', liters: 11.5 },
  { animalTagId: 'IN001234', date: '2025-09-17', liters: 11.2 },
  { animalTagId: 'IN005678', date: '2025-09-16', liters: 14.5 },
  { animalTagId: 'IN005678', date: '2025-09-17', liters: 14.2 },
  { animalTagId: 'IN009012', date: '2025-09-16', liters: 9.5 },
];

interface HerdManagementProps {
  herd: Animal[];
  onBack: () => void;
  language: Language;
}

export const HerdManagement: React.FC<HerdManagementProps> = ({ herd, onBack, language }) => {
  const t = useTranslations(language);
  const [milkEntries, setMilkEntries] = useState<MilkEntry[]>(initialMilkEntries);
  const [vaccinationEntries, setVaccinationEntries] = useState<VaccinationEntry[]>(initialVaccinationData);
  const [selectedTagId, setSelectedTagId] = useState('');
  const [milkDate, setMilkDate] = useState('');
  const [milkLiters, setMilkLiters] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [vaccinationDate, setVaccinationDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [doseNumber, setDoseNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedAnimal = herd.find(animal => animal.tagId === selectedTagId);
  const averageMilk = milkEntries.length > 0
    ? milkEntries.reduce((total, entry) => total + entry.liters, 0) / milkEntries.length
    : 0;

  const getVaccinationStatus = (date?: string) => {
    if (!date) return 'completed';
    const daysUntilDue = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 15) return 'due_soon';
    return 'upcoming';
  };

  const vaccinationSummary = useMemo(() => ({
    overdue: vaccinationEntries.filter(entry => getVaccinationStatus(entry.dueDate) === 'overdue').length,
    upcoming: vaccinationEntries.filter(entry => getVaccinationStatus(entry.dueDate) === 'upcoming').length,
  }), [vaccinationEntries]);

  const validateAnimalDate = (date: string) => {
    if (!selectedTagId) return 'Please select an animal.';
    if (selectedAnimal && new Date(date) < new Date(selectedAnimal.registrationDate)) return 'Date cannot be before registration.';
    return null;
  };

  const handleMilkSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const animalError = validateAnimalDate(milkDate);
    const litersValue = Number(milkLiters);
    if (animalError || !milkDate || !Number.isFinite(litersValue) || litersValue <= 0) {
      setError(animalError || 'Enter a valid milk quantity and date.');
      return;
    }
    if (new Date(milkDate) > new Date() || milkEntries.some(entry => entry.animalTagId === selectedTagId && entry.date === milkDate)) {
      setError('This milk record is invalid or already exists.');
      return;
    }
    setMilkEntries(entries => [...entries, { animalTagId: selectedTagId, date: milkDate, liters: litersValue }]);
    setMilkDate('');
    setMilkLiters('');
  };

  const handleVaccinationSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const animalError = validateAnimalDate(vaccinationDate);
    if (animalError || !vaccineName || !vaccinationDate || !doseNumber) {
      setError(animalError || 'Complete the required vaccination fields.');
      return;
    }
    const nextDueDate = dueDate ? new Date(dueDate) : null;
    const recordedDate = new Date(vaccinationDate);
    if (recordedDate > new Date() || (nextDueDate && nextDueDate <= recordedDate)) {
      setError('Check the vaccination and next due dates.');
      return;
    }
    setVaccinationEntries(entries => [...entries, {
      id: `vacc_${Date.now()}`,
      animalTagId: selectedTagId,
      vaccineName,
      date: vaccinationDate,
      dueDate: dueDate || undefined,
      doseNumber,
      notes,
    }]);
    setVaccineName('');
    setVaccinationDate('');
    setDueDate('');
    setDoseNumber('');
    setNotes('');
  };

  const fieldClass = 'w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';
  const labelClass = 'mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500';

  return (
    <div className="min-h-[calc(100vh-76px)] w-full bg-slate-50 px-4 pb-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1800px]">
        <header className="flex flex-col gap-5 border-b border-slate-200 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="rounded-lg border border-slate-200 bg-white p-3 text-slate-700 shadow-sm hover:bg-slate-100" aria-label={t.back}>
              <Icon name="arrow-left" className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Production and health records</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Herd Management</h1>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600 shadow-sm">
            <span className="font-bold text-slate-900">{herd.length}</span> animals in your herd
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5"><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Milk records</p><p className="mt-2 text-3xl font-bold text-emerald-950">{milkEntries.length}</p><p className="mt-1 text-sm text-emerald-800">{averageMilk.toFixed(1)} L average</p></div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5"><p className="text-xs font-bold uppercase tracking-widest text-blue-700">Vaccinations</p><p className="mt-2 text-3xl font-bold text-blue-950">{vaccinationEntries.length}</p><p className="mt-1 text-sm text-blue-800">Total health records</p></div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-5"><p className="text-xs font-bold uppercase tracking-widest text-amber-700">Upcoming doses</p><p className="mt-2 text-3xl font-bold text-amber-950">{vaccinationSummary.upcoming}</p><p className="mt-1 text-sm text-amber-800">Plan the next visit</p></div>
          <div className="rounded-xl border border-red-100 bg-red-50 p-5"><p className="text-xs font-bold uppercase tracking-widest text-red-700">Needs attention</p><p className="mt-2 text-3xl font-bold text-red-950">{vaccinationSummary.overdue}</p><p className="mt-1 text-sm text-red-800">Overdue doses</p></div>
        </div>

        <ErrorMessage message={error} />
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Daily entry</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Milk Production</h2></div><Icon name="milk" className="h-7 w-7 text-emerald-700" /></div>
            <form onSubmit={handleMilkSubmit} className="space-y-5">
              <div><label className={labelClass}>Animal</label><select className={fieldClass} value={selectedTagId} onChange={event => setSelectedTagId(event.target.value)}><option value="">Choose an animal</option>{herd.map(animal => <option key={animal.tagId} value={animal.tagId}>{animal.breed} ({animal.tagId})</option>)}</select></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass}>Date</label><input className={fieldClass} type="date" value={milkDate} onChange={event => setMilkDate(event.target.value)} /></div><div><label className={labelClass}>Liters</label><input className={fieldClass} type="number" min="0" step="0.1" placeholder="0.0" value={milkLiters} onChange={event => setMilkLiters(event.target.value)} /></div></div>
              <button className="w-full rounded-lg bg-emerald-700 px-5 py-3.5 font-bold text-white hover:bg-emerald-800" type="submit"><Icon name="plus-circle" className="mr-2 inline h-5 w-5" />Add milk record</button>
            </form>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">Health entry</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Vaccination</h2></div><Icon name="shield-check" className="h-7 w-7 text-blue-700" /></div>
            <form onSubmit={handleVaccinationSubmit} className="space-y-5">
              <div><label className={labelClass}>Animal</label><select className={fieldClass} value={selectedTagId} onChange={event => setSelectedTagId(event.target.value)}><option value="">Choose an animal</option>{herd.map(animal => <option key={animal.tagId} value={animal.tagId}>{animal.breed} ({animal.tagId})</option>)}</select></div>
              <div><label className={labelClass}>Vaccine name</label><input className={fieldClass} placeholder="e.g. FMD, HS, BQ" value={vaccineName} onChange={event => setVaccineName(event.target.value)} /></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass}>Vaccination date</label><input className={fieldClass} type="date" value={vaccinationDate} onChange={event => setVaccinationDate(event.target.value)} /></div><div><label className={labelClass}>Next due date</label><input className={fieldClass} type="date" value={dueDate} onChange={event => setDueDate(event.target.value)} /></div></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass}>Dose</label><select className={fieldClass} value={doseNumber} onChange={event => setDoseNumber(event.target.value)}><option value="">Choose dose</option><option>1st</option><option>2nd</option><option>Booster</option><option>Annual</option></select></div><div><label className={labelClass}>Notes</label><input className={fieldClass} placeholder="Doctor or hospital" value={notes} onChange={event => setNotes(event.target.value)} /></div></div>
              <button className="w-full rounded-lg bg-blue-700 px-5 py-3.5 font-bold text-white hover:bg-blue-800" type="submit"><Icon name="plus-circle" className="mr-2 inline h-5 w-5" />Record vaccination</button>
            </form>
          </section>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-5 text-xl font-bold text-slate-900">Recent milk records</h2><div className="space-y-3">{[...milkEntries].reverse().map(entry => <div key={`${entry.animalTagId}-${entry.date}`} className="flex items-center justify-between rounded-lg bg-slate-50 p-4"><div><p className="font-bold text-slate-900">{herd.find(animal => animal.tagId === entry.animalTagId)?.breed || entry.animalTagId}</p><p className="text-sm text-slate-500">{entry.date} · {entry.animalTagId}</p></div><div className="flex items-center gap-3"><strong className="text-emerald-700">{entry.liters} L</strong><button onClick={() => setMilkEntries(entries => entries.filter(item => item !== entry))} className="text-slate-400 hover:text-red-600" aria-label="Delete milk record"><Icon name="x-mark" className="h-5 w-5" /></button></div></div>)}{milkEntries.length === 0 && <p className="py-8 text-center text-slate-500">No milk records yet.</p>}</div></section>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-5 text-xl font-bold text-slate-900">Vaccination schedule</h2><div className="space-y-3">{[...vaccinationEntries].reverse().map(entry => { const status = getVaccinationStatus(entry.dueDate); return <div key={entry.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-4"><div><p className="font-bold text-slate-900">{entry.vaccineName} · {herd.find(animal => animal.tagId === entry.animalTagId)?.breed || entry.animalTagId}</p><p className="text-sm text-slate-500">{entry.date}{entry.dueDate ? ` · Due ${entry.dueDate}` : ''}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${status === 'overdue' ? 'bg-red-100 text-red-700' : status === 'upcoming' ? 'bg-amber-100 text-amber-700' : status === 'due_soon' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>{status === 'due_soon' ? 'Due soon' : status}</span><button onClick={() => setVaccinationEntries(entries => entries.filter(item => item.id !== entry.id))} className="text-slate-400 hover:text-red-600" aria-label="Delete vaccination record"><Icon name="x-mark" className="h-5 w-5" /></button></div></div>; })}</div></section>
        </div>
      </div>
    </div>
  );
};
