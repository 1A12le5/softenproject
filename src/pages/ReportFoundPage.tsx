import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { 
  Info, Calendar, MapPin, FileText, Tag, Image as ImageIcon, CheckCircle,
  User, Mail, Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemsContext';
import { ItemCategory } from '../types';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import Select, { SelectOption } from '../components/shared/Select';
import TextArea from '../components/shared/TextArea';
import ImageUpload from '../components/shared/ImageUpload';
import { Card, CardBody } from '../components/shared/Card';

interface ReportFoundFormData {
  title: string;
  category: ItemCategory;
  description: string;
  dateLostOrFound: string;
  locationName: string;
  locationDescription: string;
}

const ReportFoundPage: React.FC = () => {
  const { user } = useAuth();
  const { addItem } = useItems();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<ReportFoundFormData>();
  
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
  
  const onSubmit = async (data: ReportFoundFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const newItem = await addItem({
        type: 'found',
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
      console.error('Error reporting found item:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Report Found Item</h1>
        <p className="mt-2 text-gray-600">
          Please provide detailed information about the item you've found to help reunite it with its owner.
        </p>
      </div>
      
      <div className="grid gap-6 mb-8">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <User size={20} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Name</p>
                  <p className="text-sm text-gray-500">{user?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Mail size={20} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              {user?.phone && (
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <Phone size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              This information will be visible to users who may be looking for this item.
            </p>
          </CardBody>
        </Card>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center text-gray-800">
              <Info size={20} className="mr-2 text-success-500" />
              <h2 className="text-lg font-medium">Item Information</h2>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Item Title"
                placeholder="e.g., Blue Smartphone"
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
                helpText="Add up to 3 images to help identify the item"
              />
              
              <Input
                label="Date Found"
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
                placeholder="e.g., Downtown Library, City Bus Terminal"
                icon={<MapPin size={18} />}
                error={errors.locationName?.message}
                {...register('locationName', {
                  required: 'Location name is required'
                })}
              />
              
              <TextArea
                label="Location Description (Optional)"
                placeholder="Provide more details about where you found the item..."
                rows={3}
                {...register('locationDescription')}
              />
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6 flex flex-col sm:flex-row-reverse gap-3">
              <Button
                type="submit"
                variant="success"
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
    </div>
  );
};

export default ReportFoundPage;