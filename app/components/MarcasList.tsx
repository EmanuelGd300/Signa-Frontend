'use client';

import { useState, useEffect } from 'react';
import { Marca } from '@/types/marca';
import { apiService } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { MarcaForm } from './MarcaForm';
import { Tooltip } from './ui/Tooltip';
import { Pencil, Trash2, Eye, Plus, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';

export function MarcasList() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);

  useEffect(() => {
    loadMarcas();
  }, []);

  const loadMarcas = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMarcas();
      setMarcas(data);
    } catch (err) {
      setError('Error al cargar las marcas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await apiService.deleteMarca(id);
        setMarcas(marcas.filter(marca => marca.id !== id));
        await Swal.fire({
          title: '¡Eliminado!',
          text: 'La marca ha sido eliminada correctamente',
          icon: 'success',
          confirmButtonColor: '#3B82F6'
        });
      } catch (err) {
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la marca',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  const handleEdit = (marca: Marca) => {
    setSelectedMarca(marca);
    setShowEditModal(true);
  };

  const handleView = (marca: Marca) => {
    setSelectedMarca(marca);
    setShowViewModal(true);
  };

  const handleFormSuccess = () => {
    loadMarcas();
  };

  const handleUpdateStatus = async (marca: Marca) => {
    const estados = ['Pendiente', 'Activo', 'Inactivo'];
    const estadosOptions = estados.reduce((acc, estado) => {
      acc[estado] = estado;
      return acc;
    }, {} as Record<string, string>);

    const { value: nuevoEstado } = await Swal.fire({
      title: 'Actualizar Estado',
      text: `Estado actual: ${marca.estado}`,
      input: 'select',
      inputOptions: estadosOptions,
      inputValue: marca.estado,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280'
    });

    if (nuevoEstado && nuevoEstado !== marca.estado) {
      try {
        const updatedMarca = await apiService.updateMarca(marca.id!, {
          ...marca,
          estado: nuevoEstado
        });

        await Swal.fire({
          title: '¡Actualizado!',
          text: `Estado cambiado a: ${nuevoEstado}`,
          icon: 'success',
          confirmButtonColor: '#3B82F6'
        });
        loadMarcas();
      } catch (error) {
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estado',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'Activo': 'bg-green-100 text-green-800',
      'Inactivo': 'bg-red-100 text-red-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadMarcas}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-start gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Marcas</h2>
            <p className="text-gray-600">
              Administra y controla todos los <span className="font-bold text-gray-800">registros de marca</span> de manera eficiente <span className="font-semibold text-blue-600">({marcas.length} marcas registradas)</span>
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 shadow-lg mt-8"
          >
            <Plus className="w-4 h-4" />
            Nueva Marca
          </Button>
        </div>
      </div>


      {marcas.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No hay marcas registradas</p>
            <Button onClick={() => setShowCreateModal(true)}>Crear primera marca</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {marcas.map((marca) => (
            <Card key={marca.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{marca.nombre}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(marca.estado)}`}>
                    {marca.estado}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{marca.descripcion}</p>
                  <p className="text-sm"><span className="font-medium">Categoría:</span> {marca.categoria}</p>
                  <p className="text-sm"><span className="font-medium">Propietario:</span> {marca.propietario}</p>
                  <p className="text-sm"><span className="font-medium">Fecha:</span> {new Date(marca.fechaRegistro).toLocaleDateString()}</p>
                  {marca.numeroRegistro && (
                    <p className="text-sm"><span className="font-medium">N° Registro:</span> {marca.numeroRegistro}</p>
                  )}
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Tooltip content="Ver detalles completos">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleView(marca)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Editar información">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleEdit(marca)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Cambiar estado">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleUpdateStatus(marca)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Eliminar marca">
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => marca.id && handleDelete(marca.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}


      <MarcaForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleFormSuccess}
      />

      <MarcaForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMarca(null);
        }}
        onSuccess={handleFormSuccess}
        marca={selectedMarca}
        isEditing={true}
      />


      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedMarca(null);
        }}
        title="Detalles de la Marca"
        size="lg"
      >
        {selectedMarca && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <p className="mt-1 text-sm text-gray-900">{selectedMarca.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">N° Registro</label>
                <p className="mt-1 text-sm text-gray-900">{selectedMarca.numeroRegistro}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <p className="mt-1 text-sm text-gray-900">{selectedMarca.categoria}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(selectedMarca.estado)}`}>
                  {selectedMarca.estado}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Propietario</label>
                <p className="mt-1 text-sm text-gray-900">{selectedMarca.propietario}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Registro</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedMarca.fechaRegistro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <p className="mt-1 text-sm text-gray-900">{selectedMarca.descripcion}</p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedMarca);
                }}
                className="flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedMarca(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}