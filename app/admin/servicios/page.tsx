import { Servicio } from '@prisma/client';
import React, { useEffect, useState } from 'react';

// Nota: En Next.js 13+ (app router), para llamadas server-side se recomienda usar API routes o server actions. Aquí se muestra un ejemplo simple client-side.

type ServicioEditable = Servicio & { editando?: boolean };

function ServicioItem({ servicio, onChange, onDelete }: {
  servicio: ServicioEditable,
  onChange: (srv: ServicioEditable) => void,
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <input name="nombre" value={form.nombre} onChange={handleChange} />
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
        <input name="precio" type="number" value={form.precio} onChange={handleChange} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          <button onClick={handleCancel} disabled={loading}>Cancelar</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span><b>{servicio.nombre}</b> — {servicio.descripcion} — ${servicio.precio ?? '-'}</span>
      <button onClick={handleEdit}>Editar</button>
      <button onClick={handleDelete} disabled={loading}>Eliminar</button>
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
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h1>Administrar Servicios</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <input
          name="nombre"
          placeholder="Nombre del servicio"
          value={nuevo.nombre}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          name="precio"
          placeholder="Precio"
          type="number"
          value={nuevo.precio}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar Servicio'}
        </button>
      </form>
      <h2>Lista de Servicios</h2>
      <ul>
        {servicios.map(s => (
          <li key={s.id} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
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
