"use client";
import { FAQ } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  const [loading, setLoading] = useState(true);
  const [newFAQ, setNewFAQ] = useState({ pregunta: '', respuesta: '', activo: true });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const res = await fetch('/api/admin/faq');
    const data = await res.json();
    setFaqs(data);
    setLoading(false);
  };

  const handleAddFAQ = async () => {
    if (!newFAQ.pregunta || !newFAQ.respuesta) return;
    const res = await fetch('/api/admin/faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFAQ)
    });
    const data = await res.json();
    setFaqs([...faqs, data]);
    setNewFAQ({ pregunta: '', respuesta: '', activo: true });
    setEditing(false);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administrar Preguntas Frecuentes (FAQ)</h1>
        <Link href="/admin" className="text-blue-500 hover:text-blue-700">
          Volver al Dashboard
        </Link>
      </div>

      <div className="w-full">
        <Tabs value="agregar" onValueChange={() => {}}>
          <div className="grid w-full grid-cols-2">
            <TabsTrigger value="agregar">Agregar Nueva Pregunta</TabsTrigger>
            <TabsTrigger value="lista">Lista de Preguntas</TabsTrigger>
          </div>
          <TabsContent value="agregar">
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Pregunta</label>
                    <Input
                      placeholder="Escribe tu pregunta..."
                      value={newFAQ.pregunta}
                      onChange={(e) => setNewFAQ({ ...newFAQ, pregunta: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Respuesta</label>
                    <Textarea
                      placeholder="Escribe la respuesta..."
                      value={newFAQ.respuesta}
                      onChange={(e) => setNewFAQ({ ...newFAQ, respuesta: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="mr-2">Activo</label>
                    <input
                      type="checkbox"
                      checked={newFAQ.activo}
                      onChange={(e) => setNewFAQ({ ...newFAQ, activo: e.target.checked })}
                    />
                  </div>
                  <Button onClick={handleAddFAQ}>Guardar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lista">
            <div className="space-y-4">
              {faqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  onChange={(updated) => {
                    setFaqs(faqs.map(f => f.id === updated.id ? updated : f));
                  }}
                  onDelete={(id) => {
                    setFaqs(faqs.filter(f => f.id !== id));
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
