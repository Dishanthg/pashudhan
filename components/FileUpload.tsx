
import React, { useState, useCallback, useRef } from 'react';
import { Icon } from './Icon';
import { useTranslations } from '../hooks/useTranslations';
import type { Language } from '../types';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  language: Language;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, language }) => {
  const [isDragging, setIsDragging] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations(language);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
    // Reset input to allow selecting the same file again if needed
    e.target.value = '';
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileSelect]);

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />
      <label
        htmlFor="dropzone-file"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-brand-green-500 bg-brand-green-50 dark:bg-brand-green-900/20' : 'border-brand-brown-300 dark:border-brand-brown-700 bg-brand-brown-100 dark:bg-brand-brown-800/50 hover:bg-brand-brown-200 dark:hover:bg-brand-brown-800'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-brand-brown-700 dark:text-brand-brown-300">
          <Icon name="upload" className="w-10 h-10 mb-3" />
          <p className="mb-2 text-sm"><span className="font-semibold">{t.file_upload_click}</span> {t.file_upload_drag}</p>
          <p className="text-xs">{t.file_upload_types}</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
      </label>

      <div className="flex items-center w-full max-w-sm">
        <div className="flex-grow border-t border-brand-brown-300 dark:border-brand-brown-700"></div>
        <span className="flex-shrink mx-4 text-brand-brown-600 dark:text-brand-brown-400 font-medium">{t.file_upload_or}</span>
        <div className="flex-grow border-t border-brand-brown-300 dark:border-brand-brown-700"></div>
      </div>
        
      <button
        type="button"
        onClick={handleCameraClick}
        aria-label="Capture image with camera"
        className="w-full max-w-sm px-6 py-3 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:ring-opacity-75 transition-transform duration-200 hover:scale-105 flex items-center justify-center gap-2"
      >
        <Icon name="camera" className="w-6 h-6" />
        <span>{t.file_upload_camera}</span>
      </button>
    </div>
  );
};
