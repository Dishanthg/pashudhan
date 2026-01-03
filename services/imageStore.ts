
const IMAGE_STORAGE_PREFIX = 'pashudhan_image_';

const isQuotaExceeded = (e: unknown): boolean => {
    return e instanceof DOMException && (
        e.code === 22 ||
        e.code === 1014 ||
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    );
};

const clearOldImages = (count: number): void => {
    const imageKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(IMAGE_STORAGE_PREFIX))
        .sort((a, b) => {
            const timeA = parseInt(a.split('_')[2] || '0');
            const timeB = parseInt(b.split('_')[2] || '0');
            return timeA - timeB; // Sort oldest first
        });

    const keysToDelete = imageKeys.slice(0, count);
    keysToDelete.forEach(key => localStorage.removeItem(key));
};


export const saveImage = (base64DataUrl: string): string => {
    const imageId = `${IMAGE_STORAGE_PREFIX}${Date.now()}`;
    try {
        localStorage.setItem(imageId, base64DataUrl);
    } catch (e) {
        console.error("Failed to save image to localStorage. Storage might be full.", e);
        if (isQuotaExceeded(e)) {
            clearOldImages(1); // Clear the oldest image
            try {
                localStorage.setItem(imageId, base64DataUrl);
            } catch (e2) {
                 console.error("Failed to save image even after cleanup.", e2);
                 throw new Error("Could not save image. Storage is full.");
            }
        } else {
             throw e; // Rethrow other errors
        }
    }
    return imageId;
};

export const getImage = (id: string): string | null => {
    return localStorage.getItem(id);
};

export const removeImage = (id: string): void => {
    if (id.startsWith(IMAGE_STORAGE_PREFIX)) {
        localStorage.removeItem(id);
    }
};

export const imageStore = {
    saveImage,
    getImage,
    removeImage,
};
