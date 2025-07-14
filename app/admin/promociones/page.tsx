"use client";
import { Promocion } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

function PromocionItem({ promocion, onChange, onDelete }: {
  promocion: Promocion,
  onChange: (p: Promocion) => void,
  onDelete: (id: number) => void,
}) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ titulo: promocion.titulo, descripcion: promocion.descripcion || '', imagen: promocion.imagen || '', vigente: promocion.vigente });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setForm({ titulo: promocion.titulo, descripcion: promocion.descripcion || '', imagen: promocion.imagen || '', vigente: promocion.vigente });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === 'checkbox' ? isChecked : value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/promociones', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: promocion.id,
        ...form
      })
    });
    const data = await res.json();
    setEditando(false);
    setLoading(false);
    onChange(data);
  };
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta promoción?')) return;
    setLoading(true);
    await fetch('/api/admin/promociones', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: promocion.id })
    });
    setLoading(false);
    onDelete(promocion.id);
  };
  if (editando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Editando Promoción</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" />
          <Textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
          <Input name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL de imagen" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="vigente" checked={form.vigente} onChange={handleChange} /> Vigente
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
        <p className="font-bold">{promocion.titulo}</p>
        <p>{promocion.descripcion}</p>
        {promocion.imagen && <img src={promocion.imagen} alt="img" className="max-w-xs rounded-md my-2" />}
        <p className="text-sm text-gray-500">{promocion.vigente ? 'Vigente' : 'No vigente'}</p>
      </div>
      <div className="flex flex-col gap-2 ml-auto">
        <Button onClick={handleEdit}>Editar</Button>
        <Button onClick={handleDelete} disabled={loading} variant="destructive">Eliminar</Button>
      </div>
    </div>
  );
}

export default function AdminPromociones() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [nueva, setNueva] = useState({ titulo: '', descripcion: '', imagen: '', vigente: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/promociones')
      .then(res => res.json())
      .then(data => setPromociones(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setNueva({ ...nueva, [name]: type === 'checkbox' ? isChecked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/promociones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva)
    });
    setNueva({ titulo: '', descripcion: '', imagen: '', vigente: true });
    fetch('/api/admin/promociones')
      .then(res => res.json())
      .then(data => setPromociones(data));
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin">
        <Button variant="outline" className="mb-4">Volver al Dashboard</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4">Administrar Promociones</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agregar Nueva Promoción</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Input
              name="titulo"
              placeholder="Título"
              value={nueva.titulo}
              onChange={handleChange}
              required
            />
            <Textarea
              name="descripcion"
              placeholder="Descripción"
              value={nueva.descripcion}
              onChange={handleChange}
            />
            <Input
              name="imagen"
              placeholder="URL de imagen"
              value={nueva.imagen}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="vigente" checked={nueva.vigente} onChange={handleChange} /> Vigente
            </label>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar Promoción'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Lista de Promociones</h2>
      <ul className="space-y-4">
        {promociones.map(p => (
          <li key={p.id} className="p-4 border rounded-md">
            <PromocionItem promocion={p} onChange={pp => {
              setPromociones(promociones.map(ppp => ppp.id === pp.id ? pp : ppp));
            }} onDelete={id => {
              setPromociones(promociones.filter(ppp => ppp.id !== id));
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
