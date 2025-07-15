"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

import TeamMemberCard from '@/components/customs/Cards/TeamMemberCard';

interface Staff {
  id: number;
  nombre: string;
  puesto: string;
  bio: string;
  imagenUrl: string;
  activo: boolean;
  linkedinUrl?: string;
  personalWebsite?: string;
  categoria: string;
}

// Modal simple para edición (puedes reemplazar por un componente más avanzado si lo deseas)
function EditStaffModal({ open, onClose, staff, onSave }: { open: boolean, onClose: () => void, staff: Staff, onSave: (s: Staff) => void }) {
  const [form, setForm] = useState({ ...staff });
  const [loading, setLoading] = useState(false);
  const categories = ["Directivos", "Investigadores", "Colaboradores"];

  useEffect(() => {
    setForm({ ...staff });
  }, [staff]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === 'checkbox' ? isChecked : value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/staff', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    onSave(data);
    onClose();
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Editar miembro</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
          <Input name="puesto" value={form.puesto} onChange={handleChange} placeholder="Puesto" />
          <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full p-2 border rounded-md">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <Textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" />
          <Input name="imagenUrl" value={form.imagenUrl} onChange={handleChange} placeholder="URL de foto" />
          <Input name="linkedinUrl" value={form.linkedinUrl || ''} onChange={handleChange} placeholder="URL de LinkedIn" />
          <Input name="personalWebsite" value={form.personalWebsite || ''} onChange={handleChange} placeholder="Sitio personal" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} /> Activo
          </label>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
          <Button onClick={onClose} disabled={loading} variant="outline">Cancelar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}


