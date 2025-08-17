// src/pages/documentation/DocumentationListPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import originacionService from '../../services/originacionService';
import type { SolicitudResumenDTO } from '../../services/originacionService';


export default function DocumentationListPage() {
    const { user } = useAuth();
    const [fechaInicio, setFechaInicio] = useState(() => new Date().toISOString().slice(0, 10));
    const [fechaFin, setFechaFin] = useState(() => new Date().toISOString().slice(0, 10));
    const [lista, setLista] = useState<SolicitudResumenDTO[]>([]);
    const navigate = useNavigate();

    // Función para verificar permisos de validación
    const canValidate = () => {
        return user?.rol === 'ADMIN' || user?.rol === 'ANALISTA';
    };

    // Función para verificar permisos de carga
    const canUpload = () => {
        return user?.rol === 'ADMIN' || user?.rol === 'VENDEDOR';
    };

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
                                        className={`px-2 py-1 rounded ${
                                            canUpload() 
                                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        }`}
                                        onClick={() => canUpload() && navigate(`/documentation/${s.numeroSolicitud}`)}
                                        disabled={!canUpload()}
                                        title={!canUpload() ? 'Solo vendedores y administradores pueden cargar documentos' : ''}
                                    >
                                        Cargar Documentación
                                    </button>
                                )}

                                { /* Cuando llegue DOCUMENTACION_CARGADA, voy a validar */}
                                {s.estado === 'DOCUMENTACION_CARGADA' && (
                                    <button
                                        className={`px-2 py-1 rounded ${
                                            canValidate() 
                                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        }`}
                                        onClick={() => canValidate() && navigate(`/documentation/${s.numeroSolicitud}/validacion`)}
                                        disabled={!canValidate()}
                                        title={!canValidate() ? 'Solo analistas y administradores pueden validar documentos' : ''}
                                    >
                                        Validar Documentación
                                    </button>
                                )}

                                { /* Cuando llegue DOCUMENTACION_CARGADA, voy a validar */}
                                {s.estado === 'DOCUMENTACION_VALIDADA' && (
                                    <button
                                        className={`px-2 py-1 rounded ${
                                            canUpload() 
                                                ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        }`}
                                        onClick={() => canUpload() && navigate(
                                            `/documentation/${s.numeroSolicitud}/contratos`
                                        )}
                                        disabled={!canUpload()}
                                        title={!canUpload() ? 'Solo vendedores y administradores pueden cargar contratos' : ''}
                                    >
                                        Cargar Contratos
                                    </button>
                                )}

                                { /* Cuando llegue CONTRATO_CARGADO, voy a validar */}
                                {s.estado === 'CONTRATO_CARGADO' && (
                                    <button
                                        className={`px-2 py-1 rounded ${
                                            canValidate() 
                                                ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        }`}
                                        onClick={() => canValidate() && navigate(
                                            `/documentation/${s.numeroSolicitud}/contratos/validacion`
                                        )}
                                        disabled={!canValidate()}
                                        title={!canValidate() ? 'Solo analistas y administradores pueden validar contratos' : ''}
                                    >
                                        Validar Contratos
                                    </button>
                                )}


                                                                { /* Cuando llegue CONTRATO_CARGADO, voy a validar */}
                                {s.estado === 'CONTRATO_VALIDADO' && (
                                    <button
                                        className={`px-2 py-1 rounded ${
                                            user?.rol === 'ADMIN' 
                                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        }`}
                                        onClick={() => user?.rol === 'ADMIN' && navigate(`#`)}
                                        disabled={user?.rol !== 'ADMIN'}
                                        title={user?.rol !== 'ADMIN' ? 'Solo administradores pueden procesar desembolsos' : ''}
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


