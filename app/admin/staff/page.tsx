import { Staff } from '@prisma/client';
import React, { useEffect, useState } from 'react';

function StaffItem({ staff, onChange, onDelete }: {
  staff: Staff,
  onChange: (s: Staff) => void,
  onDelete: (id: number) => void,
}) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: staff.nombre, puesto: staff.puesto, bio: staff.bio || '', foto: staff.foto || '', activo: staff.activo });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEditando(false);
    setForm({ nombre: staff.nombre, puesto: staff.puesto, bio: staff.bio || '', foto: staff.foto || '', activo: staff.activo });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/staff', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: staff.id,
        ...form
      })
    });
    const data = await res.json();
    setEditando(false);
    setLoading(false);
    onChange(data);
  };
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este miembro?')) return;
    setLoading(true);
    await fetch('/api/admin/staff', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: staff.id })
    });
    setLoading(false);
    onDelete(staff.id);
  };
  if (editando) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <input name="nombre" value={form.nombre} onChange={handleChange} />
        <input name="puesto" value={form.puesto} onChange={handleChange} placeholder="Puesto" />
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" />
        <input name="foto" value={form.foto} onChange={handleChange} placeholder="URL de foto" />
        <label>
          <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} /> Activo
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
      <span><b>{staff.nombre}</b> — {staff.puesto}<br />{staff.bio}<br />{staff.foto && <img src={staff.foto} alt="img" style={{ maxWidth: 100 }} />} {staff.activo ? 'Activo' : 'Inactivo'}</span>
      <button onClick={handleEdit}>Editar</button>
      <button onClick={handleDelete} disabled={loading}>Eliminar</button>
    </div>
  );
}

export default function AdminStaff() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: '', puesto: '', bio: '', foto: '', activo: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/staff')
      .then(res => res.json())
      .then(data => setStaffs(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setNuevo({ ...nuevo, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    setNuevo({ nombre: '', puesto: '', bio: '', foto: '', activo: true });
    fetch('/api/admin/staff')
      .then(res => res.json())
      .then(data => setStaffs(data));
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h1>Administrar Staff</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          name="puesto"
          placeholder="Puesto"
          value={nuevo.puesto}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={nuevo.bio}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          name="foto"
          placeholder="URL de foto"
          value={nuevo.foto}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <label>
          <input type="checkbox" name="activo" checked={nuevo.activo} onChange={handleChange} /> Activo
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar Staff'}
        </button>
      </form>
      <h2>Lista de Staff</h2>
      <ul>
        {staffs.map(s => (
          <li key={s.id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <StaffItem staff={s} onChange={st => {
              setStaffs(staffs.map(ss => ss.id === st.id ? st : ss));
            }} onDelete={id => {
              setStaffs(staffs.filter(ss => ss.id !== id));
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
