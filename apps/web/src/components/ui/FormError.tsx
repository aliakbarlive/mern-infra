import React from 'react';

interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  return <p className="text-sm text-red-600 mt-1">{message}</p>;
};
