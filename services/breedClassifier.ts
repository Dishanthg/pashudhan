import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import type { BreedInfo } from '../types';
import { breeds } from '../data/breedData';
import {
  BREED_CLASSIFIER_STORAGE_KEY,
  DEFAULT_REFERENCE_IMAGE_URLS,
  SUPPORTED_BREED_LABELS,
  type SupportedBreedLabel,
} from './breedModelConfig';

export type ModelSource = 'reference-prototypes' | 'fine-tuned-head';

export interface BreedPrediction {
  breedName: string;
  confidence: number;
  breedInfo?: BreedInfo;
  alternatives?: { breedName: string; confidence: number }[];
  modelSource: ModelSource;
  reasoning: string;
}

export interface TrainingOptions {
  epochs?: number;
  batchSize?: number;
  validationSplit?: number;
  callbacks?: tf.CustomCallbackArgs;
}

export interface ModelInfo {
  ready: boolean;
  source: ModelSource | null;
  labels: string[];
  usingSavedHead: boolean;
}

export class BreedClassifier {
  private featureExtractor: mobilenet.MobileNet | null = null;
  private classificationHead: tf.LayersModel | null = null;
  private referenceEmbeddings = new Map<SupportedBreedLabel, tf.Tensor1D>();
  private breedLabels: SupportedBreedLabel[] = [...SUPPORTED_BREED_LABELS];
  private isModelLoaded = false;
  private modelSource: ModelSource | null = null;
  private loadPromise: Promise<void> | null = null;
  private referenceEmbeddingsPromise: Promise<void> | null = null;

  constructor() {
    void this.initializeBackend();
  }

  private async initializeBackend(): Promise<void> {
    try {
      if (tf.getBackend() !== 'webgl') {
        await tf.setBackend('webgl');
      }
      await tf.ready();
      console.log(`Using backend: ${tf.getBackend()}`);
    } catch (error) {
      console.warn('WebGL backend not available, using default backend', tf.getBackend(), error);
      await tf.ready();
    }
  }

  async loadModel(): Promise<void> {
    if (this.isModelLoaded) {
      return;
    }

    if (!this.loadPromise) {
      this.loadPromise = this.performInitialLoad().finally(() => {
        this.loadPromise = null;
      });
    }

    await this.loadPromise;
  }

  private async performInitialLoad(): Promise<void> {
    try {
      await this.initializeBackend();

      console.log('Loading pretrained MobileNet feature extractor...');
      this.featureExtractor = await mobilenet.load({ version: 2, alpha: 1.0 });

      await this.loadSavedClassificationHead();

      this.modelSource = this.classificationHead ? 'fine-tuned-head' : 'reference-prototypes';
      this.isModelLoaded = true;

      console.log(`Model ready (${this.modelSource})`);
    } catch (error) {
      console.error('Failed to load breed classifier:', error);
      throw new Error('Model loading failed');
    }
  }

  private async loadSavedClassificationHead(): Promise<void> {
    try {
      this.classificationHead = await tf.loadLayersModel(BREED_CLASSIFIER_STORAGE_KEY);
      console.log('Loaded saved fine-tuned classifier head');
    } catch {
      this.classificationHead = null;
      console.log('No saved classifier head found, using bundled reference model');
    }
  }

  private async ensureReferenceEmbeddings(): Promise<void> {
    if (this.referenceEmbeddings.size === this.breedLabels.length) {
      return;
    }

    if (!this.referenceEmbeddingsPromise) {
      this.referenceEmbeddingsPromise = this.buildReferenceEmbeddings().finally(() => {
        this.referenceEmbeddingsPromise = null;
      });
    }

    await this.referenceEmbeddingsPromise;
  }

  private async buildReferenceEmbeddings(): Promise<void> {
    if (!this.featureExtractor) {
      throw new Error('Feature extractor not ready');
    }

    this.disposeReferenceEmbeddings();

    for (const breedLabel of this.breedLabels) {
      const referenceSources = DEFAULT_REFERENCE_IMAGE_URLS[breedLabel];
      const sourceEmbeddings: tf.Tensor1D[] = [];

      for (const source of referenceSources) {
        const image = await this.loadImage(source);
        const variants = this.createReferenceVariants(image);

        const averagedEmbedding = tf.tidy(() => {
          const embeddings = variants.map(variant => this.extractEmbedding(variant));
          const meanEmbedding = tf.stack(embeddings).mean(0) as tf.Tensor1D;
          return this.normalizeEmbedding(meanEmbedding);
        });

        sourceEmbeddings.push(averagedEmbedding);
      }

      if (sourceEmbeddings.length === 0) {
        throw new Error(`No reference image loaded for ${breedLabel}`);
      }

      const prototype = tf.tidy(() => {
        const meanEmbedding = tf.stack(sourceEmbeddings).mean(0) as tf.Tensor1D;
        return this.normalizeEmbedding(meanEmbedding);
      });

      sourceEmbeddings.forEach(tensor => tensor.dispose());
      this.referenceEmbeddings.set(breedLabel, prototype);
    }
  }

