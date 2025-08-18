import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

interface Contract {
  id: string;
  numeroContrato: string;
  cliente: {
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
    telefono: string;
  };
  vehiculo: {
    marca: string;
    modelo: string;
    anio: number;
    placa: string;
    valor: number;
  };
  credito: {
    montoSolicitado: number;
    montoAprobado: number;
    entrada: number;
    montoFinanciar: number;
    tasaInteres: number;
    plazoMeses: number;
    cuotaMensual: number;
  };
  estado: 'PENDIENTE_FIRMA' | 'ACTIVO' | 'COMPLETADO' | 'CANCELADO' | 'VENCIDO';
  fechaCreacion: string;
  fechaFirma?: string;
  fechaVencimiento: string;
  observaciones?: string;
}

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      numeroContrato: 'CONT-2024-001',
      cliente: {
        nombre: 'Juan Carlos',
        apellido: 'Pérez González',
        cedula: '1234567890',
        email: 'juan.perez@email.com',
        telefono: '0987654321'
      },
      vehiculo: {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2024,
        placa: 'ABC-1234',
        valor: 25000
      },
      credito: {
        montoSolicitado: 25000,
        montoAprobado: 20000,
        entrada: 5000,
        montoFinanciar: 20000,
        tasaInteres: 9.5,
        plazoMeses: 60,
        cuotaMensual: 418.75
      },
      estado: 'PENDIENTE_FIRMA',
      fechaCreacion: '2024-03-15',
      fechaVencimiento: '2029-03-15',
      observaciones: 'Cliente con buen historial crediticio'
    },
    {
      id: '2',
      numeroContrato: 'CONT-2024-002',
      cliente: {
        nombre: 'María Elena',
        apellido: 'González Torres',
        cedula: '0987654321',
        email: 'maria.gonzalez@email.com',
        telefono: '0998765432'
      },
      vehiculo: {
        marca: 'Hyundai',
        modelo: 'Tucson',
        anio: 2023,
        placa: 'DEF-5678',
        valor: 35000
      },
      credito: {
        montoSolicitado: 35000,
        montoAprobado: 28000,
        entrada: 7000,
        montoFinanciar: 28000,
        tasaInteres: 8.5,
        plazoMeses: 72,
        cuotaMensual: 478.92
      },
      estado: 'ACTIVO',
      fechaCreacion: '2024-02-28',
      fechaFirma: '2024-03-05',
      fechaVencimiento: '2030-03-05'
    },
    {
      id: '3',
      numeroContrato: 'CONT-2024-003',
      cliente: {
        nombre: 'Carlos Alberto',
        apellido: 'Rodríguez Vega',
        cedula: '1122334455',
        email: 'carlos.rodriguez@email.com',
        telefono: '0987123456'
      },
      vehiculo: {
        marca: 'Nissan',
        modelo: 'Sentra',
        anio: 2024,
        placa: 'GHI-9012',
        valor: 22000
      },
      credito: {
        montoSolicitado: 22000,
        montoAprobado: 17600,
        entrada: 4400,
        montoFinanciar: 17600,
        tasaInteres: 11.5,
        plazoMeses: 48,
        cuotaMensual: 456.78
      },
      estado: 'ACTIVO',
      fechaCreacion: '2024-01-20',
      fechaFirma: '2024-01-25',
      fechaVencimiento: '2028-01-25'
    },
    {
      id: '4',
      numeroContrato: 'CONT-2023-015',
      cliente: {
        nombre: 'Ana Patricia',
        apellido: 'Morales Castro',
        cedula: '5566778899',
        email: 'ana.morales@email.com',
        telefono: '0976543210'
      },
      vehiculo: {
        marca: 'Chevrolet',
        modelo: 'Spark',
        anio: 2022,
        placa: 'JKL-3456',
        valor: 15000
      },
      credito: {
        montoSolicitado: 15000,
        montoAprobado: 12000,
        entrada: 3000,
        montoFinanciar: 12000,
        tasaInteres: 12.0,
        plazoMeses: 36,
        cuotaMensual: 398.57
      },
      estado: 'COMPLETADO',
      fechaCreacion: '2023-12-01',
      fechaFirma: '2023-12-08',
      fechaVencimiento: '2026-12-08'
    },
    {
      id: '5',
      numeroContrato: 'CONT-2024-004',
      cliente: {
        nombre: 'Roberto Luis',
        apellido: 'Silva Mendoza',
        cedula: '9988776655',
        email: 'roberto.silva@email.com',
        telefono: '0965432109'
      },
      vehiculo: {
        marca: 'Ford',
        modelo: 'Escape',
        anio: 2024,
        placa: 'MNO-7890',
        valor: 32000
      },
      credito: {
        montoSolicitado: 32000,
        montoAprobado: 25600,
        entrada: 6400,
        montoFinanciar: 25600,
        tasaInteres: 7.5,
        plazoMeses: 84,
        cuotaMensual: 378.24
      },
      estado: 'PENDIENTE_FIRMA',
      fechaCreacion: '2024-03-20',
      fechaVencimiento: '2031-03-20',
      observaciones: 'Cliente premium, tasa preferencial aplicada'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [filters, setFilters] = useState({
    estado: 'TODOS',
    search: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesEstado = filters.estado === 'TODOS' || contract.estado === filters.estado;
    const matchesSearch = !filters.search || 
      contract.numeroContrato.toLowerCase().includes(filters.search.toLowerCase()) ||
      contract.cliente.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
      contract.cliente.apellido.toLowerCase().includes(filters.search.toLowerCase()) ||
      contract.cliente.cedula.includes(filters.search) ||
      contract.vehiculo.marca.toLowerCase().includes(filters.search.toLowerCase()) ||
      contract.vehiculo.modelo.toLowerCase().includes(filters.search.toLowerCase());
    
    let matchesFecha = true;
    if (filters.fechaDesde) {
      matchesFecha = matchesFecha && contract.fechaCreacion >= filters.fechaDesde;
    }
    if (filters.fechaHasta) {
      matchesFecha = matchesFecha && contract.fechaCreacion <= filters.fechaHasta;
    }
    
    return matchesEstado && matchesSearch && matchesFecha;
  });

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContract(null);
  };

  const handleStatusChange = (id: string, newStatus: Contract['estado']) => {
    setContracts(prev => prev.map(contract => 
      contract.id === id 
        ? { 
            ...contract, 
            estado: newStatus,
            fechaFirma: newStatus === 'ACTIVO' && !contract.fechaFirma 
              ? new Date().toISOString().split('T')[0] 
              : contract.fechaFirma
          }
        : contract
    ));
  };

  const getStatusBadge = (estado: Contract['estado']) => {
    const statusStyles = {
      'PENDIENTE_FIRMA': 'bg-yellow-100 text-yellow-800',
      'ACTIVO': 'bg-green-100 text-green-800',
      'COMPLETADO': 'bg-blue-100 text-blue-800',
      'CANCELADO': 'bg-red-100 text-red-800',
      'VENCIDO': 'bg-gray-100 text-gray-800'
    };

    const statusLabels = {
      'PENDIENTE_FIRMA': 'Pendiente Firma',
      'ACTIVO': 'Activo',
      'COMPLETADO': 'Completado',
      'CANCELADO': 'Cancelado',
      'VENCIDO': 'Vencido'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[estado]}`}>
        {statusLabels[estado]}
      </span>
    );
  };

  const getUrgencyBadge = (fechaVencimiento: string) => {
    const today = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30 && diffDays > 0) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
          Vence en {diffDays} días
        </span>
      );
    } else if (diffDays <= 0) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Vencido
        </span>
      );
    }
    return null;
  };

  // Estadísticas
  const pendientesFirma = contracts.filter(c => c.estado === 'PENDIENTE_FIRMA').length;
  const activos = contracts.filter(c => c.estado === 'ACTIVO').length;
  const completados = contracts.filter(c => c.estado === 'COMPLETADO').length;
  const vencenProximo = contracts.filter(c => {
    const today = new Date();
    const vencimiento = new Date(c.fechaVencimiento);
    const diffDays = Math.ceil((vencimiento.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0 && c.estado === 'ACTIVO';
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contratos y Garantías</h1>
          <p className="text-gray-600">Administra contratos, garantías y documentos del proceso crediticio</p>
        </div>
        <Button onClick={() => handleViewContract(contracts[0])}>
          Nuevo Contrato
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes Firma</p>
              <p className="text-2xl font-bold text-yellow-600">{pendientesFirma}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-xl">✍️</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">{activos}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-xl">📄</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-blue-600">{completados}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencen Pronto</p>
              <p className="text-2xl font-bold text-orange-600">{vencenProximo}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Buscar contratos..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.estado}
            onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE_FIRMA">Pendiente Firma</option>
            <option value="ACTIVO">Activos</option>
            <option value="COMPLETADO">Completados</option>
            <option value="CANCELADO">Cancelados</option>
            <option value="VENCIDO">Vencidos</option>
          </select>

          <Input
            type="date"
            placeholder="Fecha desde"
            value={filters.fechaDesde}
            onChange={(e) => setFilters(prev => ({ ...prev, fechaDesde: e.target.value }))}
          />

          <Input
            type="date"
            placeholder="Fecha hasta"
            value={filters.fechaHasta}
            onChange={(e) => setFilters(prev => ({ ...prev, fechaHasta: e.target.value }))}
          />

          <Button 
            variant="secondary" 
            onClick={() => setFilters({ estado: 'TODOS', search: '', fechaDesde: '', fechaHasta: '' })}
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contrato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crédito
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contract.numeroContrato}</div>
                      <div className="text-sm text-gray-500">
                        Creado: {new Date(contract.fechaCreacion).toLocaleDateString('es-EC')}
                      </div>
                      {contract.fechaFirma && (
                        <div className="text-sm text-gray-500">
                          Firmado: {new Date(contract.fechaFirma).toLocaleDateString('es-EC')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {contract.cliente.nombre} {contract.cliente.apellido}
                      </div>
                      <div className="text-sm text-gray-500">{contract.cliente.cedula}</div>
                      <div className="text-sm text-gray-500">{contract.cliente.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {contract.vehiculo.marca} {contract.vehiculo.modelo}
                      </div>
                      <div className="text-sm text-gray-500">
                        {contract.vehiculo.anio} - {contract.vehiculo.placa}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(contract.vehiculo.valor)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(contract.credito.montoFinanciar)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {contract.credito.tasaInteres}% - {contract.credito.plazoMeses} meses
                      </div>
                      <div className="text-sm text-gray-500">
                        Cuota: {formatCurrency(contract.credito.cuotaMensual)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      {getStatusBadge(contract.estado)}
                      {getUrgencyBadge(contract.fechaVencimiento)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleViewContract(contract)}
                      >
                        Ver Detalles
                      </Button>
                      {contract.estado === 'PENDIENTE_FIRMA' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(contract.id, 'ACTIVO')}
                        >
                          Firmar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={`Contrato ${selectedContract?.numeroContrato || ''}`}
      >
        {selectedContract && (
          <div className="space-y-6">
            {/* Client Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información del Cliente</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                  <p className="text-sm text-gray-900">
                    {selectedContract.cliente.nombre} {selectedContract.cliente.apellido}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cédula</label>
                  <p className="text-sm text-gray-900">{selectedContract.cliente.cedula}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedContract.cliente.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <p className="text-sm text-gray-900">{selectedContract.cliente.telefono}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información del Vehículo</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehículo</label>
                  <p className="text-sm text-gray-900">
                    {selectedContract.vehiculo.marca} {selectedContract.vehiculo.modelo} {selectedContract.vehiculo.anio}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Placa</label>
                  <p className="text-sm text-gray-900">{selectedContract.vehiculo.placa}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor del Vehículo</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedContract.vehiculo.valor)}</p>
                </div>
              </div>
            </div>

            {/* Credit Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información del Crédito</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monto Solicitado</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedContract.credito.montoSolicitado)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monto Aprobado</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedContract.credito.montoAprobado)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entrada</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedContract.credito.entrada)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monto a Financiar</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedContract.credito.montoFinanciar)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tasa de Interés</label>
                  <p className="text-sm text-gray-900">{selectedContract.credito.tasaInteres}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plazo</label>
                  <p className="text-sm text-gray-900">{selectedContract.credito.plazoMeses} meses</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cuota Mensual</label>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(selectedContract.credito.cuotaMensual)}</p>
                </div>
              </div>
            </div>

            {/* Contract Status */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Estado del Contrato</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado Actual</label>
                  <div className="mt-1">{getStatusBadge(selectedContract.estado)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedContract.fechaVencimiento).toLocaleDateString('es-EC')}
                  </p>
                </div>
              </div>
              {selectedContract.observaciones && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                  <p className="text-sm text-gray-900">{selectedContract.observaciones}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
              {selectedContract.estado === 'PENDIENTE_FIRMA' && (
                <Button onClick={() => {
                  handleStatusChange(selectedContract.id, 'ACTIVO');
                  handleCloseModal();
                }}>
                  Firmar Contrato
                </Button>
              )}
              <Button>
                Descargar PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContractsPage;