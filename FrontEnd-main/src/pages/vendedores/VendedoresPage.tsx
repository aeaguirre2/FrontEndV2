import React, { useEffect, useState } from 'react';
import type { Vendedor } from '../../types/automotive-loan';
import {
  getVendedoresByRuc,
  createVendedor,
  updateVendedor,
  desactivarVendedor,
  getConcesionariosByEstado
} from '../../services/concesionarioService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Validación de cédula ecuatoriana
function validarCedulaEcuatoriana(cedula: string): boolean {
  if (!cedula || cedula.length !== 10) return false;
  const region = parseInt(cedula.substring(0, 2));
  if (region < 1 || region > 24) return false;
  const digitos = cedula.split('').map(Number);
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let mult = digitos[i] * (i % 2 === 0 ? 2 : 1);
    if (mult > 9) mult -= 9;
    suma += mult;
  }
  const verificador = (10 - (suma % 10)) % 10;
  return verificador === digitos[9];
}

const VendedoresPage: React.FC = () => {
  const [concesionarios, setConcesionarios] = useState<any[]>([]);
  const [selectedConcesionario, setSelectedConcesionario] = useState('');
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Vendedor | null>(null);
  const [form, setForm] = useState<Partial<Vendedor>>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    getConcesionariosByEstado('ACTIVO').then(data => setConcesionarios(data));
  }, []);

  useEffect(() => {
    if (selectedConcesionario) fetchVendedores();
    else setVendedores([]);
  }, [selectedConcesionario]);

  const fetchVendedores = async () => {
    setLoading(true);
    try {
      const res = await getVendedoresByRuc(selectedConcesionario);
      setVendedores(res);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (vendedor?: Vendedor) => {
    setSelected(vendedor || null);
    setForm(vendedor || {});
    setErrors({});
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelected(null);
    setForm({});
    setErrors({});
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.nombre || form.nombre.trim() === '') newErrors.nombre = 'El nombre es requerido';
    else if (form.nombre.length > 100) newErrors.nombre = 'Máximo 100 caracteres';
    if (!form.telefono || form.telefono.trim() === '') newErrors.telefono = 'El teléfono es requerido';
    else if (form.telefono.length > 20) newErrors.telefono = 'Máximo 20 caracteres';
    if (!form.email || form.email.trim() === '') newErrors.email = 'El email es requerido';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Formato de email inválido';
    else if (form.email.length > 60) newErrors.email = 'Máximo 60 caracteres';
    if (!form.estado) newErrors.estado = 'El estado es requerido';
    if (!form.cedula || form.cedula.trim() === '') newErrors.cedula = 'La cédula es requerida';
    else if (form.cedula.length > 20) newErrors.cedula = 'Máximo 20 caracteres';
    else if (!validarCedulaEcuatoriana(form.cedula)) newErrors.cedula = 'Cédula ecuatoriana inválida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (selected) {
      await updateVendedor(selectedConcesionario, selected.cedula, form);
    } else {
      await createVendedor(selectedConcesionario, form);
    }
    handleCloseForm();
    fetchVendedores();
  };

  const handleDesactivar = async (cedula: string) => {
    await desactivarVendedor(selectedConcesionario, cedula);
    fetchVendedores();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Vendedores</h1>
      <div className="mb-4 flex items-center gap-4">
        <select
          className="border rounded px-2 py-1"
          value={selectedConcesionario}
          onChange={e => setSelectedConcesionario(e.target.value)}
        >
          <option value="">Selecciona un concesionario</option>
          {concesionarios.map(c => (
            <option key={c.ruc} value={c.ruc}>{c.razonSocial}</option>
          ))}
        </select>
        <Button onClick={() => handleOpenForm()} disabled={!selectedConcesionario}>Nuevo Vendedor</Button>
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center">Cédula</th>
              <th className="px-4 py-2 text-center">Nombre</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Teléfono</th>
              <th className="px-4 py-2 text-center">Estado</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Cargando...</td></tr>
            ) : vendedores.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4">No hay vendedores</td></tr>
            ) : vendedores.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-2 text-center">{v.cedula}</td>
                <td className="px-4 py-2 text-center">{v.nombre}</td>
                <td className="px-4 py-2 text-center">{v.email}</td>
                <td className="px-4 py-2 text-center">{v.telefono}</td>
                <td className="px-4 py-2 text-center">{v.estado}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <Button size="sm" onClick={() => handleOpenForm(v)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDesactivar(v.cedula)}>Desactivar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{selected ? 'Editar Vendedor' : 'Nuevo Vendedor'}</h2>
            <div className="space-y-4">
              <Input name="cedula" label="Cédula" value={form.cedula || ''} onChange={handleChange} disabled={!!selected} />
              {errors.cedula && <div className="text-red-500 text-xs">{errors.cedula}</div>}
              <Input name="nombre" label="Nombre" value={form.nombre || ''} onChange={handleChange} />
              {errors.nombre && <div className="text-red-500 text-xs">{errors.nombre}</div>}
              <Input name="email" label="Email" value={form.email || ''} onChange={handleChange} />
              {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
              <Input name="telefono" label="Teléfono" value={form.telefono || ''} onChange={handleChange} />
              {errors.telefono && <div className="text-red-500 text-xs">{errors.telefono}</div>}
              <select name="estado" value={form.estado || ''} onChange={handleChange} className="w-full border rounded px-2 py-1">
                <option value="">Selecciona estado</option>
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
              {errors.estado && <div className="text-red-500 text-xs">{errors.estado}</div>}
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <Button onClick={handleCloseForm} variant="secondary">Cancelar</Button>
              <Button onClick={handleSave}>{selected ? 'Actualizar' : 'Crear'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendedoresPage; 