  private async loadImage(source: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const timeoutId = window.setTimeout(() => {
        image.src = '';
        reject(new Error(`Timed out loading reference image: ${source}`));
      }, 12000);

      if (!source.startsWith('data:')) {
        image.crossOrigin = 'anonymous';
      }

      image.onload = () => {
        window.clearTimeout(timeoutId);
        resolve(image);
      };
      image.onerror = () => {
        window.clearTimeout(timeoutId);
        reject(new Error(`Failed to load reference image: ${source}`));
      };
      image.src = source;
    });
  }

  private createReferenceVariants(image: HTMLImageElement): HTMLCanvasElement[] {
    return [
      this.renderVariant(image),
      this.renderVariant(image, { flip: true }),
      this.renderVariant(image, { brightness: 0.1 }),
      this.renderVariant(image, { brightness: -0.08 }),
    ];
  }

  private renderVariant(
    image: HTMLImageElement,
    options: { flip?: boolean; brightness?: number } = {}
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to create canvas context');
    }

    context.save();

    if (options.flip) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    this.drawImageCover(context, image, canvas.width, canvas.height);
    context.restore();

    if (options.brightness !== undefined && options.brightness !== 0) {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const factor = 1 + options.brightness;

      for (let index = 0; index < imageData.data.length; index += 4) {
        imageData.data[index] = this.clampChannel(imageData.data[index] * factor);
        imageData.data[index + 1] = this.clampChannel(imageData.data[index + 1] * factor);
        imageData.data[index + 2] = this.clampChannel(imageData.data[index + 2] * factor);
      }

      context.putImageData(imageData, 0, 0);
    }

    return canvas;
  }

  private drawImageCover(
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    targetWidth: number,
    targetHeight: number
  ): void {
    const sourceRatio = image.width / image.height;
    const targetRatio = targetWidth / targetHeight;

    let sourceWidth = image.width;
    let sourceHeight = image.height;
    let sourceX = 0;
    let sourceY = 0;

    if (sourceRatio > targetRatio) {
      sourceWidth = image.height * targetRatio;
      sourceX = (image.width - sourceWidth) / 2;
    } else {
      sourceHeight = image.width / targetRatio;
      sourceY = (image.height - sourceHeight) / 2;
    }

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );
  }

  private clampChannel(value: number): number {
    return Math.max(0, Math.min(255, Math.round(value)));
  }

  private extractEmbedding(image: HTMLImageElement | HTMLCanvasElement): tf.Tensor1D {
    if (!this.featureExtractor) {
      throw new Error('Feature extractor not ready');
    }

    return tf.tidy(() => {
      const embedding = this.featureExtractor!.infer(image, true) as tf.Tensor;
      return this.normalizeEmbedding(embedding);
    });
  }

  private normalizeEmbedding(tensor: tf.Tensor): tf.Tensor1D {
    return tf.tidy(() => {
      const flattened = tensor.reshape([tensor.size]) as tf.Tensor1D;
      const safeNorm = flattened.norm().add(tf.scalar(1e-6));
      return flattened.div(safeNorm) as tf.Tensor1D;
    });
  }

  async predict(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<BreedPrediction> {
    await this.loadModel();

    try {
      if (!this.classificationHead) {
        await this.ensureReferenceEmbeddings();
      }

      const embedding = this.extractEmbedding(imageElement);
      const probabilities = this.classificationHead
        ? await this.predictWithSavedHead(embedding)
        : await this.predictWithReferenceEmbeddings(embedding);

      embedding.dispose();

      const sortedPredictions = probabilities
        .map((confidence, index) => ({
          breedName: this.breedLabels[index],
          confidence: Math.round(confidence * 100),
        }))
        .sort((a, b) => b.confidence - a.confidence);

      const topPrediction = sortedPredictions[0];
      const breedData = breeds.find(breed => breed.breedName === topPrediction.breedName);

      return {
        breedName: topPrediction.breedName,
        confidence: topPrediction.confidence,
        breedInfo: breedData,
        alternatives: sortedPredictions.slice(1, 3),
        modelSource: this.modelSource || 'reference-prototypes',
        reasoning: this.classificationHead
          ? `Fine-tuned transfer-learning head predicted ${topPrediction.breedName} with ${topPrediction.confidence}% confidence.`
          : `Pretrained MobileNet embeddings matched the uploaded image closest to ${topPrediction.breedName} with ${topPrediction.confidence}% confidence.`,
      };
    } catch (error) {
      console.error('Prediction error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  private async predictWithSavedHead(embedding: tf.Tensor1D): Promise<number[]> {
    if (!this.classificationHead) {
      throw new Error('Saved classifier head is not loaded');
    }

    const outputTensor = tf.tidy(() => {
      const batchedEmbedding = embedding.expandDims(0);
      const prediction = this.classificationHead!.predict(batchedEmbedding) as tf.Tensor;
      return prediction.squeeze();
    });

    const probabilities = Array.from(await outputTensor.data());
    outputTensor.dispose();
    return probabilities;
  }

  private async predictWithReferenceEmbeddings(embedding: tf.Tensor1D): Promise<number[]> {
    const prototypes = this.breedLabels
      .map(label => this.referenceEmbeddings.get(label))
      .filter((tensor): tensor is tf.Tensor1D => Boolean(tensor));

    if (prototypes.length !== this.breedLabels.length) {
      throw new Error('Reference embeddings are incomplete');
    }

    const confidenceTensor = tf.tidy(() => {
      const prototypeMatrix = tf.stack(prototypes);
      const similarityScores = prototypeMatrix
        .matMul(embedding.expandDims(1))
        .squeeze() as tf.Tensor1D;

      return tf.softmax(similarityScores.mul(tf.scalar(12)));
    });

    const confidences = Array.from(await confidenceTensor.data());
    confidenceTensor.dispose();
    return confidences;
  }

  async trainOnData(
    images: (HTMLImageElement | HTMLCanvasElement)[],
    labels: number[],
    options?: TrainingOptions
  ): Promise<tf.History> {
    await this.loadModel();

    if (images.length === 0 || labels.length === 0 || images.length !== labels.length) {
      throw new Error('Training data is invalid');
    }

    const embeddingTensors = images.map(image => this.extractEmbedding(image));
    const featureMatrix = tf.stack(embeddingTensors) as tf.Tensor2D;
    const featureSize = featureMatrix.shape[1];
    const labelTensor = tf.tensor1d(labels, 'int32');
    const oneHotLabels = tf.oneHot(labelTensor, this.breedLabels.length);

    const nextHead = this.createClassificationHead(featureSize);

    try {
      const history = await nextHead.fit(featureMatrix, oneHotLabels, {
        epochs: options?.epochs ?? 12,
        batchSize: options?.batchSize ?? 8,
        validationSplit: options?.validationSplit ?? 0.2,
        shuffle: true,
        callbacks: options?.callbacks,
        verbose: 0,
      });

      await nextHead.save(BREED_CLASSIFIER_STORAGE_KEY);

      if (this.classificationHead) {
        this.classificationHead.dispose();
      }

      this.classificationHead = nextHead;
      this.modelSource = 'fine-tuned-head';

      return history;
    } catch (error) {
      nextHead.dispose();
      console.error('Training error:', error);
      throw new Error('Failed to train model');
    } finally {
      embeddingTensors.forEach(tensor => tensor.dispose());
      featureMatrix.dispose();
      labelTensor.dispose();
      oneHotLabels.dispose();
    }
  }

  private createClassificationHead(featureSize: number): tf.LayersModel {
    const head = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [featureSize],
          units: 128,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }),
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: this.breedLabels.length,
          activation: 'softmax',
        }),
      ],
    });

    head.compile({
      optimizer: tf.train.adam(0.0005),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    return head;
  }

  async clearSavedModel(): Promise<void> {
    try {
      await tf.io.removeModel(BREED_CLASSIFIER_STORAGE_KEY);
    } catch {
      // Ignore missing model entries.
    }

    if (this.classificationHead) {
      this.classificationHead.dispose();
      this.classificationHead = null;
    }

    this.modelSource = 'reference-prototypes';
  }

  getModelInfo(): ModelInfo {
    return {
      ready: this.isModelLoaded,
      source: this.modelSource,
      labels: [...this.breedLabels],
      usingSavedHead: Boolean(this.classificationHead),
    };
  }

  getMemoryInfo(): tf.MemoryInfo {
    return tf.memory();
  }

  dispose(): void {
    this.disposeReferenceEmbeddings();

    if (this.classificationHead) {
      this.classificationHead.dispose();
      this.classificationHead = null;
    }

    this.featureExtractor = null;
    this.isModelLoaded = false;
    this.modelSource = null;
    this.referenceEmbeddingsPromise = null;
    tf.disposeVariables();
  }

  private disposeReferenceEmbeddings(): void {
    this.referenceEmbeddings.forEach(tensor => tensor.dispose());
    this.referenceEmbeddings.clear();
  }

  getBreedLabels(): string[] {
    return [...this.breedLabels];
  }
}

export const breedClassifier = new BreedClassifier();
