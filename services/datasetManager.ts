import {
  DEFAULT_REFERENCE_IMAGE_URLS,
  SUPPORTED_BREED_LABELS,
  type SupportedBreedLabel,
} from './breedModelConfig';

export interface TrainingSample {
  image: HTMLImageElement | HTMLCanvasElement;
  label: number;
  breedName: string;
}

export interface DatasetConfig {
  imagesPerBreed?: number;
  trainTestSplit?: number;
  augmentation?: boolean;
  breedNames?: string[];
}

export class DatasetManager {
  private breedLabels: string[] = [];

  constructor() {
    this.breedLabels = [...SUPPORTED_BREED_LABELS];
  }

  // Load real images from URLs
  async loadRealDataset(imageUrls: {
    url: string;
    breed: string;
    corsEnabled?: boolean;
  }[]): Promise<TrainingSample[]> {
    const samples: TrainingSample[] = [];
    const totalImages = imageUrls.length;
    let loaded = 0;

    console.log(`Loading ${totalImages} images for training...`);

    for (const item of imageUrls) {
      try {
        const img = new Image();
        
        if (item.corsEnabled !== false) {
          img.crossOrigin = 'anonymous';
        }
        
        img.src = item.url;

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load: ${item.url}`));
          setTimeout(() => reject(new Error(`Timeout: ${item.url}`)), 10000);
        });

        const label = this.breedLabels.indexOf(item.breed);
        if (label !== -1) {
          samples.push({
            image: img,
            label: label,
            breedName: item.breed
          });
          loaded++;
          console.log(`Loaded ${loaded}/${totalImages} images`);
        }
      } catch (error) {
        console.warn(`Failed to load image: ${item.url}`, error);
      }
    }

    console.log(`✓ Successfully loaded ${loaded} images`);
    return samples;
  }

  async loadBundledReferenceDataset(): Promise<TrainingSample[]> {
    const bundledSources = this.breedLabels.flatMap(breedName =>
      (DEFAULT_REFERENCE_IMAGE_URLS[breedName as SupportedBreedLabel] || []).map(url => ({
        url,
        breed: breedName,
        corsEnabled: !url.startsWith('data:'),
      }))
    );

    return this.loadRealDataset(bundledSources);
  }

  // Create synthetic dataset for demo/testing
  async createSyntheticDataset(config?: DatasetConfig): Promise<TrainingSample[]> {
    const imagesPerBreed = config?.imagesPerBreed || 10;
    const samples: TrainingSample[] = [];
    const targetBreeds = (config?.breedNames || this.breedLabels)
      .filter((breedName): breedName is string => this.breedLabels.includes(breedName));

    console.log(`Creating synthetic dataset (${imagesPerBreed} images per breed)...`);

    for (const breedName of targetBreeds) {
      const breedIndex = this.breedLabels.indexOf(breedName);

      for (let i = 0; i < imagesPerBreed; i++) {
        const image = this.generateSyntheticCattleImage(breedName);
        
        samples.push({
          image: image,
          label: breedIndex,
          breedName: breedName
        });
      }
    }

    console.log(`✓ Created ${samples.length} synthetic images`);
    return samples;
  }

  private generateSyntheticCattleImage(breedName: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Failed to get canvas context');

    // Background (grass)
    const gradient = ctx.createLinearGradient(0, 0, 0, 224);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#90EE90');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 224, 224);

    // Breed-specific color
    const breedColors: { [key: string]: string } = {
      'Gir': '#8B4513',
      'Sahiwal': '#CD853F',
      'Punganur': '#D2691E',
      'Red Sindhi': '#A0522D',
      'Tharparkar': '#DEB887'
    };

    const baseColor = breedColors[breedName] || '#654321';

    // Draw cattle body (simplified)
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.arc(112, 60, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(80, 85, 64, 80);

    ctx.fillRect(90, 165, 12, 50);
    ctx.fillRect(122, 165, 12, 50);

    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(95, 45, 15, 0, Math.PI, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(129, 45, 15, 0, Math.PI, true);
    ctx.stroke();

    // Add spots for variation
    ctx.fillStyle = `rgba(0, 0, 0, 0.2)`;
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 64 + 80;
      const y = Math.random() * 80 + 85;
      const radius = Math.random() * 8 + 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add breed label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.fillText(breedName, 10, 220);

    return canvas;
  }

  // Data augmentation
  augmentImage(
    image: HTMLCanvasElement | HTMLImageElement,
    augmentations: {
      rotation?: number;
      flip?: boolean;
      brightness?: number;
    } = {}
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Failed to get canvas context');

    const centerX = 112;
    const centerY = 112;

    ctx.save();
    ctx.translate(centerX, centerY);

    if (augmentations.rotation) {
      ctx.rotate(augmentations.rotation);
    }

    if (augmentations.flip) {
      ctx.scale(-1, 1);
    }

    ctx.translate(-centerX, -centerY);
    ctx.drawImage(image, 0, 0);

    if (augmentations.brightness !== undefined) {
      const imageData = ctx.getImageData(0, 0, 224, 224);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] *= (1 + augmentations.brightness);
        data[i + 1] *= (1 + augmentations.brightness);
        data[i + 2] *= (1 + augmentations.brightness);
      }

      ctx.putImageData(imageData, 0, 0);
    }

    ctx.restore();
    return canvas;
  }

  // Generate augmented dataset
  async augmentDataset(
    samples: TrainingSample[],
    augmentationsPerImage: number = 3
  ): Promise<TrainingSample[]> {
    const augmentedSamples: TrainingSample[] = [...samples];

    console.log(`Augmenting dataset (${augmentationsPerImage} variations per image)...`);

    for (const sample of samples) {
      for (let i = 0; i < augmentationsPerImage; i++) {
        const augmentations = {
          rotation: (Math.random() - 0.5) * (Math.PI / 6),
          flip: Math.random() > 0.5,
          brightness: (Math.random() - 0.5) * 0.2
        };

        const augmentedImage = this.augmentImage(sample.image, augmentations);

        augmentedSamples.push({
          image: augmentedImage,
          label: sample.label,
          breedName: sample.breedName
        });
      }
    }

    console.log(`✓ Dataset augmented to ${augmentedSamples.length} images`);
    return augmentedSamples;
  }


  // Normalize and preprocess images
  preprocessImage(image: HTMLCanvasElement | HTMLImageElement): Float32Array {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Failed to get canvas context');

    ctx.drawImage(image, 0, 0, 224, 224);

    const imageData = ctx.getImageData(0, 0, 224, 224);
    const data = imageData.data;

    const normalized = new Float32Array(224 * 224 * 3);

    for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
      normalized[j] = data[i] / 255;
      normalized[j + 1] = data[i + 1] / 255;
      normalized[j + 2] = data[i + 2] / 255;
    }

    return normalized;
  }

  // Split dataset
  splitDataset(samples: TrainingSample[], trainRatio = 0.8): {
    train: TrainingSample[];
    validation: TrainingSample[];
  } {
    const byBreed: { [key: number]: TrainingSample[] } = {};
    
    for (const sample of samples) {
      if (!byBreed[sample.label]) {
        byBreed[sample.label] = [];
      }
      byBreed[sample.label].push(sample);
    }

    const train: TrainingSample[] = [];
    const validation: TrainingSample[] = [];

    for (const breedSamples of Object.values(byBreed)) {
      const shuffled = [...breedSamples].sort(() => Math.random() - 0.5);
      const splitIndex = Math.floor(shuffled.length * trainRatio);

      train.push(...shuffled.slice(0, splitIndex));
      validation.push(...shuffled.slice(splitIndex));
    }

    return { train, validation };
  }

  // Get dataset statistics
  getStatistics(samples: TrainingSample[]): {
    totalSamples: number;
    samplesPerBreed: { [key: string]: number };
    balance: number;
  } {
    const samplesPerBreed: { [key: string]: number } = {};

    for (const sample of samples) {
      samplesPerBreed[sample.breedName] =
        (samplesPerBreed[sample.breedName] || 0) + 1;
    }

    const counts = Object.values(samplesPerBreed);
    const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance = counts.reduce((sum, count) => sum + Math.pow(count - avgCount, 2), 0) / counts.length;
    const balance = Math.max(0, 1 - Math.sqrt(variance) / avgCount);

    return {
      totalSamples: samples.length,
      samplesPerBreed,
      balance
    };
  }

  getBreedLabels(): string[] {
    return [...this.breedLabels];
  }
}

export const datasetManager = new DatasetManager();
