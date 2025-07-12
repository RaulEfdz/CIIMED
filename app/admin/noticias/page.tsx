import { Noticia } from '@prisma/client';
import React, { useEffect, useState } from 'react';

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
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <input name="titulo" value={form.titulo} onChange={handleChange} />
        <textarea name="contenido" value={form.contenido} onChange={handleChange} />
        <input name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL de imagen" />
        <label>
          <input type="checkbox" name="publicado" checked={form.publicado} onChange={handleChange} /> Publicado
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          <button onClick={handleCancel} disabled={loading}>Cancelar</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span><b>{noticia.titulo}</b> — {noticia.publicado ? 'PUBLICADA' : 'Borrador'}<br />{noticia.contenido}<br />{noticia.imagen && <img src={noticia.imagen} alt="img" style={{ maxWidth: 100 }} />}</span>
      <button onClick={handleEdit}>Editar</button>
      <button onClick={handleDelete} disabled={loading}>Eliminar</button>
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
    const { name, value, type, checked } = e.target;
    setNueva({ ...nueva, [name]: type === 'checkbox' ? checked : value });
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
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h1>Administrar Noticias</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <input
          name="titulo"
          placeholder="Título"
          value={nueva.titulo}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <textarea
          name="contenido"
          placeholder="Contenido"
          value={nueva.contenido}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          name="imagen"
          placeholder="URL de imagen"
          value={nueva.imagen}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <label>
          <input type="checkbox" name="publicado" checked={nueva.publicado} onChange={handleChange} /> Publicado
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar Noticia'}
        </button>
      </form>
      <h2>Lista de Noticias</h2>
      <ul>
        {noticias.map(n => (
          <li key={n.id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
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
