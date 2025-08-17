// src/pages/documentation/DocumentationListPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import originacionService from '../../services/originacionService';
import type { SolicitudResumenDTO } from '../../services/originacionService';


export default function DocumentationListPage() {
    const [fechaInicio, setFechaInicio] = useState(() => new Date().toISOString().slice(0, 10));
    const [fechaFin, setFechaFin] = useState(() => new Date().toISOString().slice(0, 10));
    const [lista, setLista] = useState<SolicitudResumenDTO[]>([]);
    const navigate = useNavigate();

    const filtrar = () => {
        // convertir "YYYY-MM-DD" → "YYYY-MM-DDTHH:mm:ss"
        const start = `${fechaInicio}T00:00:00`;
        const end = `${fechaFin}T23:59:59`;
        originacionService
            .fetchSolicitudesPorFechas(start, end)
            .then(res => setLista(res.data.solicitudes))
            .catch(console.error);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Documentación – Listado de Solicitudes</h1>

            <div className="flex items-center gap-3">
                <input
                    type="date"
                    className="border px-2 py-1"
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                />
                <input
                    type="date"
                    className="border px-2 py-1"
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                />
                <button
                    className="px-4 py-1 bg-indigo-600 text-white rounded"
                    onClick={filtrar}
                >
                    Filtrar
                </button>
            </div>

            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-3 py-2">N° Solicitud</th>
                        <th className="px-3 py-2">Estado</th>
                        <th className="px-3 py-2">Vehículo</th>
                        <th className="px-3 py-2">Monto</th>
                        <th className="px-3 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {lista.map(s => (
                        <tr key={s.idSolicitud} className="border-t">
                            <td className="px-3 py-2">{s.numeroSolicitud}</td>
                            <td className="px-3 py-2">{s.estado}</td>
                            <td className="px-3 py-2">{s.placaVehiculo}</td>
                            <td className="px-3 py-2">${s.montoSolicitado.toLocaleString()}</td>
                            <td className="px-3 py-2">
                                { /* Si está aún en BORRADOR, cargo documentos */}
                                {s.estado === 'BORRADOR' && (
                                    <button
                                        className="px-2 py-1 bg-green-600 text-white rounded"
                                        onClick={() => navigate(`/documentation/${s.numeroSolicitud}`)}
                                    >
                                        Cargar Documentación
                                    </button>
                                )}

                                { /* Cuando llegue DOCUMENTACION_CARGADA, voy a validar */}
                                {s.estado === 'DOCUMENTACION_CARGADA' && (
                                    <button
                                        className="px-2 py-1 bg-blue-600 text-white rounded"
                                        onClick={() => navigate(`/documentation/${s.numeroSolicitud}/validacion`)}
                                    >
                                        Validar Documentación
                                    </button>
                                )}

                                { /* Cuando llegue DOCUMENTACION_CARGADA, voy a validar */}
                                {s.estado === 'DOCUMENTACION_VALIDADA' && (
                                    <button
                                        className="px-2 py-1 bg-yellow-600 text-white rounded"
                                        onClick={() => navigate(
                                            `/documentation/${s.numeroSolicitud}/contratos`
                                        )}
                                    >
                                        Cargar Contratos
                                    </button>
                                )}

                                { /* Cuando llegue CONTRATO_CARGADO, voy a validar */}
                                {s.estado === 'CONTRATO_CARGADO' && (
                                    <button
                                        className="px-2 py-1 bg-yellow-600 text-white rounded"
                                        onClick={() => navigate(
                                            `/documentation/${s.numeroSolicitud}/contratos/validacion`
                                        )}
                                    >
                                        Validar Contratos
                                    </button>
                                )}


                                                                { /* Cuando llegue CONTRATO_CARGADO, voy a validar */}
                                {s.estado === 'CONTRATO_VALIDADO' && (
                                    <button
                                        className="px-2 py-1 bg-red-600 text-white rounded"
                                        onClick={() => navigate(
                                            `#`
                                        )}
                                    >
                                        SOLICITUD EN PROCESO DE DESEMBOLSO
                                    </button>
                                )}


                            </td>
                        </tr>
                    ))}
                    {lista.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-500">
                                No hay solicitudes en ese rango.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table >
        </div >
    );
}


