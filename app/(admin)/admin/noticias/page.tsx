"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Noticia } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import NewsCard from '@/components/customs/Cards/NewsCard';
import { PlusCircle, Edit, Trash2, Newspaper, CheckCircle, XCircle } from 'lucide-react';
import { faker } from '@faker-js/faker';

const AdminNoticias = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNoticia, setCurrentNoticia] = useState<Partial<Noticia> | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchNoticias = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/noticias');
      if (!res.ok) throw new Error('Error al cargar las noticias');
      const data = await res.json();
      setNoticias(data);
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  }, [setNoticias, showToast]);

  useEffect(() => {
    fetchNoticias();
  }, [fetchNoticias]);

  const handleOpenModal = (noticia: Partial<Noticia> | null = null) => {
    setCurrentNoticia(noticia);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentNoticia(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentNoticia || !currentNoticia.titulo || !currentNoticia.contenido) {
      showToast('El título y el contenido son obligatorios.', 'error');
      return;
    }

    setLoading(true);
    const method = currentNoticia.id ? 'PUT' : 'POST';
    const endpoint = '/api/admin/noticias';
    
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentNoticia),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error al ${currentNoticia.id ? 'actualizar' : 'crear'} la noticia`);
      }

      showToast(`Noticia ${currentNoticia.id ? 'actualizada' : 'creada'} correctamente.`, 'success');
      
      fetchNoticias();
      handleCloseModal();

    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/noticias', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar la noticia');
      }

      showToast('Noticia eliminada correctamente.', 'success');
      
      fetchNoticias();

    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAutorrellenar = () => {
    setCurrentNoticia(prev => ({
      ...prev,
      titulo: faker.lorem.sentence(5),
      contenido: faker.lorem.paragraphs(3),
      imagen: faker.image.urlLoremFlickr({ category: 'nature', width: 1280, height: 720 }),
      publicado: faker.datatype.boolean(),
    }));
  };

  const stats = {
    total: noticias.length,
    publicadas: noticias.filter(n => n.publicado).length,
    borradores: noticias.filter(n => !n.publicado).length,
  };

  return (
      <div className="container mx-auto py-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Administrar Noticias</h1>
          <Button onClick={() => handleOpenModal({})}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Noticia
          </Button>
        </header>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Noticias</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publicadas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Borradores</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.borradores}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map(noticia => (
            <div key={noticia.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="outline" onClick={() => handleOpenModal(noticia)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(noticia.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <NewsCard
                title={noticia.titulo}
                description={noticia.contenido}
                imageUrl={noticia.imagen || '/placeholder.png'}
                imageAlt={noticia.titulo}
                imgW={1280}
                imgH={720}
                link={`/news/${noticia.id}`} // Asumiendo una ruta de detalle
                author="CIIMED" // O un campo de autor si existe
                readTime={noticia.publicado ? 'Publicado' : 'Borrador'}
              />
            </div>
          ))}
        </div>

        {/* Modal de Edición/Creación */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentNoticia?.id ? 'Editar' : 'Crear'} Noticia</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div>
                <label htmlFor="titulo">Título <span className="text-red-500">*</span></label>
                <Input
                  id="titulo"
                  value={currentNoticia?.titulo || ''}
                  onChange={(e) => setCurrentNoticia({ ...currentNoticia, titulo: e.target.value })}
                  className={!currentNoticia?.titulo ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <label htmlFor="contenido">Contenido <span className="text-red-500">*</span></label>
                <Textarea
                  id="contenido"
                  value={currentNoticia?.contenido || ''}
                  onChange={(e) => setCurrentNoticia({ ...currentNoticia, contenido: e.target.value })}
                  className={!currentNoticia?.contenido ? 'border-red-500' : ''}
                  rows={5}
                />
              </div>
              <div>
                <label htmlFor="imagen">URL de Imagen</label>
                <Input
                  id="imagen"
                  value={currentNoticia?.imagen || ''}
                  onChange={(e) => setCurrentNoticia({ ...currentNoticia, imagen: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="publicado"
                  checked={currentNoticia?.publicado || false}
                  onChange={(e) => setCurrentNoticia({ ...currentNoticia, publicado: e.target.checked })}
                />
                <label htmlFor="publicado">Publicado</label>
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

export default AdminNoticias;
