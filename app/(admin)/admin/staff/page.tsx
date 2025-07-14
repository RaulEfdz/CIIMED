"use client";
import { Staff } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

function StaffItem({ staff, onChange, onDelete }: {
  staff: Staff,
  onChange: (s: Staff) => void,
  onDelete: (id: number) => void,
}) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: staff.nombre, puesto: staff.puesto, bio: staff.bio || '', foto: staff.foto || '', activo: staff.activo });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setForm({ nombre: staff.nombre, puesto: staff.puesto, bio: staff.bio || '', foto: staff.foto || '', activo: staff.activo });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === 'checkbox' ? isChecked : value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/staff', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: staff.id,
        ...form
      })
    });
    const data = await res.json();
    setEditando(false);
    setLoading(false);
    onChange(data);
  };
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este miembro?')) return;
    setLoading(true);
    await fetch('/api/admin/staff', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: staff.id })
    });
    setLoading(false);
    onDelete(staff.id);
  };
  if (editando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Editando Miembro del Staff</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
          <Input name="puesto" value={form.puesto} onChange={handleChange} placeholder="Puesto" />
          <Textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" />
          <Input name="foto" value={form.foto} onChange={handleChange} placeholder="URL de foto" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} /> Activo
          </label>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
          <Button onClick={handleCancel} disabled={loading} variant="outline">Cancelar</Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    <div className="flex items-start gap-4">
      <div>
        <p className="font-bold">{staff.nombre}</p>
        <p>{staff.puesto}</p>
        <p>{staff.bio}</p>
        {staff.foto && <img src={staff.foto} alt="img" className="max-w-xs rounded-md my-2" />}
        <p className="text-sm text-gray-500">{staff.activo ? 'Activo' : 'Inactivo'}</p>
      </div>
      <div className="flex flex-col gap-2 ml-auto">
        <Button onClick={handleEdit}>Editar</Button>
        <Button onClick={handleDelete} disabled={loading} variant="destructive">Eliminar</Button>
      </div>
    </div>
  );
}

export default function AdminStaff() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: '', puesto: '', bio: '', foto: '', activo: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/staff')
      .then(res => res.json())
      .then(data => setStaffs(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setNuevo({ ...nuevo, [name]: type === 'checkbox' ? isChecked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    setNuevo({ nombre: '', puesto: '', bio: '', foto: '', activo: true });
    fetch('/api/admin/staff')
      .then(res => res.json())
      .then(data => setStaffs(data));
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin">
        <Button variant="outline" className="mb-4">Volver al Dashboard</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4">Administrar Staff</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agregar Nuevo Miembro</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Input
              name="nombre"
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={handleChange}
              required
            />
            <Input
              name="puesto"
              placeholder="Puesto"
              value={nuevo.puesto}
              onChange={handleChange}
              required
            />
            <Textarea
              name="bio"
              placeholder="Bio"
              value={nuevo.bio}
              onChange={handleChange}
            />
            <Input
              name="foto"
              placeholder="URL de foto"
              value={nuevo.foto}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="activo" checked={nuevo.activo} onChange={handleChange} /> Activo
            </label>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar Staff'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Lista de Staff</h2>
      <ul className="space-y-4">
        {staffs.map(s => (
          <li key={s.id} className="p-4 border rounded-md">
            <StaffItem staff={s} onChange={st => {
              setStaffs(staffs.map(ss => ss.id === st.id ? st : ss));
            }} onDelete={id => {
              setStaffs(staffs.filter(ss => ss.id !== id));
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
