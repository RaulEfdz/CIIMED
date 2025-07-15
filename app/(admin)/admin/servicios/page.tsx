"use client";
import React, { useState, useEffect } from 'react';
import { Servicio } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import ServiceCard from '@/components/customs/Cards/ServiceCard';
import { PlusCircle, Edit, Trash2, Package, CheckCircle, XCircle } from 'lucide-react';
import { faker } from '@faker-js/faker';

const AdminServicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentServicio, setCurrentServicio] = useState<Partial<Servicio> | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/servicios');
      if (!res.ok) throw new Error('Error al cargar los servicios');
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleOpenModal = (servicio: Partial<Servicio> | null = null) => {
    setCurrentServicio(servicio);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentServicio(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentServicio || !currentServicio.nombre) {
      showToast('El nombre del servicio es obligatorio.', 'error');
      return;
    }

    setLoading(true);
    const method = currentServicio.id ? 'PUT' : 'POST';
    const endpoint = '/api/admin/servicios';
    
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentServicio,
          precio: currentServicio.precio ? parseFloat(String(currentServicio.precio)) : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error al ${currentServicio.id ? 'actualizar' : 'crear'} el servicio`);
      }

      showToast(`Servicio ${currentServicio.id ? 'actualizado' : 'creado'} correctamente.`, 'success');
      
      fetchServicios();
      handleCloseModal();

    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/servicios', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar el servicio');
      }

      showToast('Servicio eliminado correctamente.', 'success');
      
      fetchServicios();

    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAutorrellenar = () => {
    setCurrentServicio(prev => ({
      ...prev,
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.paragraph(),
      precio: parseFloat(faker.commerce.price()),
      activo: faker.datatype.boolean(),
    }));
  };

  const stats = {
    total: servicios.length,
    activos: servicios.filter(s => s.activo).length,
    inactivos: servicios.filter(s => !s.activo).length,
  };

  return (
      <div className="container mx-auto py-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Administrar Servicios</h1>
          <Button onClick={() => handleOpenModal({})}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Servicio
          </Button>
        </header>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Servicios</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
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

        {/* Lista de Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map(servicio => (
            <div key={servicio.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="outline" onClick={() => handleOpenModal(servicio)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(servicio.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <ServiceCard
                nombre={servicio.nombre}
                descripcion={servicio.descripcion}
                precio={servicio.precio}
                activo={servicio.activo}
              />
            </div>
          ))}
        </div>

        {/* Modal de Edición/Creación */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentServicio?.id ? 'Editar' : 'Crear'} Servicio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div>
                <label htmlFor="nombre">Nombre <span className="text-red-500">*</span></label>
                <Input
                  id="nombre"
                  value={currentServicio?.nombre || ''}
                  onChange={(e) => setCurrentServicio({ ...currentServicio, nombre: e.target.value })}
                  className={!currentServicio?.nombre ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <label htmlFor="descripcion">Descripción</label>
                <Textarea
                  id="descripcion"
                  value={currentServicio?.descripcion || ''}
                  onChange={(e) => setCurrentServicio({ ...currentServicio, descripcion: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="precio">Precio</label>
                <Input
                  id="precio"
                  type="number"
                  value={currentServicio?.precio || ''}
                  onChange={(e) => setCurrentServicio({ ...currentServicio, precio: parseFloat(e.target.value) || null })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={currentServicio?.activo || false}
                  onChange={(e) => setCurrentServicio({ ...currentServicio, activo: e.target.checked })}
                />
                <label htmlFor="activo">Activo</label>
              </div>
.
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

export default AdminServicios;
