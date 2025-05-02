import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { fileToBase64 } from '../../utils/helpers';
import Button from './Button';

interface ImageUploadProps {
  label?: string;
  multiple?: boolean;
  maxFiles?: number;
  initialImages?: string[];
  onChange: (images: string[]) => void;
  error?: string;
  helpText?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Upload Images',
  multiple = false,
  maxFiles = 3,
  initialImages = [],
  onChange,
  error,
  helpText,
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [...images];
    
    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= maxFiles) break;
      
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      try {
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      } catch (error) {
        console.error('Error converting file to base64', error);
      }
    }
    
    setImages(newImages);
    onChange(newImages);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files) return;
    
    const newImages = [...images];
    
    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= maxFiles) break;
      
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      try {
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      } catch (error) {
        console.error('Error converting file to base64', error);
      }
    }
    
    setImages(newImages);
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onChange(newImages);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mb-4">
      {label && <p className="label">{label}</p>}
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        } ${error ? 'border-error-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
        />
        
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={image}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-1 shadow-md"
                onClick={() => removeImage(index)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {images.length < maxFiles && (
            <button
              type="button"
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors"
              onClick={triggerFileInput}
            >
              <ImageIcon size={24} />
              <span className="text-xs mt-1">Add Image</span>
            </button>
          )}
        </div>
        
        {images.length === 0 && (
          <div className="text-center p-4">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop images here, or click to select files
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={triggerFileInput}
              icon={<Upload size={16} />}
            >
              Upload Image
            </Button>
          </div>
        )}
      </div>
      
      {error && <p className="form-error">{error}</p>}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default ImageUpload;