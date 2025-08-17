// src/pages/documentation/ContractUploadPage.tsx
import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  listDocuments,
  uploadDocument,
  notifyContractLoaded
} from '../../services/documentService';
import type { DocumentoDTO } from '../../services/documentService';

export default function ContractUploadPage() {
  const { numeroSolicitud } = useParams<{ numeroSolicitud: string }>();
  const navigate = useNavigate();

  // Sólo estos dos tipos
  const tiposPermitidos = ['CONTRATO', 'PAGARES'];

  // estado local: dos ranuras
  const [archivos, setArchivos] = useState<(File | null)[]>([null, null]);
  const [tipos, setTipos] = useState<string[]>(['', '']);
  const [docs, setDocs] = useState<DocumentoDTO[]>([]);

  // habilita botón sólo si ambas ranuras tienen archivo + tipo
  const todosListos = archivos.every(Boolean) && tipos.every(Boolean);

  // al montar, lee los ya subidos
  useEffect(() => {
    if (!numeroSolicitud) return;
    listDocuments(numeroSolicitud)
      .then(r => setDocs(r.data))
      .catch(console.error);
  }, [numeroSolicitud]);

  const onFileChange = (i: number) => (e: ChangeEvent<HTMLInputElement>) =>
    setArchivos(a => a.map((f, idx) => idx === i ? e.target.files?.[0] ?? null : f));

  const onTipoChange = (i: number) => (e: ChangeEvent<HTMLSelectElement>) =>
    setTipos(t => t.map((v, idx) => idx === i ? e.target.value : v));

  const onGuardar = async () => {
    if (!numeroSolicitud || !todosListos) return;
    // sube uno a uno
    for (let i = 0; i < 2; i++) {
      try {
        await uploadDocument(numeroSolicitud, archivos[i]!, tipos[i]);
      } catch (err) {
        console.error(`Error subiendo ${tipos[i]}:`, err);
      }
    }
    // notifica al back que ya cargaste los contratos
    await notifyContractLoaded(numeroSolicitud, 'analista')
      .catch(console.error);
    // recarga y lleva a la página de validación
    const r = await listDocuments(numeroSolicitud);
    setDocs(r.data);
    //navigate(`/documentation/${numeroSolicitud}/validacion`);
  };

  return (
    <div className="space-y-6">
      {/* ← Volver */}
      <button
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        ← Volver al listado
      </button>

      <h1 className="text-2xl font-bold">
        Carga de Contrato y Pagaré<br/>
        <span className="text-indigo-600">#{numeroSolicitud}</span>
      </h1>

      {/* formulario de 2 documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map(i => {
          // limitar dropdown a lo no elegido aún
          const disponibles = tiposPermitidos.filter(
            t => tipos[i] === t || !tipos.includes(t)
          );
          return (
            <div key={i} className="p-6 border rounded-lg shadow-sm flex flex-col justify-between">
              <select
                className="w-full border px-3 py-2 rounded"
                value={tipos[i]}
                onChange={onTipoChange(i)}
              >
                <option value="">-- Tipo de documento --</option>
                {disponibles.map(t => (
                  <option key={t} value={t}>{t.replace('_',' ')}</option>
                ))}
              </select>

              <input
                type="file"
                accept="application/pdf"
                id={`file-${i}`}
                className="hidden"
                onChange={onFileChange(i)}
              />
              <label
                htmlFor={`file-${i}`}
                className={`mt-4 inline-block w-full text-center px-4 py-2 rounded cursor-pointer transition
                  ${archivos[i]
                    ? 'bg-yellow-100 text-gray-800'
                    : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {archivos[i]?.name ?? 'Elegir archivo PDF'}
              </label>
            </div>
          );
        })}
      </div>

      {/* botón guardar */}
      <button
        disabled={!todosListos}
        onClick={onGuardar}
        className={`px-6 py-2 rounded text-white transition
          ${todosListos
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-400 cursor-not-allowed'}`}
      >
        {todosListos ? 'Subir Contrato y Pagaré' : 'Completa ambos documentos'}
      </button>

      <hr/>

      {/* tabla de ya subidos */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Documentos existentes</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">Archivo</th>
              <th className="px-3 py-2 text-left">Tipo</th>
              <th className="px-3 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No hay documentos cargados aún.
                </td>
              </tr>
            )}
            {docs.map(d => (
              <tr key={d.id} className="border-t">
                <td className="px-3 py-2 text-sm">{d.nombreArchivo}</td>
                <td className="px-3 py-2">{d.tipoDocumento.replace('_',' ')}</td>
                <td className={`px-3 py-2
                  ${d.estado==='VALIDADO'?'text-green-600':d.estado==='RECHAZADO'?'text-red-600':'text-gray-600'}`}>
                  {d.estado.replace('_',' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);
}


