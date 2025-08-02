import React, { useEffect, useState } from 'react';
import type { Concesionario } from '../../types/automotive-loan';
import {
  getConcesionariosByEstado,
  createConcesionario,
  updateConcesionario,
  desactivarConcesionario,
} from '../../services/concesionarioService';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const ConcesionariosPage: React.FC = () => {
  const [concesionarios, setConcesionarios] = useState<Concesionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Concesionario | null>(null);
  const [form, setForm] = useState<Partial<Concesionario>>({});
  const [errors, setErrors] = useState<any>({});

  const fetchConcesionarios = async () => {
    setLoading(true);
    try {
      const res = await getConcesionariosByEstado('ACTIVO');
      setConcesionarios(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcesionarios();
  }, []);

  const handleOpenModal = (concesionario?: Concesionario) => {
    setSelected(concesionario || null);
    setForm(concesionario || { estado: 'ACTIVO' });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelected(null);
    setForm({});
    setErrors({});
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.razonSocial || form.razonSocial.trim() === '') newErrors.razonSocial = 'La razón social es requerida';
    else if (form.razonSocial.length > 80) newErrors.razonSocial = 'Máximo 80 caracteres';
    if (!form.direccion || form.direccion.trim() === '') newErrors.direccion = 'La dirección es requerida';
    else if (form.direccion.length > 120) newErrors.direccion = 'Máximo 120 caracteres';
    if (!form.telefono || form.telefono.trim() === '') newErrors.telefono = 'El teléfono es requerido';
    else if (form.telefono.length > 20) newErrors.telefono = 'Máximo 20 caracteres';
    if (!form.emailContacto || form.emailContacto.trim() === '') newErrors.emailContacto = 'El email de contacto es requerido';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.emailContacto)) newErrors.emailContacto = 'Formato de email inválido';
    else if (form.emailContacto.length > 50) newErrors.emailContacto = 'Máximo 50 caracteres';
    if (!form.estado) newErrors.estado = 'El estado es requerido';
    if (!form.ruc || form.ruc.trim() === '') newErrors.ruc = 'El RUC es requerido';
    else if (form.ruc.length > 20) newErrors.ruc = 'Máximo 20 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (selected) {
      await updateConcesionario(selected.ruc, form);
    } else {
      await createConcesionario(form);
    }
    handleCloseModal();
    fetchConcesionarios();
  };

  const handleDesactivar = async (ruc: string) => {
    await desactivarConcesionario(ruc);
    fetchConcesionarios();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Concesionarios</h1>
        <Button onClick={() => handleOpenModal()}>Nuevo Concesionario</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2">RUC</th>
              <th className="px-4 py-2">Razón Social</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Cargando...</td></tr>
            ) : concesionarios.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">No hay concesionarios</td></tr>
            ) : concesionarios.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.ruc}</td>
                <td className="px-4 py-2">{c.razonSocial}</td>
                <td className="px-4 py-2">{c.direccion}</td>
                <td className="px-4 py-2">{c.telefono}</td>
                <td className="px-4 py-2">{c.emailContacto}</td>
                <td className="px-4 py-2">{c.estado}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" onClick={() => handleOpenModal(c)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDesactivar(c.ruc)}>Desactivar</Button>
                  {/* Aquí irán los botones para gestionar vendedores, vehículos e identificadores */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={showModal} onClose={handleCloseModal} title={selected ? 'Editar Concesionario' : 'Nuevo Concesionario'}>
        <div className="space-y-4">
          <Input name="ruc" label="RUC" value={form.ruc || ''} onChange={handleChange} disabled={!!selected} />
          {errors.ruc && <div className="text-red-500 text-xs">{errors.ruc}</div>}
          <Input name="razonSocial" label="Razón Social" value={form.razonSocial || ''} onChange={handleChange} />
          {errors.razonSocial && <div className="text-red-500 text-xs">{errors.razonSocial}</div>}
          <Input name="direccion" label="Dirección" value={form.direccion || ''} onChange={handleChange} />
          {errors.direccion && <div className="text-red-500 text-xs">{errors.direccion}</div>}
          <Input name="telefono" label="Teléfono" value={form.telefono || ''} onChange={handleChange} />
          {errors.telefono && <div className="text-red-500 text-xs">{errors.telefono}</div>}
          <Input name="emailContacto" label="Email de Contacto" value={form.emailContacto || ''} onChange={handleChange} />
          {errors.emailContacto && <div className="text-red-500 text-xs">{errors.emailContacto}</div>}
          <select name="estado" value={form.estado || 'ACTIVO'} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
          {errors.estado && <div className="text-red-500 text-xs">{errors.estado}</div>}
        </div>
        <div className="flex justify-end mt-6 space-x-2">
          <Button onClick={handleCloseModal} variant="secondary">Cancelar</Button>
          <Button onClick={handleSave}>{selected ? 'Actualizar' : 'Crear'}</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ConcesionariosPage; 