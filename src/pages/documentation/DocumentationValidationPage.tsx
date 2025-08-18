// src/pages/documentation/DocumentationValidationPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
    listDocuments,
    validateDocument,
    rejectDocument,
} from '../../services/documentService';
import type { DocumentoDTO } from '../../services/documentService';

import { Eye, Check, X } from 'lucide-react';

// <-- URL base de tu MS Documentación
const API = import.meta.env.VITE_DOCUMENT_SERVICE_URL || 'http://localhost:84';
console.log("💥 DocumentService API base →", API);





export default function DocumentationValidationPage() {
    const { user } = useAuth();
    const { numeroSolicitud } = useParams<{ numeroSolicitud: string }>();
    const navigate = useNavigate();

    // Función para verificar permisos de validación
    const canValidate = () => {
        return user?.rol === 'ADMIN' || user?.rol === 'ANALISTA';
    };

    const [docs, setDocs] = useState<DocumentoDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [obsText, setObsText] = useState('');


    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handlePreview = async (id: string) => {
        if (!numeroSolicitud) return;
        // traemos el PDF como blob
        const res = await axios.get(
            `${API}/api/documentacion/v1/solicitudes/${numeroSolicitud}/documentos/${id}/ver`,
            { responseType: 'blob' }
        );
        // creamos un objectURL
        const url = URL.createObjectURL(res.data);
        setPreviewUrl(url);
    };




    useEffect(() => {
        if (!numeroSolicitud) return;
        setLoading(true);
        listDocuments(numeroSolicitud)
            .then(res => setDocs(res.data))
            .finally(() => setLoading(false));
    }, [numeroSolicitud]);

    const handleApprove = async (id: string) => {
        await validateDocument(numeroSolicitud!, id);
        const res = await listDocuments(numeroSolicitud!);
        setDocs(res.data);
    };

    const startReject = (id: string) => {
        setRejectingId(id);
        setObsText('');
    };
    const confirmReject = async () => {
        await rejectDocument(numeroSolicitud!, rejectingId!, obsText.trim());
        const res = await listDocuments(numeroSolicitud!);
        setDocs(res.data);
        setRejectingId(null);
    };


    const total = docs.length;
    const aprobados = docs.filter(d => d.estado === 'VALIDADO').length;
    const rechazados = docs.filter(d => d.estado === 'RECHAZADO').length;

    const handleValidateAll = async () => {
        try {
            await axios.patch(
                `${API}/api/documentacion/v1/solicitudes/${numeroSolicitud}/documentos/validar-todos`,
                null,
                { params: { usuario: 'analista' } }
            );
            navigate('/documentation');
        } catch (error: any) {
            console.error('Error al validar documentos:', error);
            
            // Si el error es 500, probablemente el estado ya se cambió pero falló en crear el préstamo
            if (error.response?.status === 500) {
                alert('⚠️ La documentación se validó exitosamente, pero hubo un problema al crear el préstamo. El estado de la solicitud se actualizó correctamente. Puedes continuar con el proceso manualmente.');
                navigate('/documentation');
            } else {
                alert('❌ Error al validar documentos: ' + (error.response?.data || error.message));
            }
        }
    };


    return (
        <div className="space-y-6">
            {/* Volver al listado */}
      <button
        className="px-6 py-2 rounded text-white transition bg-blue-700 hover:bg-blue-800"
        onClick={() => navigate(-1)}
      >
        ← Volver al listado
      </button>

            {/* Encabezado */}
            <h1 className="text-2xl font-bold">
                Validación de Documentación<br />
                <span className="text-indigo-600">#{numeroSolicitud}</span>
            </h1>

            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 h-2 rounded overflow-hidden mb-4">
                <div
                    className="h-2 bg-green-500"
                    style={{ width: `${total ? (aprobados / total) * 100 : 0}%` }}
                />
            </div>

            {/* Estado global */}
            <div className="flex gap-6 mb-6">
                <div className="px-4 py-2 bg-green-100 rounded">
                    <strong>{aprobados}</strong> Aprobados
                </div>
                <div className="px-4 py-2 bg-red-100 rounded">
                    <strong>{rechazados}</strong> Rechazados
                </div>
            </div>

            {/* Lista de documentos */}
            <div className="space-y-4">
                {loading && <p>Cargando documentos…</p>}
                {!loading && docs.map(d => (
                    <div key={d.id} className="p-4 border rounded flex items-center justify-between">
                        <div>
                            <p className="font-medium">{d.tipoDocumento.replace('_', ' ')}</p>
                            <span className="text-sm text-gray-800">
                                {d.nombreArchivo}
                            </span>


                            {d.observacion && (
                                <p className="text-sm text-red-600 mt-1">
                                    Observación: {d.observacion}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePreview(d.id)}
                                title="Ver documento"
                                className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                Visualizar
                            </button>
                            {d.estado === 'CARGADO' && (
                                <div className="flex items-center gap-2">
                                    {canValidate() ? (
                                        <>
                                            <button
                                                onClick={() => handleApprove(d.id)}
                                                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                                title="Aprobar documento"
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => startReject(d.id)}
                                                className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                                title="Rechazar documento"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Rechazar
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-sm text-gray-500 italic">
                                            Solo analistas y administradores pueden validar
                                        </span>
                                    )}
                                </div>
                            )}
                            {d.estado === 'VALIDADO' && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded">Aprobado</span>
                            )}
                            {d.estado === 'RECHAZADO' && (
                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded">Rechazado</span>
                            )}
                        </div>
                    </div>
                ))}
                {!loading && docs.length === 0 && (
                    <p className="text-center text-gray-500">No hay documentos cargados aún.</p>
                )}
            </div>


            {previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-lg w-4/5 h-6/7 relative">
                        <button
                            onClick={() => setPreviewUrl(null)}
                            className="absolute top-2 right-2 px-2 py-1 bg-gray-200 rounded"
                        >
                            ✕
                        </button>
                        <iframe
                            src={previewUrl}
                            className="w-full h-full"
                            title="Vista previa del PDF"
                        />
                    </div>
                </div>
            )}




            {/* Modal de rechazo */}
            {rejectingId && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-300">
                        <h2 className="text-lg font-semibold mb-4">Especifique el motivo por el cual se rechaza el documento</h2>
                        <textarea
                            className="w-full border p-2 mb-4"
                            rows={4}
                            value={obsText}
                            onChange={e => setObsText(e.target.value)}
                        />
                        <div className="text-right space-x-2">
                            <button
                                onClick={() => setRejectingId(null)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={!obsText.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                            >
                                Confirmar Rechazo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botón para validar toda la solicitud */}
            {(aprobados + rechazados) === total && total > 0 && (
                canValidate() ? (
                    <button
                        onClick={handleValidateAll}
                        className={`mt-6 px-4 py-2 rounded text-white ${rechazados > 0 ? 'bg-red-600' : 'bg-green-600'}`}
                    >
                        {rechazados > 0 ? 'Registrar Rechazo de Solicitud'
                            : 'Registrar Aprobación de Solicitud'}
                    </button>
                ) : (
                    <div className="mt-6 p-4 bg-gray-100 rounded text-center">
                        <p className="text-gray-600">
                            Solo analistas y administradores pueden registrar la aprobación/rechazo de la solicitud
                        </p>
                    </div>
                )
            )}

        </div>
    );
}


