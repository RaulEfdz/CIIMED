"use client";
import React, { useState, useEffect } from 'react';
import { Sucursal } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import SucursalCard from '@/components/customs/Cards/SucursalCard';
import { PlusCircle, Edit, Trash2, Home, CheckCircle, XCircle } from 'lucide-react';
import { faker } from '@faker-js/faker';

const AdminSucursales = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSucursal, setCurrentSucursal] = useState<Partial<Sucursal> | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchSucursales = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sucursales');
      if (!res.ok) throw new Error('Error al cargar las sucursales');
      const data = await res.json();
      setSucursales(data);
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  const handleOpenModal = (sucursal: Partial<Sucursal> | null = null) => {
    setCurrentSucursal(sucursal);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentSucursal(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentSucursal || !currentSucursal.nombre || !currentSucursal.direccion) {
      showToast('El nombre y la dirección son obligatorios.', 'error');
      return;
    }

    setLoading(true);
    const method = currentSucursal.id ? 'PUT' : 'POST';
    const endpoint = '/api/admin/sucursales';
    
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSucursal),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error al ${currentSucursal.id ? 'actualizar' : 'crear'} la sucursal`);
      }

      showToast(`Sucursal ${currentSucursal.id ? 'actualizada' : 'creada'} correctamente.`, 'success');
      
      fetchSucursales();
      handleCloseModal();

    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta sucursal?')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/sucursales', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar la sucursal');
      }

      showToast('Sucursal eliminada correctamente.', 'success');
      
      fetchSucursales();

    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAutorrellenar = () => {
    setCurrentSucursal(prev => ({
      ...prev,
      nombre: `Sucursal ${faker.location.city()}`,
      direccion: faker.location.streetAddress(),
      telefono: faker.phone.number(),
      horario: 'Lunes a Viernes de 9:00 a 18:00',
      mapaUrl: faker.internet.url(),
      activo: faker.datatype.boolean(),
    }));
  };

  const stats = {
    total: sucursales.length,
    activas: sucursales.filter(s => s.activo).length,
    inactivas: sucursales.filter(s => !s.activo).length,
  };

  return (
      <div className="container mx-auto py-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Administrar Sucursales</h1>
          <Button onClick={() => handleOpenModal({})}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Sucursal
          </Button>
        </header>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Sucursales</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivas</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactivas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Sucursales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sucursales.map(sucursal => (
            <div key={sucursal.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="outline" onClick={() => handleOpenModal(sucursal)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(sucursal.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <SucursalCard
                nombre={sucursal.nombre}
                direccion={sucursal.direccion}
                telefono={sucursal.telefono}
                horario={sucursal.horario}
                activo={sucursal.activo}
              />
            </div>
          ))}
        </div>

        {/* Modal de Edición/Creación */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentSucursal?.id ? 'Editar' : 'Crear'} Sucursal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div>
                <label htmlFor="nombre">Nombre <span className="text-red-500">*</span></label>
                <Input
                  id="nombre"
                  value={currentSucursal?.nombre || ''}
                  onChange={(e) => setCurrentSucursal({ ...currentSucursal, nombre: e.target.value })}
                  className={!currentSucursal?.nombre ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <label htmlFor="direccion">Dirección <span className="text-red-500">*</span></label>
                <Textarea
                  id="direccion"
                  value={currentSucursal?.direccion || ''}
                  onChange={(e) => setCurrentSucursal({ ...currentSucursal, direccion: e.target.value })}
                  className={!currentSucursal?.direccion ? 'border-red-500' : ''}
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="telefono">Teléfono</label>
                <Input
                  id="telefono"
                  value={currentSucursal?.telefono || ''}
                  onChange={(e) => setCurrentSucursal({ ...currentSucursal, telefono: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="horario">Horario</label>
                <Input
                  id="horario"
                  value={currentSucursal?.horario || ''}
                  onChange={(e) => setCurrentSucursal({ ...currentSucursal, horario: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="mapaUrl">URL de Google Maps</label>
                <Input
                  id="mapaUrl"
                  value={currentSucursal?.mapaUrl || ''}
                  onChange={(e) => setCurrentSucursal({ ...currentSucursal, mapaUrl: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={currentSucursal?.activo || false}
                  onChange={(e) => setCurrentSucursal({ ...currentSucursal, activo: e.target.checked })}
                />
                <label htmlFor="activo">Activa</label>
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

export default AdminSucursales;
