"use client";
import React, { useState, useEffect } from 'react';
import { Testimonio } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import TestimonialCard from '@/components/customs/Cards/TestimonialCard';
import { PlusCircle, Edit, Trash2, Star, CheckCircle, XCircle } from 'lucide-react';
import { faker } from '@faker-js/faker';

const AdminTestimonios = () => {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTestimonio, setCurrentTestimonio] = useState<Partial<Testimonio> | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchTestimonios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonios');
      if (!res.ok) throw new Error('Error al cargar los testimonios');
      const data = await res.json();
      setTestimonios(data);
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonios();
  }, []);

  const handleOpenModal = (testimonio: Partial<Testimonio> | null = null) => {
    setCurrentTestimonio(testimonio);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTestimonio(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentTestimonio || !currentTestimonio.nombre || !currentTestimonio.mensaje) {
      showToast('El nombre y el mensaje son obligatorios.', 'error');
      return;
    }

    setLoading(true);
    const method = currentTestimonio.id ? 'PUT' : 'POST';
    const endpoint = '/api/admin/testimonios';
    
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTestimonio),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error al ${currentTestimonio.id ? 'actualizar' : 'crear'} el testimonio`);
      }

      showToast(`Testimonio ${currentTestimonio.id ? 'actualizado' : 'creado'} correctamente.`, 'success');
      
      fetchTestimonios();
      handleCloseModal();

    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este testimonio?')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonios', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar el testimonio');
      }

      showToast('Testimonio eliminado correctamente.', 'success');
      
      fetchTestimonios();

    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAutorrellenar = () => {
    setCurrentTestimonio(prev => ({
      ...prev,
      nombre: faker.person.fullName(),
      mensaje: faker.lorem.sentence(),
      foto: faker.image.avatar(),
      activo: faker.datatype.boolean(),
    }));
  };

  const stats = {
    total: testimonios.length,
    activos: testimonios.filter(t => t.activo).length,
    inactivos: testimonios.filter(t => !t.activo).length,
  };

  return (
      <div className="container mx-auto py-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Administrar Testimonios</h1>
          <Button onClick={() => handleOpenModal({})}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Testimonio
          </Button>
        </header>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Testimonios</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactivos}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Testimonios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {testimonios.map(testimonio => (
            <div key={testimonio.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="outline" onClick={() => handleOpenModal(testimonio)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(testimonio.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <TestimonialCard
                nombre={testimonio.nombre}
                mensaje={testimonio.mensaje}
                foto={testimonio.foto}
                activo={testimonio.activo}
              />
            </div>
          ))}
        </div>

        {/* Modal de Edición/Creación */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{currentTestimonio?.id ? 'Editar' : 'Crear'} Testimonio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div>
                <label htmlFor="nombre">Nombre <span className="text-red-500">*</span></label>
                <Input
                  id="nombre"
                  value={currentTestimonio?.nombre || ''}
                  onChange={(e) => setCurrentTestimonio({ ...currentTestimonio, nombre: e.target.value })}
                  className={!currentTestimonio?.nombre ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <label htmlFor="mensaje">Mensaje <span className="text-red-500">*</span></label>
                <Textarea
                  id="mensaje"
                  value={currentTestimonio?.mensaje || ''}
                  onChange={(e) => setCurrentTestimonio({ ...currentTestimonio, mensaje: e.target.value })}
                  className={!currentTestimonio?.mensaje ? 'border-red-500' : ''}
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="foto">URL de Foto</label>
                <Input
                  id="foto"
                  value={currentTestimonio?.foto || ''}
                  onChange={(e) => setCurrentTestimonio({ ...currentTestimonio, foto: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={currentTestimonio?.activo || false}
                  onChange={(e) => setCurrentTestimonio({ ...currentTestimonio, activo: e.target.checked })}
                />
                <label htmlFor="activo">Activo</label>
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

export default AdminTestimonios;
