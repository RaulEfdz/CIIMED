"use client";
import { Servicio } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

function ServicioItem({ servicio, onChange, onDelete }: {
  servicio: Servicio,
  onChange: (s: Servicio) => void,
  onDelete: (id: number) => void,
}) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: servicio.nombre, descripcion: servicio.descripcion || '', precio: servicio.precio?.toString() || '' });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setForm({ nombre: servicio.nombre, descripcion: servicio.descripcion || '', precio: servicio.precio?.toString() || '' });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/servicios', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: servicio.id,
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio || '0'),
      })
    });
    const data = await res.json();
    setEditando(false);
    setLoading(false);
    onChange(data);
  };
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    setLoading(true);
    await fetch('/api/admin/servicios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: servicio.id })
    });
    setLoading(false);
    onDelete(servicio.id);
  };
  if (editando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Editando Servicio</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
          <Textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
          <Input name="precio" type="number" value={form.precio} onChange={handleChange} placeholder="Precio" />
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
        <p className="font-bold">{servicio.nombre}</p>
        <p>{servicio.descripcion}</p>
        <p className="text-sm text-gray-500">${servicio.precio ?? '-'}</p>
      </div>
      <div className="flex flex-col gap-2 ml-auto">
        <Button onClick={handleEdit}>Editar</Button>
        <Button onClick={handleDelete} disabled={loading} variant="destructive">Eliminar</Button>
      </div>
    </div>
  );
}

export default function AdminServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', precio: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/servicios')
      .then(res => res.json())
      .then(data => setServicios(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nuevo.nombre,
        descripcion: nuevo.descripcion,
        precio: parseFloat(nuevo.precio || '0')
      })
    });
    setNuevo({ nombre: '', descripcion: '', precio: '' });
    fetch('/api/admin/servicios')
      .then(res => res.json())
      .then(data => setServicios(data));
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin">
        <Button variant="outline" className="mb-4">Volver al Dashboard</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4">Administrar Servicios</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agregar Nuevo Servicio</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Input
              name="nombre"
              placeholder="Nombre del servicio"
              value={nuevo.nombre}
              onChange={handleChange}
              required
            />
            <Textarea
              name="descripcion"
              placeholder="Descripción"
              value={nuevo.descripcion}
              onChange={handleChange}
            />
            <Input
              name="precio"
              placeholder="Precio"
              type="number"
              value={nuevo.precio}
              onChange={handleChange}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar Servicio'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Lista de Servicios</h2>
      <ul className="space-y-4">
        {servicios.map(s => (
          <li key={s.id} className="p-4 border rounded-md">
            <ServicioItem servicio={s} onChange={srv => {
              setServicios(servicios.map(ss => ss.id === srv.id ? srv : ss));
            }} onDelete={id => {
              setServicios(servicios.filter(ss => ss.id !== id));
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