import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminStaff() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: '', puesto: '', bio: '', imagenUrl: '', activo: true, linkedinUrl: '', personalWebsite: '', categoria: 'Directivos' });
  const [fotoTab, setFotoTab] = useState<'url' | 'cloudinary'>('url');

  const [loading, setLoading] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key:string]: boolean}>({});
  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/admin/staff')
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al cargar los datos');
        }
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('Los datos no son un array:', data);
          return [];
        }
        setStaffs(data);
      })
      .catch(error => {
        console.error('Error:', error);
        setStaffs([]);
        showToast('Error al cargar los datos del equipo', 'error');
      });
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setNuevo({ ...nuevo, [name]: type === 'checkbox' ? isChecked : value });
  };

  const validate = (data: typeof nuevo) => {
    const errors: {[key:string]: boolean} = {};
    if (!data.nombre) errors.nombre = true;
    if (!data.puesto) errors.puesto = true;
    if (!data.categoria) errors.categoria = true;
    if (!data.imagenUrl) errors.imagenUrl = true;
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(nuevo);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      showToast('Por favor completa los campos obligatorios.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevo, imagenUrl: nuevo.imagenUrl })
      });
      if (!res.ok) throw new Error('Error al guardar');
      setNuevo({ nombre: '', puesto: '', bio: '', imagenUrl: '', activo: true, linkedinUrl: '', personalWebsite: '', categoria: '' });
      setModalOpen(false);
      fetch('/api/admin/staff')
        .then(res => res.json())
        .then(data => setStaffs(data));
      showToast('Miembro agregado con éxito', 'success');
    } catch {
      showToast('Ocurrió un error al guardar', 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteStaff = async (id: number) => {
    if (!window.confirm('¿Eliminar este miembro?')) return;
    setLoading(true);
    await fetch('/api/admin/staff', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setLoading(false);
    setStaffs(staffs.filter(ss => ss.id !== id));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 sm:mb-0">Administrar equipo</h1>
        <Link href="/admin">
          <Button variant="outline">Volver al Dashboard</Button>
        </Link>
      </div>
      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{staffs.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total miembros</div>
        </div>
        <div className="bg-green-100 dark:bg-green-900/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{staffs.filter(s => s.activo).length}</div>
          <div className="text-sm text-green-700 dark:text-green-400">Activos</div>
        </div>
        <div className="bg-red-100 dark:bg-red-900/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{staffs.filter(s => !s.activo).length}</div>
          <div className="text-sm text-red-700 dark:text-red-400">Inactivos</div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Equipo de trabajo</h2>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setModalOpen(true)} variant="default">Agregar nuevo miembro</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar nuevo miembro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="font-medium">Nombre <span className="text-red-500">*</span></label>
              <Input
                name="nombre"
                placeholder="Nombre"
                value={nuevo.nombre}
                onChange={handleChange}
                className={fieldErrors.nombre ? 'border-red-500' : ''}
              />
              <label className="font-medium">Puesto <span className="text-red-500">*</span></label>
              <Input
                name="puesto"
                placeholder="Puesto"
                value={nuevo.puesto}
                onChange={handleChange}
                className={fieldErrors.puesto ? 'border-red-500' : ''}
              />
              <label className="font-medium">Categoría <span className="text-red-500">*</span></label>
              <select
                name="categoria"
                value={nuevo.categoria}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${fieldErrors.categoria ? 'border-red-500' : ''}`}
              >
                <option value="Directivos">Directivos</option>
                <option value="Investigadores">Investigadores</option>
                <option value="Colaboradores">Colaboradores</option>
              </select>
              <label className="font-medium">Bio</label>
              <Textarea
                name="bio"
                placeholder="Bio"
                value={nuevo.bio}
                onChange={handleChange}
              />
              <label className="font-medium">Foto <span className="text-red-500">*</span></label>
              <Tabs value={fotoTab} onValueChange={(value) => setFotoTab(value as 'url' | 'cloudinary')}>
                <TabsList>
                  <TabsTrigger value="url">Por URL</TabsTrigger>
                  <TabsTrigger value="cloudinary">Subir archivo</TabsTrigger>
                </TabsList>
                <TabsContent value="url">
                  <Input
                    name="imagenUrl"
                    placeholder="URL de foto"
                    value={nuevo.imagenUrl}
                    onChange={handleChange}
                    className={fieldErrors.imagenUrl ? 'border-red-500' : ''}
                  />
                   {nuevo.imagenUrl && <img src={nuevo.imagenUrl} alt="Preview" className="h-24 mt-2 rounded-md" />}
                </TabsContent>
                <TabsContent value="cloudinary">
                  <ImageUpload
                    onUpload={(url) => setNuevo(n => ({ ...n, imagenUrl: url }))}
                    initialImageUrl={nuevo.imagenUrl}
                  />
                </TabsContent>
              </Tabs>
              <label className="font-medium">LinkedIn</label>
              <Input
                name="linkedinUrl"
                placeholder="URL de LinkedIn"
                value={nuevo.linkedinUrl}
                onChange={handleChange}
              />
              <label className="font-medium">Sitio personal</label>
              <Input
                name="personalWebsite"
                placeholder="Sitio personal"
                value={nuevo.personalWebsite}
                onChange={handleChange}
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="activo" checked={nuevo.activo} onChange={handleChange} /> Activo
              </label>
              <DialogFooter className="flex gap-2 mt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : 'Agregar miembro'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  // Autorrellenar
                  const nombres = ["Juan Pérez", "Ana Torres", "Luis Gómez", "Lucía Fernández", "Carlos Díaz", "María López", "Pedro Sánchez", "Sofía Ramírez"];
                  const puestos = ["Investigador", "Coordinador", "Director", "Analista", "Asistente", "Consultor", "Desarrollador", "Gestor"];
                  const bios = [
                    "Apasionado por la ciencia y la innovación.",
                    "Experto en gestión de proyectos internacionales.",
                    "Dedicado a la investigación aplicada en salud.",
                    "Amante de la tecnología y el trabajo en equipo.",
                    "Especialista en comunicación científica.",
                    "Fomenta la colaboración interdisciplinaria.",
                    "Innovador y creativo en soluciones tecnológicas.",
                    "Comprometido con el desarrollo sostenible."
                  ];
                  const fotos = [
                    "https://randomuser.me/api/portraits/men/" + Math.floor(Math.random()*50) + ".jpg",
                    "https://randomuser.me/api/portraits/women/" + Math.floor(Math.random()*50) + ".jpg"
                  ];
                  const nombresElegido = nombres[Math.floor(Math.random()*nombres.length)];
                  const puestoElegido = puestos[Math.floor(Math.random()*puestos.length)];
                  const bioElegida = bios[Math.floor(Math.random()*bios.length)];
                  const fotoElegida = fotos[Math.floor(Math.random()*fotos.length)];
                  const nombreURL = nombresElegido.toLowerCase().replace(/ /g, "-");
                  setNuevo({
                    nombre: nombresElegido,
                    puesto: puestoElegido,
                    categoria: "Investigador",
                    bio: bioElegida,
                    imagenUrl: fotoElegida,
                    activo: true,
                    linkedinUrl: `https://www.linkedin.com/in/${nombreURL}`,
                    personalWebsite: `https://www.${nombreURL}.com`
                  });
                }}>
                  Autorrellenar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {staffs.map(s => (
          <li key={s.id} className="relative">
            <TeamMemberCard
              name={s.nombre}
              role={s.puesto}
              imageUrl={s.imagenUrl}
              linkedinUrl={s.linkedinUrl || ''}
              personalWebsite={s.personalWebsite || ''}
              bio={s.bio}
              className={s.activo ? '' : 'opacity-50'}
            />
            <div className="admin-controls absolute top-2 right-2 flex gap-2 z-10">
              <Button size="icon" variant="outline" title="Editar" onClick={() => setEditingStaff(s)}>
                ✏️
              </Button>
              <Button size="icon" variant="destructive" title="Eliminar" onClick={() => handleDeleteStaff(s.id)}>
                🗑️
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {/* Modal de edición */}
      <EditStaffModal
        open={!!editingStaff}
        onClose={() => setEditingStaff(null)}
        staff={editingStaff || ({} as Staff)}
        onSave={st => {
          setStaffs(staffs.map(ss => ss.id === st.id ? st : ss));
        }}
      />
    </div>
  );
}
