// src/pages/loans/LoansListPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import originacionService from '../../services/originacionService';
import type { SolicitudResumenDTO } from '../../services/originacionService';
import { listDocuments } from '../../services/documentService';
import type { DocumentoDTO } from '../../services/documentService';

export default function LoansListPage() {
    const [solicitudes, setSolicitudes] = useState<SolicitudResumenDTO[]>([]);
    // Map de numeroSolicitud → array de documentos
    const [docsMap, setDocsMap] = useState<Record<string, DocumentoDTO[]>>({});
    const navigate = useNavigate();

    // 1. Traer solicitudes
    useEffect(() => {
        const hoy = new Date().toISOString().slice(0, 10);
        originacionService
            .fetchSolicitudesPorFechas(hoy, hoy)
            .then(res => {
                setSolicitudes(res.data.solicitudes);
            })
            .catch(console.error);
    }, []);

    // 2. Cada vez que cambian las solicitudes, cargar docs por cada solicitud
    useEffect(() => {
        solicitudes.forEach(s => {
            listDocuments(s.numeroSolicitud)
                .then(res => {
                    setDocsMap(prev => ({ ...prev, [s.numeroSolicitud]: res.data }));
                })
                .catch(err => {
                    // Si no existe nada, ponemos arreglo vacío
                    setDocsMap(prev => ({ ...prev, [s.numeroSolicitud]: [] }));
                });
        });
    }, [solicitudes]);

    const irACargarDocs = (numeroSolicitud: string) => {
        navigate(`/documentation/${numeroSolicitud}`);
    };

    const irAValidarDocs = (numeroSolicitud: string) => {
        navigate(`/documentation/${numeroSolicitud}/validacion`);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Solicitudes de Crédito</h1>
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-2 py-1">N° Solicitud</th>
                        <th className="px-2 py-1">Estado</th>
                        <th className="px-2 py-1">Fecha</th>
                        <th className="px-2 py-1">Monto</th>
                        <th className="px-2 py-1">Plazo</th>
                        <th className="px-2 py-1">Placa</th>
                        <th className="px-2 py-1">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudes.map(s => {
                        const docs = docsMap[s.numeroSolicitud] || [];
                        const completos = docs.filter(d => d.estado === 'CARGADO').length === 3;
                        return (
                            <tr key={s.idSolicitud} className="border-t">
                                <td className="px-2 py-1">{s.numeroSolicitud}</td>
                                <td className="px-2 py-1">{s.estado}</td>
                                <td className="px-2 py-1">{new Date(s.fechaSolicitud).toLocaleDateString()}</td>
                                <td className="px-2 py-1">${s.montoSolicitado.toLocaleString()}</td>
                                <td className="px-2 py-1">{s.plazoMeses}</td>
                                <td className="px-2 py-1">{s.placaVehiculo}</td>
                                <td className="px-2 py-1 space-x-2">
                                    {!completos ? (
                                        <button
                                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                                            onClick={() => irACargarDocs(s.numeroSolicitud)}
                                        >
                                            Cargar Documentación
                                        </button>
                                    ) : (
                                        <button
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                            onClick={() => irAValidarDocs(s.numeroSolicitud)}
                                        >
                                            Validar Documentación
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
