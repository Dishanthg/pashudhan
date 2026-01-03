
import { useState, useCallback } from 'react';
import type { BreedInfo } from '../types';
import { getBreedInfo } from '../services/geminiService';
import { TranslationStrings } from '../data/translations';
import { imageStore } from '../services/imageStore';

const imageFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

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


  const recognizeBreed = useCallback(async (file: File) => {
    // Basic file validation
    if (!file.type.startsWith('image/')) {
        setError(t.error_image_type);
        return;
    }
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
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
      const [base64Image, imageDataUrl] = await Promise.all([
          imageFileToBase64(file),
          imageFileToDataUrl(file),
      ]);
      
      const breedInfo = await getBreedInfo(base64Image, file.type);
      const imageId = imageStore.saveImage(imageDataUrl);

      setResult(breedInfo);
      setRecognizedImage({ id: imageId, url: imageDataUrl });

    } catch (err) {
      setResult(null);
      setRecognizedImage(null);
      if (err instanceof Error) {
        if (err.message.includes('Could not identify')) {
          setError(t.error_no_breed_identified);
        } else if (err.message.includes('Failed to fetch') || err.message.includes('network')) {
            setError(t.error_network);
        } else {
          setError(t.error_unexpected);
        }
      } else {
        setError(t.error_unexpected);
      }
    } finally {
      setIsLoading(false);
    }
  }, [t, recognizedImage]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
    if (recognizedImage) {
        imageStore.removeImage(recognizedImage.id);
    }
    setRecognizedImage(null);
  }, [recognizedImage]);

  return { result, error, isLoading, recognizedImage, recognizeBreed, reset };
};
