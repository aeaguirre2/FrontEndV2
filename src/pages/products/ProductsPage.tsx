import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

interface CreditProduct {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  montoMinimo: number;
  montoMaximo: number;
  plazoMaximoMeses: number;
  porcentajeMaxFinanciamiento: number;
  tasaBase: number;
  estado: 'ACTIVO' | 'INACTIVO';
  fechaCreacion: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<CreditProduct[]>([
    {
      id: '1',
      codigo: 'CAR-001',
      nombre: 'Crédito Vehículo Nuevo',
      descripcion: 'Financiamiento para vehículos nuevos con tasas preferenciales',
      montoMinimo: 5000,
      montoMaximo: 80000,
      plazoMaximoMeses: 84,
      porcentajeMaxFinanciamiento: 80,
      tasaBase: 9.5,
      estado: 'ACTIVO',
      fechaCreacion: '2024-01-15'
    },
    {
      id: '2',
      codigo: 'CAR-002',
      nombre: 'Crédito Vehículo Usado',
      descripcion: 'Financiamiento para vehículos usados hasta 5 años de antigüedad',
      montoMinimo: 3000,
      montoMaximo: 50000,
      plazoMaximoMeses: 60,
      porcentajeMaxFinanciamiento: 70,
      tasaBase: 11.5,
      estado: 'ACTIVO',
      fechaCreacion: '2024-01-15'
    },
    {
      id: '3',
      codigo: 'CAR-003',
      nombre: 'Crédito Premium',
      descripcion: 'Producto exclusivo para vehículos de lujo y alta gama',
      montoMinimo: 25000,
      montoMaximo: 150000,
      plazoMaximoMeses: 96,
      porcentajeMaxFinanciamiento: 85,
      tasaBase: 8.5,
      estado: 'ACTIVO',
      fechaCreacion: '2024-02-01'
    },
    {
      id: '4',
      codigo: 'CAR-004',
      nombre: 'Crédito Ecológico',
      descripcion: 'Financiamiento especial para vehículos híbridos y eléctricos',
      montoMinimo: 15000,
      montoMaximo: 100000,
      plazoMaximoMeses: 84,
      porcentajeMaxFinanciamiento: 90,
      tasaBase: 7.5,
      estado: 'ACTIVO',
      fechaCreacion: '2024-02-15'
    },
    {
      id: '5',
      codigo: 'CAR-005',
      nombre: 'Crédito Motocicletas',
      descripcion: 'Financiamiento para motocicletas y vehículos de dos ruedas',
      montoMinimo: 1000,
      montoMaximo: 15000,
      plazoMaximoMeses: 48,
      porcentajeMaxFinanciamiento: 75,
      tasaBase: 12.5,
      estado: 'INACTIVO',
      fechaCreacion: '2024-01-10'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CreditProduct | null>(null);
  const [filters, setFilters] = useState({
    estado: 'TODOS',
    search: ''
  });

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    montoMinimo: '',
    montoMaximo: '',
    plazoMaximoMeses: '',
    porcentajeMaxFinanciamiento: '',
    tasaBase: '',
    estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesEstado = filters.estado === 'TODOS' || product.estado === filters.estado;
    const matchesSearch = !filters.search || 
      product.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.codigo.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesEstado && matchesSearch;
  });

  const handleOpenModal = (product?: CreditProduct) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        codigo: product.codigo,
        nombre: product.nombre,
        descripcion: product.descripcion,
        montoMinimo: product.montoMinimo.toString(),
        montoMaximo: product.montoMaximo.toString(),
        plazoMaximoMeses: product.plazoMaximoMeses.toString(),
        porcentajeMaxFinanciamiento: product.porcentajeMaxFinanciamiento.toString(),
        tasaBase: product.tasaBase.toString(),
        estado: product.estado
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        montoMinimo: '',
        montoMaximo: '',
        plazoMaximoMeses: '',
        porcentajeMaxFinanciamiento: '',
        tasaBase: '',
        estado: 'ACTIVO'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: CreditProduct = {
      id: selectedProduct?.id || (Date.now().toString()),
      codigo: formData.codigo,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      montoMinimo: parseFloat(formData.montoMinimo),
      montoMaximo: parseFloat(formData.montoMaximo),
      plazoMaximoMeses: parseInt(formData.plazoMaximoMeses),
      porcentajeMaxFinanciamiento: parseFloat(formData.porcentajeMaxFinanciamiento),
      tasaBase: parseFloat(formData.tasaBase),
      estado: formData.estado,
      fechaCreacion: selectedProduct?.fechaCreacion || new Date().toISOString().split('T')[0]
    };

    if (selectedProduct) {
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? newProduct : p));
    } else {
      setProducts(prev => [...prev, newProduct]);
    }

    handleCloseModal();
  };

  const handleToggleStatus = (id: string) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, estado: product.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
        : product
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

  const activeProducts = products.filter(p => p.estado === 'ACTIVO').length;
  const averageRate = products.length > 0 
    ? products.reduce((sum, p) => sum + p.tasaBase, 0) / products.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos de Crédito</h1>
          <p className="text-gray-600">Gestiona los productos de crédito automotriz disponibles</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          Nuevo Producto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos Activos</p>
              <p className="text-2xl font-bold text-blue-600">{activeProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-xl">💳</span>
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
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-purple-600">{products.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-xl">📋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          
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
            onClick={() => setFilters({ estado: 'TODOS', search: '' })}
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condiciones
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                      <div className="text-sm text-gray-500">{product.codigo}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{product.descripcion}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(product.montoMinimo)} - {formatCurrency(product.montoMaximo)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Financiamiento: {product.porcentajeMaxFinanciamiento}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Tasa: {product.tasaBase}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Plazo máx: {product.plazoMaximoMeses} meses
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant={product.estado === 'ACTIVO' ? 'danger' : 'secondary'}
                        onClick={() => handleToggleStatus(product.id)}
                      >
                        {product.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
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
        title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Código"
              name="codigo"
              value={formData.codigo}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Monto Mínimo (USD)"
              name="montoMinimo"
              type="number"
              value={formData.montoMinimo}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Monto Máximo (USD)"
              name="montoMaximo"
              type="number"
              value={formData.montoMaximo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Plazo Máximo (meses)"
              name="plazoMaximoMeses"
              type="number"
              value={formData.plazoMaximoMeses}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="% Máx. Financiamiento"
              name="porcentajeMaxFinanciamiento"
              type="number"
              step="0.1"
              max="100"
              value={formData.porcentajeMaxFinanciamiento}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tasa Base (%)"
              name="tasaBase"
              type="number"
              step="0.1"
              value={formData.tasaBase}
              onChange={handleInputChange}
              required
            />
            
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
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {selectedProduct ? 'Actualizar' : 'Crear'} Producto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;