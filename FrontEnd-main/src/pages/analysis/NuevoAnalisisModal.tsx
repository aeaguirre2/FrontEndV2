import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import analysisService from '../../services/analysisService';

interface NuevoAnalisisModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const NuevoAnalisisModal: React.FC<NuevoAnalisisModalProps> = ({ open, onClose, onCreated }) => {
  const [idSolicitud, setIdSolicitud] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await analysisService.ejecutarEvaluacionAutomatica(Number(idSolicitud));
      onCreated();
      onClose();
    } catch (err: any) {
      setError('Error al crear el análisis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Nuevo Análisis">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">ID Solicitud</label>
          <input
            type="number"
            value={idSolicitud}
            onChange={e => setIdSolicitud(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onClose} variant="secondary">Cancelar</Button>
          <Button type="submit" loading={loading}>Crear</Button>
        </div>
      </form>
    </Modal>
  );
};

export default NuevoAnalisisModal; 