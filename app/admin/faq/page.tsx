"use client";
import { FAQ } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

function FAQItem({ faq, onChange, onDelete }: {
  faq: FAQ,
  onChange: (f: FAQ) => void,
  onDelete: (id: number) => void,
}) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ pregunta: faq.pregunta, respuesta: faq.respuesta, activo: faq.activo });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setForm({ pregunta: faq.pregunta, respuesta: faq.respuesta, activo: faq.activo });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === 'checkbox' ? isChecked : value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/faq', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: faq.id,
        ...form
      })
    });
    const data = await res.json();
    setEditando(false);
    setLoading(false);
    onChange(data);
  };
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    setLoading(true);
    await fetch('/api/admin/faq', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: faq.id })
    });
    setLoading(false);
    onDelete(faq.id);
  };
  if (editando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Editando Pregunta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input name="pregunta" value={form.pregunta} onChange={handleChange} placeholder="Pregunta" />
          <Textarea name="respuesta" value={form.respuesta} onChange={handleChange} placeholder="Respuesta" />
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
        <p className="font-bold">{faq.pregunta}</p>
        <p>{faq.respuesta}</p>
        <p className="text-sm text-gray-500">{faq.activo ? 'Activo' : 'Inactivo'}</p>
      </div>
      <div className="flex flex-col gap-2 ml-auto">
        <Button onClick={handleEdit}>Editar</Button>
        <Button onClick={handleDelete} disabled={loading} variant="destructive">Eliminar</Button>
      </div>
    </div>
  );
}

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [nuevo, setNuevo] = useState({ pregunta: '', respuesta: '', activo: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/faq')
      .then(res => res.json())
      .then(data => setFaqs(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setNuevo({ ...nuevo, [name]: type === 'checkbox' ? isChecked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    setNuevo({ pregunta: '', respuesta: '', activo: true });
    fetch('/api/admin/faq')
      .then(res => res.json())
      .then(data => setFaqs(data));
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/admin">
        <Button variant="outline" className="mb-4">Volver al Dashboard</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4">Administrar Preguntas Frecuentes (FAQ)</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agregar Nueva Pregunta</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Input
              name="pregunta"
              placeholder="Pregunta"
              value={nuevo.pregunta}
              onChange={handleChange}
              required
            />
            <Textarea
              name="respuesta"
              placeholder="Respuesta"
              value={nuevo.respuesta}
              onChange={handleChange}
              required
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="activo" checked={nuevo.activo} onChange={handleChange} /> Activo
            </label>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar Pregunta'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Lista de Preguntas</h2>
      <ul className="space-y-4">
        {faqs.map(f => (
          <li key={f.id} className="p-4 border rounded-md">
            <FAQItem faq={f} onChange={ff => {
              setFaqs(faqs.map(fff => fff.id === ff.id ? ff : fff));
            }} onDelete={id => {
              setFaqs(faqs.filter(fff => fff.id !== id));
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
