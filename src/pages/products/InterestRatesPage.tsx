import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

interface InterestRate {
  id: string;
  idProductoCredito: string;
  nombreProducto: string;
  valorTasa: number;
  fechaInicioVigencia: string;
  fechaFinVigencia: string;
  estado: 'ACTIVO' | 'INACTIVO';
  fechaCreacion: string;
}

const InterestRatesPage: React.FC = () => {
  const [rates, setRates] = useState<InterestRate[]>([
    {
      id: '1',
      idProductoCredito: 'CAR-001',
      nombreProducto: 'Crédito Vehículo Nuevo',
      valorTasa: 9.5,
      fechaInicioVigencia: '2024-01-01',
      fechaFinVigencia: '2024-12-31',
      estado: 'ACTIVO',
      fechaCreacion: '2024-01-15'
    },
    {
      id: '2',
      idProductoCredito: 'CAR-002',
      nombreProducto: 'Crédito Vehículo Usado',
      valorTasa: 11.5,
      fechaInicioVigencia: '2024-01-01',
      fechaFinVigencia: '2024-12-31',
      estado: 'ACTIVO',
      fechaCreacion: '2024-01-15'
    },
    {
      id: '3',
      idProductoCredito: 'CAR-003',
      nombreProducto: 'Crédito Premium',
      valorTasa: 8.5,
      fechaInicioVigencia: '2024-02-01',
      fechaFinVigencia: '2024-12-31',
      estado: 'ACTIVO',
      fechaCreacion: '2024-02-01'
    },
    {
      id: '4',
      idProductoCredito: 'CAR-004',
      nombreProducto: 'Crédito Ecológico',
      valorTasa: 7.5,
      fechaInicioVigencia: '2024-02-15',
      fechaFinVigencia: '2024-12-31',
      estado: 'ACTIVO',
      fechaCreacion: '2024-02-15'
    },
    {
      id: '5',
      idProductoCredito: 'CAR-001',
      nombreProducto: 'Crédito Vehículo Nuevo',
      valorTasa: 10.0,
      fechaInicioVigencia: '2023-01-01',
      fechaFinVigencia: '2023-12-31',
      estado: 'INACTIVO',
      fechaCreacion: '2023-01-15'
    },
    {
      id: '6',
      idProductoCredito: 'CAR-005',
      nombreProducto: 'Crédito Motocicletas',
      valorTasa: 12.5,
      fechaInicioVigencia: '2024-01-10',
      fechaFinVigencia: '2024-12-31',
      estado: 'INACTIVO',
      fechaCreacion: '2024-01-10'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRate, setSelectedRate] = useState<InterestRate | null>(null);
  const [filters, setFilters] = useState({
    estado: 'TODOS',
    producto: 'TODOS',
    search: ''
  });

  const [formData, setFormData] = useState({
    idProductoCredito: '',
    valorTasa: '',
    fechaInicioVigencia: '',
    fechaFinVigencia: '',
    estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO'
  });

  // Productos simulados para el selector
  const products = [
    { id: 'CAR-001', nombre: 'Crédito Vehículo Nuevo' },
    { id: 'CAR-002', nombre: 'Crédito Vehículo Usado' },
    { id: 'CAR-003', nombre: 'Crédito Premium' },
    { id: 'CAR-004', nombre: 'Crédito Ecológico' },
    { id: 'CAR-005', nombre: 'Crédito Motocicletas' }
  ];

  const filteredRates = rates.filter(rate => {
    const matchesEstado = filters.estado === 'TODOS' || rate.estado === filters.estado;
    const matchesProducto = filters.producto === 'TODOS' || rate.idProductoCredito === filters.producto;
    const matchesSearch = !filters.search || 
      rate.nombreProducto.toLowerCase().includes(filters.search.toLowerCase()) ||
      rate.idProductoCredito.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesEstado && matchesProducto && matchesSearch;
  });

  const handleOpenModal = (rate?: InterestRate) => {
    if (rate) {
      setSelectedRate(rate);
      setFormData({
        idProductoCredito: rate.idProductoCredito,
        valorTasa: rate.valorTasa.toString(),
        fechaInicioVigencia: rate.fechaInicioVigencia,
        fechaFinVigencia: rate.fechaFinVigencia,
        estado: rate.estado
      });
    } else {
      setSelectedRate(null);
      setFormData({
        idProductoCredito: '',
        valorTasa: '',
        fechaInicioVigencia: '',
        fechaFinVigencia: '',
        estado: 'ACTIVO'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRate(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedProduct = products.find(p => p.id === formData.idProductoCredito);
    
    const newRate: InterestRate = {
      id: selectedRate?.id || (Date.now().toString()),
      idProductoCredito: formData.idProductoCredito,
      nombreProducto: selectedProduct?.nombre || '',
      valorTasa: parseFloat(formData.valorTasa),
      fechaInicioVigencia: formData.fechaInicioVigencia,
      fechaFinVigencia: formData.fechaFinVigencia,
      estado: formData.estado,
      fechaCreacion: selectedRate?.fechaCreacion || new Date().toISOString().split('T')[0]
    };

    if (selectedRate) {
      setRates(prev => prev.map(r => r.id === selectedRate.id ? newRate : r));
    } else {
      setRates(prev => [...prev, newRate]);
    }

    handleCloseModal();
  };

  const handleToggleStatus = (id: string) => {
    setRates(prev => prev.map(rate => 
      rate.id === id 
        ? { ...rate, estado: rate.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
        : rate
    ));
  };

  const getStatusBadge = (estado: string) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        estado === 'ACTIVO' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {estado}
      </span>
    );
  };

  const isVigente = (fechaInicio: string, fechaFin: string) => {
    const today = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return today >= inicio && today <= fin;
  };

  const getVigenciaBadge = (fechaInicio: string, fechaFin: string) => {
    const vigente = isVigente(fechaInicio, fechaFin);
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        vigente 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {vigente ? 'Vigente' : 'No Vigente'}
      </span>
    );
  };

  const activeRates = rates.filter(r => r.estado === 'ACTIVO').length;
  const averageRate = rates.length > 0 
    ? rates.filter(r => r.estado === 'ACTIVO').reduce((sum, r) => sum + r.valorTasa, 0) / rates.filter(r => r.estado === 'ACTIVO').length
    : 0;
  const vigentRates = rates.filter(r => r.estado === 'ACTIVO' && isVigente(r.fechaInicioVigencia, r.fechaFinVigencia)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasas de Interés</h1>
          <p className="text-gray-600">Configura y administra las tasas de interés por producto crediticio</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          Nueva Tasa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasas Activas</p>
              <p className="text-2xl font-bold text-blue-600">{activeRates}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa Promedio</p>
              <p className="text-2xl font-bold text-green-600">{averageRate.toFixed(2)}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasas Vigentes</p>
              <p className="text-2xl font-bold text-purple-600">{vigentRates}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-xl">⏰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar tasas..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.producto}
            onChange={(e) => setFilters(prev => ({ ...prev, producto: e.target.value }))}
          >
            <option value="TODOS">Todos los productos</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.nombre}</option>
            ))}
          </select>

          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.estado}
            onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
          </select>

          <Button 
            variant="secondary" 
            onClick={() => setFilters({ estado: 'TODOS', producto: 'TODOS', search: '' })}
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasa (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigencia
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
              {filteredRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rate.nombreProducto}</div>
                      <div className="text-sm text-gray-500">{rate.idProductoCredito}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-blue-600">{rate.valorTasa}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(rate.fechaInicioVigencia).toLocaleDateString('es-EC')} - {new Date(rate.fechaFinVigencia).toLocaleDateString('es-EC')}
                    </div>
                    <div className="mt-1">
                      {getVigenciaBadge(rate.fechaInicioVigencia, rate.fechaFinVigencia)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(rate.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal(rate)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant={rate.estado === 'ACTIVO' ? 'danger' : 'secondary'}
                        onClick={() => handleToggleStatus(rate.id)}
                      >
                        {rate.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={selectedRate ? 'Editar Tasa de Interés' : 'Nueva Tasa de Interés'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto de Crédito
            </label>
            <select
              name="idProductoCredito"
              value={formData.idProductoCredito}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!!selectedRate}
            >
              <option value="">Seleccionar producto...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>{product.nombre}</option>
              ))}
            </select>
          </div>

          <Input
            label="Valor de la Tasa (%)"
            name="valorTasa"
            type="number"
            step="0.01"
            min="0"
            max="50"
            value={formData.valorTasa}
            onChange={handleInputChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha Inicio Vigencia"
              name="fechaInicioVigencia"
              type="date"
              value={formData.fechaInicioVigencia}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Fecha Fin Vigencia"
              name="fechaFinVigencia"
              type="date"
              value={formData.fechaFinVigencia}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {selectedRate ? 'Actualizar' : 'Crear'} Tasa
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InterestRatesPage;