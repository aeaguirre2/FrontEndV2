import React, { useEffect, useState } from 'react';
import type { VehiculoEnConcesionario } from '../../types/automotive-loan';
import {
  getVehiculosByRuc,
  createVehiculo,
  updateVehiculo,
  desactivarVehiculo,
} from '../../services/concesionarioService';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  concesionarioRuc: string;
}

const VehiculosModal: React.FC<Props> = ({ isOpen, onClose, concesionarioRuc }) => {
  const [vehiculos, setVehiculos] = useState<VehiculoEnConcesionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<VehiculoEnConcesionario | null>(null);
  const [form, setForm] = useState<Partial<VehiculoEnConcesionario>>({});

  const fetchVehiculos = async () => {
    setLoading(true);
    try {
      const res = await getVehiculosByRuc(concesionarioRuc);
      setVehiculos(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchVehiculos();
  }, [isOpen]);

  const handleOpenForm = (vehiculo?: VehiculoEnConcesionario) => {
    setSelected(vehiculo || null);
    setForm(vehiculo || {});
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
      await updateVehiculo(concesionarioRuc, selected.placa, form);
    } else {
      await createVehiculo(concesionarioRuc, form);
    }
    handleCloseForm();
    fetchVehiculos();
  };

  const handleDesactivar = async (placa: string) => {
    await desactivarVehiculo(concesionarioRuc, placa);
    fetchVehiculos();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vehículos del Concesionario">
      <div className="mb-4 flex justify-between items-center">
        <Button onClick={() => handleOpenForm()}>Nuevo Vehículo</Button>
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2">Placa</th>
              <th className="px-4 py-2">Chasis</th>
              <th className="px-4 py-2">Motor</th>
              <th className="px-4 py-2">Marca</th>
              <th className="px-4 py-2">Modelo</th>
              <th className="px-4 py-2">Año</th>
              <th className="px-4 py-2">Condición</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-4">Cargando...</td></tr>
            ) : vehiculos.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-4">No hay vehículos</td></tr>
            ) : vehiculos.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-2">{v.placa}</td>
                <td className="px-4 py-2">{v.chasis}</td>
                <td className="px-4 py-2">{v.motor}</td>
                <td className="px-4 py-2">{v.marca}</td>
                <td className="px-4 py-2">{v.modelo}</td>
                <td className="px-4 py-2">{v.anio}</td>
                <td className="px-4 py-2">{v.condicion}</td>
                <td className="px-4 py-2">{v.estado}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" onClick={() => handleOpenForm(v)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDesactivar(v.placa)}>Desactivar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <Modal isOpen={showForm} onClose={handleCloseForm} title={selected ? 'Editar Vehículo' : 'Nuevo Vehículo'}>
          <div className="space-y-4">
            <Input name="placa" label="Placa" value={form.placa || ''} onChange={handleChange} disabled={!!selected} />
            <Input name="chasis" label="Chasis" value={form.chasis || ''} onChange={handleChange} />
            <Input name="motor" label="Motor" value={form.motor || ''} onChange={handleChange} />
            <Input name="marca" label="Marca" value={form.marca || ''} onChange={handleChange} />
            <Input name="modelo" label="Modelo" value={form.modelo || ''} onChange={handleChange} />
            <Input name="anio" label="Año" type="number" value={form.anio || ''} onChange={handleChange} />
            <Input name="condicion" label="Condición" value={form.condicion || ''} onChange={handleChange} />
            <Input name="estado" label="Estado" value={form.estado || ''} onChange={handleChange} />
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

export default VehiculosModal; 