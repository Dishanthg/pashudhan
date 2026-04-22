import { imageAssets } from '../data/imageAssets';

export const BREED_CLASSIFIER_STORAGE_KEY = 'indexeddb://cattle-breed-transfer-head-v1';

export const SUPPORTED_BREED_LABELS = [
  'Gir',
  'Sahiwal',
  'Punganur',
  'Red Sindhi',
  'Tharparkar',
] as const;

export type SupportedBreedLabel = typeof SUPPORTED_BREED_LABELS[number];

export const DEFAULT_REFERENCE_IMAGE_URLS: Record<SupportedBreedLabel, string[]> = {
  Gir: [imageAssets.breeds.gir],
  Sahiwal: [imageAssets.breeds.sahiwal],
  Punganur: [imageAssets.breeds.punganur],
  'Red Sindhi': [imageAssets.breeds.redSindhi],
  Tharparkar: [imageAssets.breeds.tharparkar],
};
