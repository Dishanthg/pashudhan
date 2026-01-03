import type { BreedInfo } from '../types';
import { imageAssets } from './imageAssets';

export const breeds: BreedInfo[] = [
  {
    breedName: 'Gir',
    origin: 'Gujarat',
    description: 'The Gir is one of the principal Zebu breeds originating in India. It is known for its milk producing qualities and resistance to hot temperatures and tropical diseases.',
    characteristics: [
      'Distinctive dome-shaped forehead.',
      'Long, pendulous ears curled at the tip.',
      'Coat color varies from red to spotted.',
      'Docile and friendly temperament.',
      'Highly resistant to tropical diseases.'
    ],
    confidenceScore: 100,
    confidenceReasoning: 'Pre-defined data.',
    imageUrl: imageAssets.breeds.gir,
    lifespan: '12-15 years',
    dietaryNeeds: 'Balanced diet of green and dry fodder.',
    commonDiseases: ['FMD', 'Brucellosis', 'Mastitis'],
    temperament: 'Docile',
    milkYield: '1500-2000 kg',
    draughtCapacity: 'Bulls suitable for draught',
  },
  {
    breedName: 'Sahiwal',
    origin: 'Punjab',
    description: 'Sahiwal is considered one of the best milch cattle breeds of India. It is known for high milk production and heat tolerance.',
    characteristics: [
      'Heavily built body.',
      'Reddish-dun or pale red color.',
      'Loose skin dewlap.',
      'High milk yields.',
      'Heat-tolerant and tick-resistant.'
    ],
    confidenceScore: 100,
    confidenceReasoning: 'Pre-defined data.',
    imageUrl: imageAssets.breeds.sahiwal,
    lifespan: '10-12 years',
    dietaryNeeds: 'Adapts to various fodders.',
    commonDiseases: ['Tick-borne diseases', 'Theileriosis'],
    temperament: 'Docile',
    milkYield: '2000-2500 kg',
    draughtCapacity: 'Suitable for slow work',
  },
  {
    breedName: 'Murrah',
    origin: 'Punjab and Haryana',
    description: 'The Murrah buffalo is considered the "black gold" of India due to its high milk yield.',
    characteristics: [
      'Jet-black in color.',
      'Tightly curled horns.',
      'Massive, stocky body.',
      'High milk fat content.',
      'Efficient feed converters.'
    ],
    confidenceScore: 100,
    confidenceReasoning: 'Pre-defined data.',
    imageUrl: imageAssets.breeds.murrah,
    lifespan: '15-20 years',
    dietaryNeeds: 'Nutrient-rich diet required.',
    commonDiseases: ['HS', 'Mastitis'],
    temperament: 'Docile',
    milkYield: '1800-2600 kg',
    draughtCapacity: 'Primarily dairy',
  }
];