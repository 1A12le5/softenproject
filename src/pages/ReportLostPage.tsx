import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { 
  Info, Calendar, MapPin, FileText, Tag, Image as ImageIcon, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemsContext';
import { ItemCategory } from '../types';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import Select, { SelectOption } from '../components/shared/Select';
import TextArea from '../components/shared/TextArea';
import ImageUpload from '../components/shared/ImageUpload';

interface ReportLostFormData {
  title: string;
  category: ItemCategory;
  description: string;
  dateLostOrFound: string;
  locationName: string;
  locationDescription: string;
}

const ReportLostPage: React.FC = () => {
  const { user } = useAuth();
  const { addItem } = useItems();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<ReportLostFormData>();
  
  const categoryOptions: SelectOption[] = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'documents', label: 'Documents' },
    { value: 'keys', label: 'Keys' },
    { value: 'pets', label: 'Pets' },
    { value: 'other', label: 'Other' }
  ];
  
  const handleImageChange = (newImages: string[]) => {
    setImages(newImages);
  };
  
  const onSubmit = async (data: ReportLostFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const newItem = await addItem({
        type: 'lost',
        title: data.title,
        category: data.category,
        description: data.description,
        dateLostOrFound: new Date(data.dateLostOrFound).toISOString(),
        location: {
          name: data.locationName,
          description: data.locationDescription
        },
        images,
        userId: user.id,
        contactInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
      
      navigate(`/items/${newItem.id}`);
    } catch (error) {
      console.error('Error reporting lost item:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Report Lost Item</h1>
        <p className="mt-2 text-gray-600">
          Please provide detailed information about your lost item to help others find it.
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center text-gray-800">
            <Info size={20} className="mr-2 text-primary-500" />
            <h2 className="text-lg font-medium">Item Information</h2>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Item Title"
              placeholder="e.g., Black Leather Wallet"
              icon={<Tag size={18} />}
              error={errors.title?.message}
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                }
              })}
            />
            
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Category is required' }}
              defaultValue="electronics"
              render={({ field }) => (
                <Select
                  label="Item Category"
                  options={categoryOptions}
                  error={errors.category?.message}
                  {...field}
                />
              )}
            />
            
            <TextArea
              label="Item Description"
              placeholder="Provide a detailed description of the item, including any identifying characteristics..."
              rows={5}
              icon={<FileText size={18} />}
              error={errors.description?.message}
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters'
                }
              })}
            />
            
            <ImageUpload
              label="Upload Images (Optional)"
              multiple
              maxFiles={3}
              initialImages={images}
              onChange={handleImageChange}
              helpText="Add up to 3 images to help identify your item"
            />
            
            <Input
              label="Date Lost"
              type="date"
              icon={<Calendar size={18} />}
              error={errors.dateLostOrFound?.message}
              max={new Date().toISOString().split('T')[0]}
              {...register('dateLostOrFound', {
                required: 'Date is required'
              })}
            />
            
            <Input
              label="Location Name"
              placeholder="e.g., Central Park, Main Street Coffee Shop"
              icon={<MapPin size={18} />}
              error={errors.locationName?.message}
              {...register('locationName', {
                required: 'Location name is required'
              })}
            />
            
            <TextArea
              label="Location Description (Optional)"
              placeholder="Provide more details about where the item was lost..."
              rows={3}
              {...register('locationDescription')}
            />
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6 flex flex-col sm:flex-row-reverse gap-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              icon={<CheckCircle size={18} />}
            >
              Submit Report
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportLostPage;