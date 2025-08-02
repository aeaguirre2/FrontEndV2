import React, { useEffect, useState } from 'react';
import type { IdentificadorVehiculo } from '../../types/automotive-loan';
import {
  createIdentificadorVehiculo,
  getIdentificadorVehiculoById,
} from '../../services/concesionarioService';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  identificadorId?: string;
}

const IdentificadoresModal: React.FC<Props> = ({ isOpen, onClose, identificadorId }) => {
  const [identificador, setIdentificador] = useState<IdentificadorVehiculo | null>(null);
  const [form, setForm] = useState<Partial<IdentificadorVehiculo>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && identificadorId) {
      setLoading(true);
      getIdentificadorVehiculoById(identificadorId)
        .then(setIdentificador)
        .finally(() => setLoading(false));
    } else {
      setIdentificador(null);
      setForm({});
    }
  }, [isOpen, identificadorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await createIdentificadorVehiculo(form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={identificador ? 'Ver Identificador' : 'Nuevo Identificador'}>
      {loading ? (
        <div className="py-4 text-center">Cargando...</div>
      ) : identificador ? (
        <div className="space-y-2">
          <div><b>Placa:</b> {identificador.placa}</div>
          <div><b>Chasis:</b> {identificador.chasis}</div>
          <div><b>Motor:</b> {identificador.motor}</div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input name="placa" label="Placa" value={form.placa || ''} onChange={handleChange} />
          <Input name="chasis" label="Chasis" value={form.chasis || ''} onChange={handleChange} />
          <Input name="motor" label="Motor" value={form.motor || ''} onChange={handleChange} />
        </div>
      )}
      {!identificador && (
        <div className="flex justify-end mt-6 space-x-2">
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button onClick={handleSave}>Crear</Button>
        </div>
      )}
    </Modal>
  );
};

export default IdentificadoresModal; 