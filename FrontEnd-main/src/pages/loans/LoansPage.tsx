import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { originacionService } from '../../services/originacionService';

const LoansPage: React.FC = () => {
  const [cedula, setCedula] = useState('');
  const [clienteInfo, setClienteInfo] = useState<any>(null);
  const [showFullForm, setShowFullForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCedula(e.target.value);
    setError(null);
    setSuccess(null);
    setClienteInfo(null);
    setShowFullForm(false);
  };

  const consultarCedula = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setClienteInfo(null);
    setShowFullForm(false);
    try {
      const res = await originacionService.consultarClientePorCedula(cedula);
      setClienteInfo(res);
      if (res.idClienteCore) {
        setSuccess('El cliente ya existe en el core bancario.');
        setShowFullForm(false);
      } else {
        setShowFullForm(true);
      }
    } catch (e: any) {
      setShowFullForm(true); // No existe, pedir datos completos
      setError('No existe en core bancario. Ingrese los datos completos.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registrarProspectoCompleto = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await originacionService.registrarClienteProspecto({ ...formData, cedula });
      setSuccess('Cliente prospecto registrado exitosamente con todos los datos.');
      setShowFullForm(false);
      setFormData({});
    } catch (e: any) {
      const msg = e?.response?.data?.detalle || e?.message || '';
      if (msg.includes('Ya existe un cliente con la cédula')) {
        setError('El cliente prospecto ya se encuentra registrado.');
      } else {
        setError('Error al registrar cliente prospecto.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Préstamo</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Registrar Cliente Prospecto</h3>
        <form onSubmit={consultarCedula} className="flex items-end space-x-4 mb-4">
          <Input
            label="Cédula"
            name="cedula"
            value={cedula}
            onChange={handleCedulaChange}
            placeholder="Ingrese la cédula"
            required
            maxLength={10}
          />
          <Button type="submit" loading={loading}>
            Consultar
          </Button>
        </form>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}

        {clienteInfo && clienteInfo.idClienteCore && !showFullForm && (
          <Button onClick={async () => {
            setLoading(true);
            setError(null);
            setSuccess(null);
            try {
              await originacionService.registrarClienteProspecto({ cedula });
              setSuccess('Cliente prospecto registrado exitosamente solo con cédula.');
            } catch (e: any) {
              const msg = e?.response?.data?.detalle || e?.message || '';
              if (msg.includes('Ya existe un cliente con la cédula')) {
                setError('El cliente prospecto ya se encuentra registrado.');
              } else {
                setError('Error al registrar cliente prospecto.');
              }
            } finally {
              setLoading(false);
            }
          }} loading={loading}>
            Registrar prospecto
          </Button>
        )}

        {showFullForm && (
          <form onSubmit={registrarProspectoCompleto} className="space-y-4 mt-4">
            <Input label="Cédula" name="cedula" value={cedula} onChange={handleFormChange} required readOnly />
            <Input label="Nombres" name="nombres" value={formData.nombres || ''} onChange={handleFormChange} required />
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select name="genero" value={formData.genero || ''} onChange={handleSelectChange} required className="w-full border rounded px-2 py-1">
                  <option value="">Seleccionar...</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div className="flex-1">
                <Input label="Fecha de nacimiento" name="fechaNacimiento" type="date" value={formData.fechaNacimiento || ''} onChange={handleFormChange} required />
              </div>
            </div>
            <Input label="Nivel de estudio" name="nivelEstudio" value={formData.nivelEstudio || ''} onChange={handleFormChange} />
            <Input label="Estado civil" name="estadoCivil" value={formData.estadoCivil || ''} onChange={handleFormChange} />
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input label="Ingresos" name="ingresos" type="number" value={formData.ingresos || ''} onChange={handleFormChange} />
              </div>
              <div className="flex-1">
                <Input label="Egresos" name="egresos" type="number" value={formData.egresos || ''} onChange={handleFormChange} />
              </div>
            </div>
            <Input label="Actividad económica" name="actividadEconomica" value={formData.actividadEconomica || ''} onChange={handleFormChange} />
            <Input label="Correo transaccional" name="correoTransaccional" value={formData.correoTransaccional || ''} onChange={handleFormChange} />
            <Input label="Teléfono transaccional" name="telefonoTransaccional" value={formData.telefonoTransaccional || ''} onChange={handleFormChange} />
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de teléfono</label>
                <select name="telefonoTipo" value={formData.telefonoTipo || ''} onChange={handleSelectChange} className="w-full border rounded px-2 py-1">
                  <option value="">Seleccionar...</option>
                  <option value="CELULAR">Celular</option>
                  <option value="RESIDENCIAL">Residencial</option>
                  <option value="LABORAL">Laboral</option>
                </select>
              </div>
              <div className="flex-1">
                <Input label="Número de teléfono" name="telefonoNumero" value={formData.telefonoNumero || ''} onChange={handleFormChange} />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de dirección</label>
                <select name="direccionTipo" value={formData.direccionTipo || ''} onChange={handleSelectChange} className="w-full border rounded px-2 py-1">
                  <option value="">Seleccionar...</option>
                  <option value="DOMICILIO">Domicilio</option>
                  <option value="LABORAL">Laboral</option>
                </select>
              </div>
              <div className="flex-1">
                <Input label="Código postal" name="direccionCodigoPostal" value={formData.direccionCodigoPostal || ''} onChange={handleFormChange} />
              </div>
            </div>
            <Input label="Dirección línea 1" name="direccionLinea1" value={formData.direccionLinea1 || ''} onChange={handleFormChange} />
            <Input label="Dirección línea 2" name="direccionLinea2" value={formData.direccionLinea2 || ''} onChange={handleFormChange} />
            <Input label="Código geográfico" name="direccionGeoCodigo" value={formData.direccionGeoCodigo || ''} onChange={handleFormChange} />
            <Button type="submit" loading={loading}>
              Registrar Prospecto
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoansPage;