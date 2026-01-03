import type { Animal } from '../types';
import { imageAssets } from './imageAssets';

export const herd: Animal[] = [
  {
    tagId: 'IN001234',
    species: 'Cattle',
    breed: 'Gir',
    registrationDate: '2024-05-20',
    imageUrl: imageAssets.breeds.gir,
    dob: '2022-01-15',
    weight: 450,
    vaccinationRecords: 'FMD vaccine on 2023-03-10.',
  },
  {
    tagId: 'IN005678',
    species: 'Buffalo',
    breed: 'Murrah',
    registrationDate: '2024-05-18',
    imageUrl: imageAssets.breeds.murrah,
    dob: '2021-11-02',
    weight: 680,
    vaccinationRecords: 'All primary vaccinations complete.',
  },
  {
    tagId: 'IN009012',
    species: 'Cattle',
    breed: 'Sahiwal',
    registrationDate: '2024-04-30',
    imageUrl: imageAssets.breeds.sahiwal,
    dob: '2023-02-20',
    weight: 400,
    vaccinationRecords: 'Awaiting FMD shot.',
  }
];