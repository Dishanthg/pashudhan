
import React, { useState, useEffect } from 'react';
import { imageStore } from '../services/imageStore';
import type { Animal } from '../types';

interface AnimalImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  animal: Animal | { imageUrl: string; breed: string };
}

const placeholderImage = (breed: string) => `https://ui-avatars.com/api/?name=${breed.charAt(0)}&background=random&size=128`;

export const AnimalImage: React.FC<AnimalImageProps> = ({ animal, ...props }) => {
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (animal.imageUrl.startsWith('pashudhan_image_')) {
      const storedUrl = imageStore.getImage(animal.imageUrl);
      if (isMounted) {
        setResolvedImageUrl(storedUrl || placeholderImage(animal.breed));
      }
    } else {
       if (isMounted) {
         setResolvedImageUrl(animal.imageUrl);
       }
    }
    return () => { isMounted = false };
  }, [animal.imageUrl, animal.breed]);

  if (!resolvedImageUrl) {
    // Return a placeholder structure to avoid layout shifts
    return <div {...props} className={`${props.className || ''} bg-brand-brown-200 dark:bg-brand-brown-800 animate-pulse`}></div>;
  }

  return <img src={resolvedImageUrl} alt={animal.breed} {...props} />;
};
