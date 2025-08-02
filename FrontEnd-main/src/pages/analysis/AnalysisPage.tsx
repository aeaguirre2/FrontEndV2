import React, { useEffect, useState } from 'react';
import analysisService from '../../services/analysisService';
import type { CreditEvaluationDTO } from '../../services/analysisService';
import Button from '../../components/ui/Button';
import NuevoAnalisisModal from './NuevoAnalisisModal';

const AnalysisPage: React.FC = () => {
  const [evaluaciones, setEvaluaciones] = useState<CreditEvaluationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchEvaluaciones = () => {
    setLoading(true);
    analysisService.getAllCreditEvaluations()
      .then(data => setEvaluaciones(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvaluaciones();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Análisis Crediticio</h1>
        <Button onClick={() => setModalOpen(true)}>Nuevo Análisis</Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {loading ? (
          <div className="text-center text-gray-500">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID Solicitud</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Capacidad Pago</th>
                  <th className="px-4 py-2">Nivel Riesgo</th>
                  <th className="px-4 py-2">Decisión Automática</th>
                  <th className="px-4 py-2">Observaciones</th>
                  <th className="px-4 py-2">Justificación Analista</th>
                </tr>
              </thead>
              <tbody>
                {evaluaciones.map(ev => (
                  <tr key={ev.idSolicitud} className="border-t">
                    <td className="px-4 py-2">{ev.idSolicitud}</td>
                    <td className="px-4 py-2">{ev.estado}</td>
                    <td className="px-4 py-2">{ev.capacidadPago}</td>
                    <td className="px-4 py-2">{ev.nivelRiesgo}</td>
                    <td className="px-4 py-2">{ev.decisionAutomatica}</td>
                    <td className="px-4 py-2">{ev.observaciones}</td>
                    <td className="px-4 py-2">{ev.justificacionAnalista}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <NuevoAnalisisModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchEvaluaciones}
      />
    </div>
  );
};

export default AnalysisPage;