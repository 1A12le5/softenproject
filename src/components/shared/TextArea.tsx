import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helpText, fullWidth = true, className, id, rows = 4, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label htmlFor={textareaId} className="label">
            {label}
          </label>
        )}
        
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={twMerge(
            'input',
            hasError ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : '',
            className
          )}
          {...props}
        />
        
        {hasError && <p className="form-error">{error}</p>}
        {helpText && !hasError && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;