// src/pages/contracts/ContractsValidationPage.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import {
    listDocuments,
    validateDocument,
    rejectDocument,
} from '../../services/documentService'
import type { DocumentoDTO } from '../../services/documentService'
import { Eye, Check, X } from 'lucide-react'


import { validateAllContracts } from '../../services/documentService'
import { MICROSERVICES } from '../../constants';


const API = MICROSERVICES.DOCUMENTACION; 

console.log("💥 DocumentService API base →", API);

export default function ContractsValidationPage() {
    const { user } = useAuth();
    const { numeroSolicitud } = useParams<{ numeroSolicitud: string }>()
    const navigate = useNavigate()

    // Función para verificar permisos de validación
    const canValidate = () => {
        return user?.rol === 'ADMIN' || user?.rol === 'ANALISTA';
    };
    const [docs, setDocs] = useState<DocumentoDTO[]>([])
    const [loading, setLoading] = useState(false)
    const [rejectingId, setRejectingId] = useState<string | null>(null)
    const [obsText, setObsText] = useState('')
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!numeroSolicitud) return
        setLoading(true)
        listDocuments(numeroSolicitud)
            .then(r => setDocs(r.data))
            .finally(() => setLoading(false))
    }, [numeroSolicitud])

    const contratos = docs.filter(d =>
        d.tipoDocumento === 'CONTRATO' || d.tipoDocumento === 'PAGARES'
    )
    const total = contratos.length
    const apr = contratos.filter(c => c.estado === 'VALIDADO').length
    const rej = contratos.filter(c => c.estado === 'RECHAZADO').length

    const allDone = total > 0 && apr + rej === total

    const handlePreview = async (id: string) => {
        if (!numeroSolicitud) return
        const res = await axios.get(
            `${API}/v1/solicitudes/${numeroSolicitud}/documentos/${id}/ver`,
            { responseType: 'blob' }
        )
        setPreviewUrl(URL.createObjectURL(res.data))
    }
    const handleApprove = async (id: string) => {
        await validateDocument(numeroSolicitud!, id)
        setDocs((await listDocuments(numeroSolicitud!)).data)
    }
    const startReject = (id: string) => {
        setRejectingId(id); setObsText('')
    }
    const confirmReject = async () => {
        await rejectDocument(numeroSolicitud!, rejectingId!, obsText.trim())
        setDocs((await listDocuments(numeroSolicitud!)).data)
        setRejectingId(null)
    }

    return (
        <div className="space-y-6 p-6">
            <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => navigate(-1)}
            >
                ← Volver al listado
            </button>
            <h1 className="text-2xl font-bold">Validación de Contratos<br />
                <span className="text-indigo-600">#{numeroSolicitud}</span>
            </h1>

            <div className="space-y-4">
                {loading && <p>Cargando…</p>}
                {!loading && contratos.map(d => (
                    <div key={d.id} className="border p-4 flex justify-between">
                        <div>
                            <p className="font-medium">{d.tipoDocumento}</p>
                            <p className="text-sm">{d.nombreArchivo}</p>
                            {d.observacion && <p className="text-red-600">Obs: {d.observacion}</p>}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePreview(d.id)}
                                title="Ver documento"
                                className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                Visualizar
                            </button>
                            {d.estado === 'CARGADO' && (
                                canValidate() ? (
                                    <>
                                        <button
                                            onClick={() => handleApprove(d.id)}
                                            className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                            title="Aprobar contrato"
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
                                )
                            )}
                            {d.estado === 'VALIDADO' && (
                                <span className="px-3 py-2 bg-green-400 text-black-800 rounded">Aprobado</span>
                            )}
                            {d.estado === 'RECHAZADO' && (
                                <span className="px-3 py-2 bg-red-400 text-red-800 rounded">Rechazado</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de rechazo */}
            {rejectingId && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-300">
                        <h2 className="text-lg font-semibold mb-4">Especifique el motivo por el cual se rechaza el contrato</h2>
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

            {/* Botón final: aprobar o rechazar toda la Solicitud */}
            {allDone && (
                canValidate() ? (
                    <button
                        onClick={async () => {
                            await validateAllContracts(numeroSolicitud!, 'analista');
                            navigate('/api/banco-frontend/documentation');
                        }}
                        className={`inline-flex items-center px-4 py-2 rounded text-white transition ${rej > 0 
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {rej > 0
                            ? 'Registrar Rechazo de Contratos'
                            : 'Registrar Aprobación de Contratos'}
                    </button>
                ) : (
                    <div className="mt-6 p-4 bg-gray-100 rounded text-center">
                        <p className="text-gray-600">
                            Solo analistas y administradores pueden registrar la aprobación/rechazo de contratos
                        </p>
                    </div>
                )
            )}

        </div>
    )
}


