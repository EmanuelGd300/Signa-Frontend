'use client';

import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { apiService } from '@/lib/api';
import Swal from 'sweetalert2';

interface MarcaFormData {
  nombre: string;
  descripcion: string;
  categoria: string;
  propietario: string;
}

interface MarcaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  marca?: any;
  isEditing?: boolean;
}

export function MarcaForm({ isOpen, onClose, onSuccess, marca, isEditing = false }: MarcaFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<MarcaFormData>({
    nombre: marca?.nombre || '',
    descripcion: marca?.descripcion || '',
    categoria: marca?.categoria || '',
    propietario: marca?.propietario || ''
  });

  const [errors, setErrors] = useState<Partial<MarcaFormData>>({});

  const categorias = [
    'Tecnología',
    'Alimentación',
    'Textil',
    'Servicios',
    'Salud',
    'Educación',
    'Entretenimiento',
    'Otros'
  ];

  const validateStep1 = () => {
    const newErrors: Partial<MarcaFormData> = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.categoria) newErrors.categoria = 'La categoría es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<MarcaFormData> = {};
    
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.propietario.trim()) newErrors.propietario = 'El propietario es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await apiService.updateMarca(marca.id, {
          ...formData,
          estado: marca.estado
        });
      } else {
        await apiService.createMarca(formData);
      }

      await Swal.fire({
        title: '¡Éxito!',
        text: `Marca ${isEditing ? 'actualizada' : 'creada'} correctamente`,
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });
      onSuccess();
      handleClose();
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error desconocido',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      propietario: ''
    });
    setErrors({});
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la Marca *
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm font-medium ${
            errors.nombre ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-gray-300 hover:border-gray-400 hover:shadow-md focus:shadow-lg'
          }`}
          placeholder="Ingrese el nombre de la marca"
        />
        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría *
        </label>
        <div className="relative">
          <select
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm appearance-none cursor-pointer font-medium ${
              errors.categoria 
                ? 'border-red-400 bg-red-50 focus:ring-red-300' 
                : 'border-gray-300 hover:border-gray-400 hover:shadow-md focus:shadow-lg'
            }`}
            style={{
              backgroundImage: 'none'
            }}
          >
            <option value="" className="text-gray-500">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat} className="text-gray-700 py-2">{cat}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          rows={4}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none bg-white shadow-sm font-medium ${
            errors.descripcion ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-gray-300 hover:border-gray-400 hover:shadow-md focus:shadow-lg'
          }`}
          placeholder="Describa la marca y sus características"
        />
        {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Propietario *
        </label>
        <input
          type="text"
          value={formData.propietario}
          onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm font-medium ${
            errors.propietario ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-gray-300 hover:border-gray-400 hover:shadow-md focus:shadow-lg'
          }`}
          placeholder="Nombre del propietario de la marca"
        />
        {errors.propietario && <p className="text-red-500 text-sm mt-1">{errors.propietario}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          Resumen de la Marca
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex"><span className="font-medium text-gray-600 w-24">Nombre:</span> <span className="text-gray-800">{formData.nombre}</span></div>
          <div className="flex"><span className="font-medium text-gray-600 w-24">Categoría:</span> <span className="text-gray-800">{formData.categoria}</span></div>
          <div className="flex"><span className="font-medium text-gray-600 w-24">Propietario:</span> <span className="text-gray-800">{formData.propietario}</span></div>
          <div className="flex flex-col"><span className="font-medium text-gray-600 mb-1">Descripción:</span> <span className="text-gray-800 text-xs leading-relaxed">{formData.descripcion}</span></div>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        ¿Está seguro que desea {isEditing ? 'actualizar' : 'crear'} esta marca con la información mostrada?
      </p>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return `${isEditing ? 'Editar' : 'Nueva'} Marca - Información Básica`;
      case 2: return `${isEditing ? 'Editar' : 'Nueva'} Marca - Detalles`;
      case 3: return `${isEditing ? 'Editar' : 'Nueva'} Marca - Confirmación`;
      default: return 'Nueva Marca';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getStepTitle()} size="lg">
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((stepNumber, index) => (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                    : 'bg-white text-gray-400 border-gray-300'
                }`}>
                  {step > stepNumber ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <div className="mt-2 text-xs font-medium text-center">
                  <div className={step >= stepNumber ? 'text-blue-600' : 'text-gray-400'}>
                    {stepNumber === 1 && 'Información'}
                    {stepNumber === 2 && 'Detalles'}
                    {stepNumber === 3 && 'Confirmación'}
                  </div>
                </div>
              </div>
              {index < 2 && (
                <div className="flex-1 mx-4">
                  <div className={`h-0.5 transition-all duration-300 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                  }`} style={{ width: '80px' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={step === 1 ? handleClose : handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? 'Cancelar' : 'Atrás'}
        </Button>

        {step < 3 ? (
          <Button onClick={handleNext} className="flex items-center gap-2">
            Continuar
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            {isEditing ? 'Actualizar Marca' : 'Crear Marca'}
          </Button>
        )}
      </div>
    </Modal>
  );
}