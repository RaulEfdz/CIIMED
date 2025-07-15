"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Promocion } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import PromotionCard from '@/components/customs/Cards/PromotionCard';
import { PlusCircle, Edit, Trash2, Tag, CheckCircle, XCircle } from 'lucide-react';
import { faker } from '@faker-js/faker';

const AdminPromociones = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPromocion, setCurrentPromocion] = useState<Partial<Promocion> | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchPromociones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/promociones');
      if (!res.ok) throw new Error('Error al cargar las promociones');
      const data = await res.json();
      setPromociones(data);
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  }, [setPromociones, showToast]);

  useEffect(() => {
    fetchPromociones();
  }, [fetchPromociones]);

  const handleOpenModal = (promocion: Partial<Promocion> | null = null) => {
    setCurrentPromocion(promocion);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentPromocion(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPromocion || !currentPromocion.titulo) {
      showToast('El título de la promoción es obligatorio.', 'error');
      return;
    }

    setLoading(true);
    const method = currentPromocion.id ? 'PUT' : 'POST';
    const endpoint = '/api/admin/promociones';
    
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPromocion),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error al ${currentPromocion.id ? 'actualizar' : 'crear'} la promoción`);
      }

      showToast(`Promoción ${currentPromocion.id ? 'actualizada' : 'creada'} correctamente.`, 'success');
      
      fetchPromociones();
      handleCloseModal();

    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta promoción?')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/promociones', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar la promoción');
      }

      showToast('Promoción eliminada correctamente.', 'success');
      
      fetchPromociones();

    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAutorrellenar = () => {
    setCurrentPromocion(prev => ({
      ...prev,
      titulo: faker.commerce.productAdjective() + ' ' + faker.commerce.product(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.urlLoremFlickr({ category: 'sales' }),
      vigente: faker.datatype.boolean(),
    }));
  };

  const stats = {
    total: promociones.length,
    vigentes: promociones.filter(p => p.vigente).length,
    expiradas: promociones.filter(p => !p.vigente).length,
  };

  return (
      <div className="container mx-auto py-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Administrar Promociones</h1>
          <Button onClick={() => handleOpenModal({})}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Promoción
          </Button>
        </header>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Promociones</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vigentes</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vigentes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiradas</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expiradas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Promociones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promociones.map(promocion => (
            <div key={promocion.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="outline" onClick={() => handleOpenModal(promocion)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(promocion.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <PromotionCard
                titulo={promocion.titulo}
                descripcion={promocion.descripcion}
                imagen={promocion.imagen}
                vigente={promocion.vigente}
              />
            </div>
          ))}
        </div>

        {/* Modal de Edición/Creación */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentPromocion?.id ? 'Editar' : 'Crear'} Promoción</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div>
                <label htmlFor="titulo">Título <span className="text-red-500">*</span></label>
                <Input
                  id="titulo"
                  value={currentPromocion?.titulo || ''}
                  onChange={(e) => setCurrentPromocion({ ...currentPromocion, titulo: e.target.value })}
                  className={!currentPromocion?.titulo ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <label htmlFor="descripcion">Descripción</label>
                <Textarea
                  id="descripcion"
                  value={currentPromocion?.descripcion || ''}
                  onChange={(e) => setCurrentPromocion({ ...currentPromocion, descripcion: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="imagen">URL de Imagen</label>
                <Input
                  id="imagen"
                  value={currentPromocion?.imagen || ''}
                  onChange={(e) => setCurrentPromocion({ ...currentPromocion, imagen: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="vigente"
                  checked={currentPromocion?.vigente || false}
                  onChange={(e) => setCurrentPromocion({ ...currentPromocion, vigente: e.target.checked })}
                />
                <label htmlFor="vigente">Vigente</label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleAutorrellenar}>Autorrellenar</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default AdminPromociones;
