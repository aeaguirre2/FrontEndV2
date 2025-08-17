// src/services/documentService.ts


import axios from 'axios';
import type { AxiosResponse } from 'axios';
const API = import.meta.env.VITE_DOCUMENT_SERVICE_URL;

export interface DocumentoDTO {
  id: string;
  numeroSolicitud: string;
  tipoDocumento: string;
  nombreArchivo: string;
  rutaStorage: string;       // aquí llega tu URL presignada
  fechaCarga: string;        // ISO
  fechaActualizacion: string;// ISO
  version: number;
  estado: 'CARGADO' | 'VALIDADO' | 'RECHAZADO';
  observacion?: string;      // Solo si está RECHAZADO
}

// 1. Listar documentos
export function listDocuments(numeroSolicitud: string) {
  return axios.get<DocumentoDTO[]>(
    `${API}/solicitudes/${numeroSolicitud}/documentos`
  );
}

// 2. Subir un documento
export function uploadDocument(
  numeroSolicitud: string,
  file: File,
  tipoDocumento: string
): Promise<AxiosResponse<DocumentoDTO>> {
  const form = new FormData();
  form.append('archivo', file);
  form.append('tipoDocumento', tipoDocumento);
  return axios.post<DocumentoDTO>(
    `${API}/solicitudes/${numeroSolicitud}/documentos`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
}

// 3. Validar un documento
export function validateDocument(numeroSolicitud: string, id: string) {
  return axios.patch<DocumentoDTO>(
    `${API}/solicitudes/${numeroSolicitud}/documentos/${id}/validar`
  );
}

// 4. Rechazar un documento
export function rejectDocument(numeroSolicitud: string, id: string, observacion: string) {
  return axios.patch<DocumentoDTO>(
    `${API}/solicitudes/${numeroSolicitud}/documentos/${id}/rechazar`,
    { observacion }
  );
}


export function notifyContractLoaded(
  numeroSolicitud: string,
  usuario: string
): Promise<AxiosResponse<void>> {
  return axios.patch(
    `${API}/solicitudes/${numeroSolicitud}/documentos/contratos-cargados`,
    null,
    { params: { usuario } }
  );
}

// src/services/documentService.ts
export function validateAllContracts(numeroSolicitud: string, usuario: string) {
  return axios.patch(
    `${API}/solicitudes/${numeroSolicitud}/documentos/validar-contratos`,
    null,
    { params: { usuario } }
  );
}


