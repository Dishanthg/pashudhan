
import { useState, useCallback, useEffect } from 'react';
import type { BreedInfo } from '../types';
import { breeds } from '../data/breedData';
import { TranslationStrings } from '../data/translations';
import { imageStore } from '../services/imageStore';
import { breedClassifier } from '../services/breedClassifier';

const imageFileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export const useBreedRecognition = (t: TranslationStrings) => {
  const [result, setResult] = useState<BreedInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recognizedImage, setRecognizedImage] = useState<{ id: string; url: string } | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [modelSource, setModelSource] = useState<string | null>(null);

  const syncModelState = useCallback(async () => {
    await breedClassifier.loadModel();
    const modelInfo = breedClassifier.getModelInfo();
    setModelSource(modelInfo.source);
    setModelReady(modelInfo.ready);
    return modelInfo;
  }, []);

  // Initialize ML model
  useEffect(() => {
    const initModel = async () => {
      try {
        await syncModelState();
      } catch (err) {
        console.error('Failed to initialize ML model:', err);
        setError('ML model initialization failed');
      }
    };

    initModel();

    return () => {
      // Cleanup if needed
    };
  }, [syncModelState]);

  const recognizeBreed = useCallback(async (file: File) => {
    // Basic file validation
    if (!file.type.startsWith('image/')) {
        setError(t.error_image_type);
        return;
    }
    if (file.size > 4 * 1024 * 1024) {
        setError(t.error_image_size);
        return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    if (recognizedImage) {
        imageStore.removeImage(recognizedImage.id);
    }
    setRecognizedImage(null);

    try {
      if (!modelReady) {
        await syncModelState();
      }

      // Create image data URL for display
      const imageDataUrl = await imageFileToDataUrl(file);

      // Create image element for ML prediction
      const img = new Image();
      img.src = imageDataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Use real ML model for prediction
      const prediction = await breedClassifier.predict(img);
      const matchedBreed = prediction.breedInfo || breeds.find(b => b.breedName === prediction.breedName);

      if (!matchedBreed) {
        throw new Error('Matched breed metadata not found');
      }

      // Combine ML prediction with static breed data
      const breedInfo: BreedInfo = {
        ...matchedBreed,
        confidenceScore: prediction.confidence,
        confidenceReasoning: prediction.reasoning,
        imageUrl: imageDataUrl,
        breedName: prediction.breedName
      };

      const imageId = imageStore.saveImage(imageDataUrl);

      setResult(breedInfo);
      setRecognizedImage({ id: imageId, url: imageDataUrl });
      setModelSource(prediction.modelSource);

    } catch (err) {
      setResult(null);
      setRecognizedImage(null);
      if (err instanceof Error) {
        if (
          err.message.includes('not loaded') ||
          err.message.includes('Model loading failed') ||
          err.message.includes('reference image')
        ) {
          setError('ML model could not finish loading. Please try again.');
        } else if (err.message.includes('Failed to analyze')) {
          setError(t.error_no_breed_identified);
        } else {
          setError(t.error_unexpected);
        }
      } else {
        setError(t.error_unexpected);
      }
    } finally {
      setIsLoading(false);
    }
  }, [t, recognizedImage, modelReady, syncModelState]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
    if (recognizedImage) {
        imageStore.removeImage(recognizedImage.id);
    }
    setRecognizedImage(null);
  }, [recognizedImage]);

  return { result, error, isLoading, recognizedImage, recognizeBreed, reset, modelReady, modelSource };
};
