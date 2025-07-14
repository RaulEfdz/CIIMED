"use client";
import { Testimonio } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

function TestimonioItem({ testimonio, onChange, onDelete }: {
  testimonio: Testimonio,
  onChange: (t: Testimonio) => void,
  onDelete: (id: number) => void,
}) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: testimonio.nombre, mensaje: testimonio.mensaje, foto: testimonio.foto || '', activo: testimonio.activo });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setForm({ nombre: testimonio.nombre, mensaje: testimonio.mensaje, foto: testimonio.foto || '', activo: testimonio.activo });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === 'checkbox' ? isChecked : value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/testimonios', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testimonio.id,
        ...form
      })
    });
    const data = await res.json();
    setEditando(false);
    setLoading(false);
    onChange(data);
  };
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este testimonio?')) return;
    setLoading(true);
    await fetch('/api/admin/testimonios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: testimonio.id })
    });
    setLoading(false);
    onDelete(testimonio.id);
  };
  if (editando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Editando Testimonio</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
          <Textarea name="mensaje" value={form.mensaje} onChange={handleChange} placeholder="Mensaje" />
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
        <p className="font-bold">{testimonio.nombre}</p>
        <p>{testimonio.mensaje}</p>
        {testimonio.foto && <img src={testimonio.foto} alt="img" className="max-w-xs rounded-md my-2" />}
        <p className="text-sm text-gray-500">{testimonio.activo ? 'Activo' : 'Inactivo'}</p>
      </div>
      <div className="flex flex-col gap-2 ml-auto">
        <Button onClick={handleEdit}>Editar</Button>
        <Button onClick={handleDelete} disabled={loading} variant="destructive">Eliminar</Button>
      </div>
    </div>
  );
}

export default function AdminTestimonios() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: '', mensaje: '', foto: '', activo: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/testimonios')
      .then(res => res.json())
      .then(data => setTestimonios(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setNuevo({ ...nuevo, [name]: type === 'checkbox' ? isChecked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/testimonios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    setNuevo({ nombre: '', mensaje: '', foto: '', activo: true });
    fetch('/api/admin/testimonios')
      .then(res => res.json())
      .then(data => setTestimonios(data));
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin">
        <Button variant="outline" className="mb-4">Volver al Dashboard</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4">Administrar Testimonios</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agregar Nuevo Testimonio</CardTitle>
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
            <Textarea
              name="mensaje"
              placeholder="Mensaje"
              value={nuevo.mensaje}
              onChange={handleChange}
              required
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
              {loading ? 'Guardando...' : 'Agregar Testimonio'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Lista de Testimonios</h2>
      <ul className="space-y-4">
        {testimonios.map(t => (
          <li key={t.id} className="p-4 border rounded-md">
            <TestimonioItem testimonio={t} onChange={tt => {
              setTestimonios(testimonios.map(ttt => ttt.id === tt.id ? tt : ttt));
            }} onDelete={id => {
              setTestimonios(testimonios.filter(ttt => ttt.id !== id));
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
