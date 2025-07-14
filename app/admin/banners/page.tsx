"use client";
import { Banner } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

function BannerItem({ banner, onChange, onDelete }: {
  banner: Banner,
  onChange: (b: Banner) => void,
  onDelete: (id: number) => void,
}) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ titulo: banner.titulo || '', imagen: banner.imagen, link: banner.link || '', activo: banner.activo });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setForm({ titulo: banner.titulo || '', imagen: banner.imagen, link: banner.link || '', activo: banner.activo });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/banners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: banner.id,
        ...form
      })
    });
    const data = await res.json();
    setEditando(false);
    setLoading(false);
    onChange(data);
  };
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este banner?')) return;
    setLoading(true);
    await fetch('/api/admin/banners', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: banner.id })
    });
    setLoading(false);
    onDelete(banner.id);
  };
  if (editando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Editando Banner</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" />
          <Input name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL de imagen" />
          <Input name="link" value={form.link} onChange={handleChange} placeholder="Enlace" />
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
    <div className="flex items-center gap-4">
      <div>
        <p className="font-bold">{banner.titulo}</p>
        {banner.imagen && <img src={banner.imagen} alt="img" className="max-w-xs rounded-md" />}
        {banner.link && <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">Enlace</a>}
        <p>{banner.activo ? 'Activo' : 'Inactivo'}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleEdit}>Editar</Button>
        <Button onClick={handleDelete} disabled={loading} variant="destructive">Eliminar</Button>
      </div>
    </div>
  );
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [nuevo, setNuevo] = useState({ titulo: '', imagen: '', link: '', activo: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/banners')
      .then(res => res.json())
      .then(data => setBanners(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNuevo({ ...nuevo, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    setNuevo({ titulo: '', imagen: '', link: '', activo: true });
    fetch('/api/admin/banners')
      .then(res => res.json())
      .then(data => setBanners(data));
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin">
        <Button variant="outline" className="mb-4">Volver al Dashboard</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4">Administrar Banners</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agregar Nuevo Banner</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Input
              name="titulo"
              placeholder="Título"
              value={nuevo.titulo}
              onChange={handleChange}
            />
            <Input
              name="imagen"
              placeholder="URL de imagen"
              value={nuevo.imagen}
              onChange={handleChange}
              required
            />
            <Input
              name="link"
              placeholder="Enlace"
              value={nuevo.link}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="activo" checked={nuevo.activo} onChange={handleChange} /> Activo
            </label>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar Banner'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Lista de Banners</h2>
      <ul className="space-y-4">
        {banners.map(b => (
          <li key={b.id} className="p-4 border rounded-md">
            <BannerItem banner={b} onChange={bn => {
              setBanners(banners.map(bb => bb.id === bn.id ? bn : bb));
            }} onDelete={id => {
              setBanners(banners.filter(bb => bb.id !== id));
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
