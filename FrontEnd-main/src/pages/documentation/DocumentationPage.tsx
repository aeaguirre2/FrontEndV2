import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listDocuments, uploadDocument } from '../../services/documentService';
import type { DocumentoDTO } from '../../services/documentService';

export default function DocumentationPage() {
  const { numeroSolicitud } = useParams<{ numeroSolicitud: string }>();
  const tiposPermitidos = ['CEDULA_IDENTIDAD', 'ROL_PAGOS', 'ESTADO_CUENTA_BANCARIA'];

  const navigate = useNavigate();
  const [archivos, setArchivos] = useState<(File | null)[]>([null, null, null]);
  const [tipos, setTipos] = useState<string[]>(['', '', '']);
  const [docs, setDocs] = useState<DocumentoDTO[]>([]);

  // Sólo activo si los tres tienen tipo y archivo
  const todosListos = archivos.every(Boolean) && tipos.every(Boolean);

  // Carga inicial
  useEffect(() => {
    if (!numeroSolicitud) return;
    listDocuments(numeroSolicitud)
      .then(r => setDocs(r.data))
      .catch(console.error);
  }, [numeroSolicitud]);

  const onFileChange = (i: number) => (e: ChangeEvent<HTMLInputElement>) =>
    setArchivos(a => a.map((f, idx) => idx === i ? e.target.files?.[0] || null : f));

  const onTipoChange = (i: number) => (e: ChangeEvent<HTMLSelectElement>) =>
    setTipos(t => t.map((v, idx) => idx === i ? e.target.value : v));

  const onGuardarDocs = async () => {
    if (!numeroSolicitud || !todosListos) return;
    for (let i = 0; i < 3; i++) {
      await uploadDocument(numeroSolicitud, archivos[i]!, tipos[i])
        .catch(err => console.error(`Error subiendo ${tipos[i]}:`, err));
    }
    const r = await listDocuments(numeroSolicitud);
    setDocs(r.data);
    alert('Documentos cargados correctamente');
  };

  return (
    <div className="space-y-6">
      {/* ← Volver */}
      <button
        className="px-6 py-2 rounded text-white transition bg-blue-700 hover:bg-blue-800"
        onClick={() => navigate(-1)}
      >
        ← Volver al listado
      </button>


      <h1 className="text-2xl font-bold">
        Documentación para solicitud{' '}
        <span className="text-indigo-600">{numeroSolicitud}</span>
      </h1>

      {/* --- Formulario de carga --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map(i => {
          // Sólo permitimos el tipo propio o aquellos no ya elegidos
          const disponibles = tiposPermitidos.filter(
            t => tipos[i] === t || !tipos.includes(t)
          );

          return (
            <div
              key={i}
              className="p-6 border rounded-lg shadow-md min-h-[200px] flex flex-col justify-between"
            >
              {/* Desplegable con opciones dinámicas */}
              <select
                className="w-full border px-3 py-2 rounded"
                value={tipos[i]}
                onChange={onTipoChange(i)}
              >
                <option value="">-- Tipo de documento --</option>
                {disponibles.map(t => (
                  <option key={t} value={t}>
                    {t.replace('_', ' ')}
                  </option>
                ))}
              </select>

              {/* Botón estilizado para elegir archivo */}
              <div className="mt-4">
                <input
                  type="file"
                  accept="application/pdf"
                  id={`file-${i}`}
                  className="hidden"
                  onChange={onFileChange(i)}
                />
                <label
                  htmlFor={`file-${i}`}
                  className={`
                    inline-block w-full text-center
                    px-4 py-2
                    ${archivos[i]
                      ? 'bg-yellow-100 text-gray-800'
                      : 'bg-blue-600 text-white hover:bg-blue-700'}
                    rounded
                    cursor-pointer
                    transition
                  `}
                >
                  {archivos[i]?.name ?? 'Elegir archivo'}
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón Guardar sólo activo si todosListos */}
      <button
        disabled={!todosListos}
        onClick={onGuardarDocs}
        className={`
          px-6 py-2 rounded text-white transition
          ${todosListos
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-400 cursor-not-allowed'}
        `}
      >
        Guardar Documentación
      </button>

      <hr />

      {/* --- Tabla de documentos existentes --- */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Documentos guardados</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-3 py-2">Archivo</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Estado</th>
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
                <td className="px-3 py-2 text-sm text-gray-800">
                  {d.nombreArchivo}
                </td>
                <td className="px-3 py-2">
                  {d.tipoDocumento.replace('_', ' ')}
                </td>
                <td
                  className={`
                    px-3 py-2
                    ${d.estado === 'VALIDADO'
                      ? 'text-green-600'
                      : d.estado === 'RECHAZADO'
                        ? 'text-red-600'
                        : 'text-gray-600'}
                  `}
                >
                  {d.estado.replace('_', ' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
