
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
    <div
      className="flex items-center rounded-2xl border border-red-400/30 bg-red-50/95 px-4 py-3 text-red-700 shadow-lg backdrop-blur-xl dark:bg-red-500/12 dark:text-red-100"
      role="alert"
    >
      <Icon name="alert-triangle" className="w-5 h-5 mr-3 text-red-600 flex-shrink-0" />
      <span className="block sm:inline text-sm">{message}</span>
    </div>
  );
};
