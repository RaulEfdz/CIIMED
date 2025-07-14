"use client";
import { Noticia } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

function NoticiaItem({ noticia, onChange, onDelete }: {
  noticia: Noticia,
  onChange: (n: Noticia) => void,
  onDelete: (id: number) => void,
}) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ titulo: noticia.titulo, contenido: noticia.contenido, imagen: noticia.imagen || '', publicado: noticia.publicado });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setForm({ titulo: noticia.titulo, contenido: noticia.contenido, imagen: noticia.imagen || '', publicado: noticia.publicado });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === 'checkbox' ? isChecked : value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/noticias', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: noticia.id,
        ...form
      })
    });
    const data = await res.json();
    setEditando(false);
    setLoading(false);
    onChange(data);
  };
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta noticia?')) return;
    setLoading(true);
    await fetch('/api/admin/noticias', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: noticia.id })
    });
    setLoading(false);
    onDelete(noticia.id);
  };
  if (editando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Editando Noticia</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" />
          <Textarea name="contenido" value={form.contenido} onChange={handleChange} placeholder="Contenido" />
          <Input name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL de imagen" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="publicado" checked={form.publicado} onChange={handleChange} /> Publicado
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
        <p className="font-bold">{noticia.titulo}</p>
        <p>{noticia.contenido}</p>
        {noticia.imagen && <img src={noticia.imagen} alt="img" className="max-w-xs rounded-md my-2" />}
        <p className="text-sm text-gray-500">{noticia.publicado ? 'Publicado' : 'Borrador'}</p>
      </div>
      <div className="flex flex-col gap-2 ml-auto">
        <Button onClick={handleEdit}>Editar</Button>
        <Button onClick={handleDelete} disabled={loading} variant="destructive">Eliminar</Button>
      </div>
    </div>
  );
}

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [nueva, setNueva] = useState({ titulo: '', contenido: '', imagen: '', publicado: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/noticias')
      .then(res => res.json())
      .then(data => setNoticias(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setNueva({ ...nueva, [name]: type === 'checkbox' ? isChecked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/noticias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva)
    });
    setNueva({ titulo: '', contenido: '', imagen: '', publicado: false });
    fetch('/api/admin/noticias')
      .then(res => res.json())
      .then(data => setNoticias(data));
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin">
        <Button variant="outline" className="mb-4">Volver al Dashboard</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4">Administrar Noticias</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agregar Nueva Noticia</CardTitle>
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
              name="contenido"
              placeholder="Contenido"
              value={nueva.contenido}
              onChange={handleChange}
            />
            <Input
              name="imagen"
              placeholder="URL de imagen"
              value={nueva.imagen}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="publicado" checked={nueva.publicado} onChange={handleChange} /> Publicado
            </label>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar Noticia'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Lista de Noticias</h2>
      <ul className="space-y-4">
        {noticias.map(n => (
          <li key={n.id} className="p-4 border rounded-md">
            <NoticiaItem noticia={n} onChange={noti => {
              setNoticias(noticias.map(nn => nn.id === noti.id ? noti : nn));
            }} onDelete={id => {
              setNoticias(noticias.filter(nn => nn.id !== id));
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
