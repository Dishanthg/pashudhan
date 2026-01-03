
import React from 'react';
import { Icon } from './Icon';

interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center" role="alert">
      <Icon name="alert-triangle" className="w-5 h-5 mr-3 text-red-600 flex-shrink-0" />
      <span className="block sm:inline text-sm">{message}</span>
    </div>
  );
};
