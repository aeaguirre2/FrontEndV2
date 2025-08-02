import React, { useEffect, useState } from 'react';
import type { Vendedor } from '../../types/automotive-loan';
import {
  getVendedoresByRuc,
  createVendedor,
  updateVendedor,
  desactivarVendedor,
} from '../../services/concesionarioService';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  concesionarioRuc: string;
}

const VendedoresModal: React.FC<Props> = ({ isOpen, onClose, concesionarioRuc }) => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Vendedor | null>(null);
  const [form, setForm] = useState<Partial<Vendedor>>({});

  const fetchVendedores = async () => {
    setLoading(true);
    try {
      const res = await getVendedoresByRuc(concesionarioRuc);
      setVendedores(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchVendedores();
  }, [isOpen]);

  const handleOpenForm = (vendedor?: Vendedor) => {
    setSelected(vendedor || null);
    setForm(vendedor || {});
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelected(null);
    setForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (selected) {
      await updateVendedor(concesionarioRuc, selected.cedula, form);
    } else {
      await createVendedor(concesionarioRuc, form);
    }
    handleCloseForm();
    fetchVendedores();
  };

  const handleDesactivar = async (cedula: string) => {
    await desactivarVendedor(concesionarioRuc, cedula);
    fetchVendedores();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vendedores del Concesionario">
      <div className="mb-4 flex justify-between items-center">
        <Button onClick={() => handleOpenForm()}>Nuevo Vendedor</Button>
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2">Cédula</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellido</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Cargando...</td></tr>
            ) : vendedores.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">No hay vendedores</td></tr>
            ) : vendedores.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-2">{v.cedula}</td>
                <td className="px-4 py-2">{v.nombre}</td>
                <td className="px-4 py-2">{v.apellido}</td>
                <td className="px-4 py-2">{v.email}</td>
                <td className="px-4 py-2">{v.telefono}</td>
                <td className="px-4 py-2">{v.estado}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" onClick={() => handleOpenForm(v)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDesactivar(v.cedula)}>Desactivar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <Modal isOpen={showForm} onClose={handleCloseForm} title={selected ? 'Editar Vendedor' : 'Nuevo Vendedor'}>
          <div className="space-y-4">
            <Input name="cedula" label="Cédula" value={form.cedula || ''} onChange={handleChange} disabled={!!selected} />
            <Input name="nombre" label="Nombre" value={form.nombre || ''} onChange={handleChange} />
            <Input name="apellido" label="Apellido" value={form.apellido || ''} onChange={handleChange} />
            <Input name="email" label="Email" value={form.email || ''} onChange={handleChange} />
            <Input name="telefono" label="Teléfono" value={form.telefono || ''} onChange={handleChange} />
          </div>
          <div className="flex justify-end mt-6 space-x-2">
            <Button onClick={handleCloseForm} variant="secondary">Cancelar</Button>
            <Button onClick={handleSave}>{selected ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default VendedoresModal; 