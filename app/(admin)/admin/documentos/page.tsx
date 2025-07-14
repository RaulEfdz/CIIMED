"use client";
import { Documento } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

function DocumentoItem({ documento, onChange, onDelete }: {
  documento: Documento,
  onChange: (d: Documento) => void,
  onDelete: (id: number) => void,
}) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: documento.nombre, url: documento.url, activo: documento.activo });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setForm({ nombre: documento.nombre, url: documento.url, activo: documento.activo });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/documentos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: documento.id,
        ...form
      })
    });
    const data = await res.json();
    setEditando(false);
    setLoading(false);
    onChange(data);
  };
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este documento?')) return;
    setLoading(true);
    await fetch('/api/admin/documentos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: documento.id })
    });
    setLoading(false);
    onDelete(documento.id);
  };
  if (editando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Editando Documento</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
          <Input name="url" value={form.url} onChange={handleChange} placeholder="URL de descarga" />
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
        <p className="font-bold">{documento.nombre}</p>
        {documento.url && <a href={documento.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Descargar</a>}
        <p>{documento.activo ? 'Activo' : 'Inactivo'}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleEdit}>Editar</Button>
        <Button onClick={handleDelete} disabled={loading} variant="destructive">Eliminar</Button>
      </div>
    </div>
  );
}

export default function AdminDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: '', url: '', activo: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/documentos')
      .then(res => res.json())
      .then(data => setDocumentos(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNuevo({ ...nuevo, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/documentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    setNuevo({ nombre: '', url: '', activo: true });
    fetch('/api/admin/documentos')
      .then(res => res.json())
      .then(data => setDocumentos(data));
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin">
        <Button variant="outline" className="mb-4">Volver al Dashboard</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4">Administrar Documentos/Descargas</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agregar Nuevo Documento</CardTitle>
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
              name="url"
              placeholder="URL de descarga"
              value={nuevo.url}
              onChange={handleChange}
              required
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="activo" checked={nuevo.activo} onChange={handleChange} /> Activo
            </label>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar Documento'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Lista de Documentos</h2>
      <ul className="space-y-4">
        {documentos.map(d => (
          <li key={d.id} className="p-4 border rounded-md">
            <DocumentoItem documento={d} onChange={dd => {
              setDocumentos(documentos.map(ddd => ddd.id === dd.id ? dd : ddd));
            }} onDelete={id => {
              setDocumentos(documentos.filter(ddd => ddd.id !== id));
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
