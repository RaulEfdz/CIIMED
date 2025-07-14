"use client";
import { Sucursal } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

function SucursalItem({ sucursal, onChange, onDelete }: {
  sucursal: Sucursal,
  onChange: (s: Sucursal) => void,
  onDelete: (id: number) => void,
}) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: sucursal.nombre, direccion: sucursal.direccion, telefono: sucursal.telefono || '', horario: sucursal.horario || '', mapaUrl: sucursal.mapaUrl || '', activo: sucursal.activo });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setForm({ nombre: sucursal.nombre, direccion: sucursal.direccion, telefono: sucursal.telefono || '', horario: sucursal.horario || '', mapaUrl: sucursal.mapaUrl || '', activo: sucursal.activo });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/sucursales', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: sucursal.id,
        ...form
      })
    });
    const data = await res.json();
    setEditando(false);
    setLoading(false);
    onChange(data);
  };
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta sucursal?')) return;
    setLoading(true);
    await fetch('/api/admin/sucursales', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sucursal.id })
    });
    setLoading(false);
    onDelete(sucursal.id);
  };
  if (editando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Editando Sucursal</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
          <Input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" />
          <Input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />
          <Input name="horario" value={form.horario} onChange={handleChange} placeholder="Horario" />
          <Input name="mapaUrl" value={form.mapaUrl} onChange={handleChange} placeholder="URL de mapa" />
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
        <p className="font-bold">{sucursal.nombre}</p>
        <p>{sucursal.direccion}</p>
        <p>{sucursal.telefono}</p>
        <p>{sucursal.horario}</p>
        {sucursal.mapaUrl && <a href={sucursal.mapaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">Ver Mapa</a>}
        <p className="text-sm text-gray-500">{sucursal.activo ? 'Activo' : 'Inactivo'}</p>
      </div>
      <div className="flex flex-col gap-2 ml-auto">
        <Button onClick={handleEdit}>Editar</Button>
        <Button onClick={handleDelete} disabled={loading} variant="destructive">Eliminar</Button>
      </div>
    </div>
  );
}

export default function AdminSucursales() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [nueva, setNueva] = useState({ nombre: '', direccion: '', telefono: '', horario: '', mapaUrl: '', activo: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/sucursales')
      .then(res => res.json())
      .then(data => setSucursales(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNueva({ ...nueva, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/sucursales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva)
    });
    setNueva({ nombre: '', direccion: '', telefono: '', horario: '', mapaUrl: '', activo: true });
    fetch('/api/admin/sucursales')
      .then(res => res.json())
      .then(data => setSucursales(data));
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin">
        <Button variant="outline" className="mb-4">Volver al Dashboard</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4">Administrar Sucursales</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agregar Nueva Sucursal</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Input
              name="nombre"
              placeholder="Nombre"
              value={nueva.nombre}
              onChange={handleChange}
              required
            />
            <Input
              name="direccion"
              placeholder="Dirección"
              value={nueva.direccion}
              onChange={handleChange}
              required
            />
            <Input
              name="telefono"
              placeholder="Teléfono"
              value={nueva.telefono}
              onChange={handleChange}
            />
            <Input
              name="horario"
              placeholder="Horario"
              value={nueva.horario}
              onChange={handleChange}
            />
            <Input
              name="mapaUrl"
              placeholder="URL de mapa"
              value={nueva.mapaUrl}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="activo" checked={nueva.activo} onChange={handleChange} /> Activo
            </label>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar Sucursal'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Lista de Sucursales</h2>
      <ul className="space-y-4">
        {sucursales.map(s => (
          <li key={s.id} className="p-4 border rounded-md">
            <SucursalItem sucursal={s} onChange={sc => {
              setSucursales(sucursales.map(ss => ss.id === sc.id ? sc : ss));
            }} onDelete={id => {
              setSucursales(sucursales.filter(ss => ss.id !== id));
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
