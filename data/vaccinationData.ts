import type { VaccinationEntry } from '../types';

export const initialVaccinationData: VaccinationEntry[] = [
  {
    id: 'vacc_1',
    animalTagId: 'IN001234',
    vaccineName: 'FMD',
    date: '2026-01-10',
    dueDate: '2026-07-10',
    doseNumber: 'Annual',
    notes: 'Govt. Veterinary Hospital',
  },
  {
    id: 'vacc_2',
    animalTagId: 'IN001234',
    vaccineName: 'HS',
    date: '2026-02-05',
    dueDate: '2027-02-05',
    doseNumber: '1st',
    notes: 'Dr. Ramesh',
  },
  {
    id: 'vacc_3',
    animalTagId: 'IN005678',
    vaccineName: 'Brucellosis',
    date: '2026-01-18',
    doseNumber: 'Booster',
    notes: 'District Center',
  },
  {
    id: 'vacc_4',
    animalTagId: 'IN005678',
    vaccineName: 'FMD',
    date: '2026-01-20',
    dueDate: '2026-07-20',
    doseNumber: 'Annual',
  },
  {
    id: 'vacc_5',
    animalTagId: 'IN009012',
    vaccineName: 'BQ',
    date: '2026-01-25',
    dueDate: '2027-01-25',
    doseNumber: '1st',
  },
];