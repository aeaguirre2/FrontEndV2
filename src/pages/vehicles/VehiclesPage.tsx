import React, { useState, useEffect } from 'react';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import { getConcesionariosByEstado, getVehiculosByRuc, createVehiculo, createIdentificadorVehiculo, updateVehiculo, desactivarVehiculo, getConcesionarioByVendedorEmail } from '../../services/concesionarioService';
import Modal from '../../components/ui/Modal';
import IdentificadoresModal from '../concesionarios/IdentificadoresModal';
import { useGlobalStore } from '../../contexts/GlobalContext';
import { useAuth } from '../../contexts/AuthContext';

const VehiclesPage: React.FC = () => {
  const { addToast } = useGlobalStore();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [concesionarios, setConcesionarios] = useState<{ ruc: string; razonSocial: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    make: '',
    type: '',
    category: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    concesionario: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    marca: '',
    modelo: '',
    cilindraje: '',
    anio: '',
    valor: '',
    color: '',
    extras: '',
    estado: '',
    tipo: '',
    combustible: '',
    condicion: '',
    placa: '',
    chasis: '',
    motor: '',
    concesionario: '',
  });
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsVehicle, setDetailsVehicle] = useState<any>(null);
  const [showIdentificadorModal, setShowIdentificadorModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<any>(null);
  const [deactivating, setDeactivating] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    loadAllVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allVehicles, filters, page]);

  const loadAllVehicles = async () => {
    setLoading(true);
    try {
      let allVehs: any[] = [];
      
      if (user?.rol === 'ADMIN') {
        // Admin ve todos los vehículos de todos los concesionarios
        const concesionariosData = await getConcesionariosByEstado('ACTIVO');
        setConcesionarios(concesionariosData.map((c: any) => ({ ruc: c.ruc, razonSocial: c.razonSocial })));
        
        for (const c of concesionariosData) {
          const vehs = await getVehiculosByRuc(c.ruc);
          allVehs = allVehs.concat(vehs.map((v: any) => ({
            ...v,
            make: v.marca || '',
            model: v.modelo || '',
            year: v.anio || '',
            price: v.valor || 0,
            type: v.tipo || '',
            category: v.condicion || '',
            fuelType: v.combustible || '',
            isAvailable: v.estado === 'ACTIVO' || v.estado === 'DISPONIBLE',
            placa: v.identificadorVehiculo?.placa || '',
            chasis: v.identificadorVehiculo?.chasis || '',
            motor: v.identificadorVehiculo?.motor || '',
            concesionario: c.ruc
          })));
        }
      } else if (user?.rol === 'VENDEDOR') {
        // Vendedor solo ve los vehículos de su concesionario
        console.log('Usuario vendedor:', user);
        
        try {
          // Obtener el concesionario del vendedor por su email
          const userConcesionario = await getConcesionarioByVendedorEmail(user.email);
          console.log('Concesionario del vendedor:', userConcesionario);
          
          setConcesionarios([{ ruc: userConcesionario.ruc, razonSocial: userConcesionario.razonSocial }]);
          
          const vehs = await getVehiculosByRuc(userConcesionario.ruc);
          console.log('Vehículos encontrados para concesionario:', userConcesionario.ruc, vehs);
          
          allVehs = vehs.map((v: any) => {
            console.log('Vehículo original:', v);
            console.log('Condición del vehículo:', v.condicion);
            const mappedVehicle = {
              ...v,
              make: v.marca || '',
              model: v.modelo || '',
              year: v.anio || '',
              price: v.valor || 0,
              type: v.tipo || '',
              category: v.condicion || '',
              fuelType: v.combustible || '',
              isAvailable: v.estado === 'ACTIVO' || v.estado === 'DISPONIBLE',
              placa: v.identificadorVehiculo?.placa || '',
              chasis: v.identificadorVehiculo?.chasis || '',
              motor: v.identificadorVehiculo?.motor || '',
              concesionario: userConcesionario.ruc
            };
            console.log('Vehículo mapeado:', mappedVehicle);
            return mappedVehicle;
          });
        } catch (error) {
          console.error('Error al obtener concesionario o vehículos del vendedor:', error);
          addToast({
            message: 'Error al cargar los vehículos de tu concesionario',
            type: 'error',
          });
        }
      }
      
      setAllVehicles(allVehs);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allVehicles];
    if (filters.concesionario) filtered = filtered.filter(v => v.concesionario === filters.concesionario);
    if (filters.make) filtered = filtered.filter(v => v.make?.toLowerCase().includes(filters.make.toLowerCase()));
    if (filters.type) filtered = filtered.filter(v => v.tipo === filters.type);
    if (filters.category) filtered = filtered.filter(v => v.condicion === filters.category);
    if (filters.priceFrom) filtered = filtered.filter(v => v.price >= parseInt(filters.priceFrom));
    if (filters.priceTo) filtered = filtered.filter(v => v.price <= parseInt(filters.priceTo));
    if (filters.yearFrom) filtered = filtered.filter(v => v.year >= parseInt(filters.yearFrom));
    if (filters.yearTo) filtered = filtered.filter(v => v.year <= parseInt(filters.yearTo));
    if (filters.search) filtered = filtered.filter(v =>
      v.make?.toLowerCase().includes(filters.search.toLowerCase()) ||
      v.model?.toLowerCase().includes(filters.search.toLowerCase())
    );
    setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
    setVehicles(filtered.slice((page - 1) * pageSize, page * pageSize));
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    applyFilters();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      make: '',
      type: '',
      category: '',
      priceFrom: '',
      priceTo: '',
      yearFrom: '',
      yearTo: '',
      concesionario: '',
    });
    setPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTypeBadge = (type: string) => {
    console.log('getTypeBadge recibió tipo:', type);
    // Mapear tipos del backend a estilos y etiquetas
    const typeStyles: { [key: string]: string } = {
      // Tipos del backend (español)
      SEDAN: 'bg-blue-100 text-blue-800',
      SUV: 'bg-green-100 text-green-800',
      CAMIONETA: 'bg-orange-100 text-orange-800',
      AUTOMOVIL: 'bg-purple-100 text-purple-800',
      // Tipos del frontend (inglés) - mantener compatibilidad
      CAR: 'bg-blue-100 text-blue-800',
      TRUCK: 'bg-orange-100 text-orange-800',
      MOTORCYCLE: 'bg-purple-100 text-purple-800',
      VAN: 'bg-gray-100 text-gray-800',
    };

    const typeLabels: { [key: string]: string } = {
      // Tipos del backend (español)
      SEDAN: 'Sedán',
      SUV: 'SUV',
      CAMIONETA: 'Camioneta',
      AUTOMOVIL: 'Automóvil',
      // Tipos del frontend (inglés) - mantener compatibilidad
      CAR: 'Automóvil',
      TRUCK: 'Camioneta',
      MOTORCYCLE: 'Motocicleta',
      VAN: 'Van',
    };

    // Si no hay tipo o no está mapeado, no mostrar badge
    if (!type || !typeStyles[type]) {
      return null;
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeStyles[type]}`}>
        {typeLabels[type]}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    console.log('getCategoryBadge recibió categoría:', category);
    
    // Mapear condiciones del backend a estilos y etiquetas
    const categoryStyles: { [key: string]: string } = {
      // Condiciones del backend (español)
      NUEVO: 'bg-green-100 text-green-800',
      USADO: 'bg-yellow-100 text-yellow-800',
      // Categorías del frontend (inglés) - mantener compatibilidad
      NEW: 'bg-green-100 text-green-800',
      USED: 'bg-yellow-100 text-yellow-800',
      CERTIFIED: 'bg-blue-100 text-blue-800',
    };

    const categoryLabels: { [key: string]: string } = {
      // Condiciones del backend (español)
      NUEVO: 'Nuevo',
      USADO: 'Usado',
      // Categorías del frontend (inglés) - mantener compatibilidad
      NEW: 'Nuevo',
      USED: 'Usado',
      CERTIFIED: 'Certificado',
    };

    // Si no hay categoría o no está mapeada, no mostrar badge
    if (!category || !categoryStyles[category]) {
      return null;
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryStyles[category]}`}>
        {categoryLabels[category]}
      </span>
    );
  };

  const handleOpenForm = () => {
    // Si es vendedor, pre-seleccionar su concesionario
    let defaultConcesionario = '';
    if (user?.rol === 'VENDEDOR' && concesionarios.length > 0) {
      defaultConcesionario = concesionarios[0].ruc;
    }
    
    setForm({
      marca: '', modelo: '', cilindraje: '', anio: '', valor: '', color: '', extras: '', estado: '', tipo: '', combustible: '', condicion: '', placa: '', chasis: '', motor: '', concesionario: defaultConcesionario
    });
    setIsEditing(false);
    setVehicleToEdit(null);
    setErrors({});
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.marca || form.marca.trim() === '') newErrors.marca = 'La marca es requerida';
    else if (form.marca.length > 40) newErrors.marca = 'Máximo 40 caracteres';
    if (!form.modelo || form.modelo.trim() === '') newErrors.modelo = 'El modelo es requerido';
    else if (form.modelo.length > 40) newErrors.modelo = 'Máximo 40 caracteres';
    if (!form.cilindraje || isNaN(Number(form.cilindraje))) newErrors.cilindraje = 'El cilindraje es requerido y debe ser numérico';
    if (!form.anio || isNaN(Number(form.anio))) newErrors.anio = 'El año es requerido y debe ser numérico';
    else if (Number(form.anio) < 1900) newErrors.anio = 'El año debe ser mayor a 1900';
    else if (Number(form.anio) > 2030) newErrors.anio = 'El año no puede ser mayor a 2030';
    if (!form.valor || isNaN(Number(form.valor))) newErrors.valor = 'El valor es requerido y debe ser numérico';
    else if (Number(form.valor) < 0) newErrors.valor = 'El valor no puede ser negativo';
    else if (Number(form.valor) > 99999999.99) newErrors.valor = 'El valor excede el límite permitido';
    if (!form.color || form.color.trim() === '') newErrors.color = 'El color es requerido';
    else if (form.color.length > 30) newErrors.color = 'Máximo 30 caracteres';
    if (form.extras && form.extras.length > 150) newErrors.extras = 'Máximo 150 caracteres';
    if (!form.estado) newErrors.estado = 'El estado es requerido';
    if (!form.tipo) newErrors.tipo = 'El tipo es requerido';
    if (!form.combustible) newErrors.combustible = 'El combustible es requerido';
    if (!form.condicion) newErrors.condicion = 'La condición es requerida';
    if (!form.placa || form.placa.trim() === '') newErrors.placa = 'La placa es requerida';
    else if (form.placa.length > 7) newErrors.placa = 'La placa no puede exceder 7 caracteres';
    if (!form.chasis || form.chasis.trim() === '') newErrors.chasis = 'El chasis es requerido';
    else if (form.chasis.length !== 17) newErrors.chasis = 'El chasis debe tener exactamente 17 caracteres';
    if (!form.motor || form.motor.trim() === '') newErrors.motor = 'El número de motor es requerido';
    else if (form.motor.length > 20) newErrors.motor = 'El número de motor no puede exceder 20 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Primero crear el identificador del vehículo
      await createIdentificadorVehiculo({
        placa: form.placa,
        chasis: form.chasis,
        motor: form.motor
      });
      
      // Luego crear el vehículo
      await createVehiculo(form.concesionario, {
        marca: form.marca,
        modelo: form.modelo,
        cilindraje: parseFloat(form.cilindraje),
        anio: form.anio.toString(),
        valor: parseFloat(form.valor),
        color: form.color,
        extras: form.extras,
        estado: form.estado,
        tipo: form.tipo,
        combustible: form.combustible,
        condicion: form.condicion,
        placa: form.placa
      });
      
      addToast({
        message: 'Vehículo creado exitosamente',
        type: 'success',
      });
      setShowForm(false);
      loadAllVehicles();
    } catch (error: any) {
      console.error('Error al crear vehículo:', error);
      
      // Mostrar mensaje específico del backend
      let errorMessage = 'Error al crear vehículo';
      if (error.response?.data) {
        errorMessage = error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      addToast({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleShowDetails = (vehicle: any) => {
    setDetailsVehicle(vehicle);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setDetailsVehicle(null);
  };


  const handleCloseIdentificadorModal = () => {
    setShowIdentificadorModal(false);
  };

  const handleEditFromDetails = () => {
    if (detailsVehicle) {
      setForm({
        ...detailsVehicle,
        concesionario: detailsVehicle.concesionario,
        placa: detailsVehicle.placa,
        chasis: detailsVehicle.chasis,
        motor: detailsVehicle.motor
      });
      setVehicleToEdit(detailsVehicle);
      setIsEditing(true);
      setShowDetails(false);
      setShowForm(true);
    }
  };

  const handleUpdate = async () => {
    if (!vehicleToEdit) return;
    setSaving(true);
    try {
      await updateVehiculo(form.concesionario, form.placa, {
        marca: form.marca,
        modelo: form.modelo,
        cilindraje: parseFloat(form.cilindraje),
        anio: form.anio.toString(),
        valor: parseFloat(form.valor),
        color: form.color,
        extras: form.extras,
        estado: form.estado,
        tipo: form.tipo,
        combustible: form.combustible,
        condicion: form.condicion,
        placa: form.placa
      });
      setShowForm(false);
      setIsEditing(false);
      setVehicleToEdit(null);
      loadAllVehicles();
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!detailsVehicle) return;
    setDeactivating(true);
    try {
      await desactivarVehiculo(detailsVehicle.concesionario, detailsVehicle.placa);
      setShowDetails(false);
      loadAllVehicles();
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Catálogo de Vehículos</h1>
        <Button onClick={handleOpenForm}>Agregar Vehículo</Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Buscar por marca, modelo..."
              value={filters.search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('search', e.target.value)}
            />
            
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="AUTOMOVIL">Automóvil</option>
              <option value="CAMIONETA">Camioneta</option>
              <option value="SUV">SUV</option>
              <option value="SEDAN">Sedan</option>
            </select>

            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="NUEVO">Nuevo</option>
              <option value="USADO">Usado</option>
            </select>

            <Input
              type="number"
              placeholder="Año desde"
              value={filters.yearFrom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('yearFrom', e.target.value)}
            />

            <Input
              type="number"
              placeholder="Año hasta"
              value={filters.yearTo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('yearTo', e.target.value)}
            />

            {user?.rol === 'ADMIN' && (
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.concesionario}
                onChange={(e) => handleFilterChange('concesionario', e.target.value)}
              >
                <option value="">Todos los concesionarios</option>
                {concesionarios.map((c) => (
                  <option key={c.ruc} value={c.ruc}>{c.razonSocial}</option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="number"
              placeholder="Precio desde"
              value={filters.priceFrom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('priceFrom', e.target.value)}
            />

            <Input
              type="number"
              placeholder="Precio hasta"
              value={filters.priceTo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('priceTo', e.target.value)}
            />

            <Button type="submit" loading={loading}>
              Buscar
            </Button>

            <Button type="button" variant="secondary" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </form>
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vehículos...</p>
        </div>
      ) : (
        <>
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Vehicle Image */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-4xl">🚗</span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-600">{vehicle.year}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(vehicle.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {getTypeBadge(vehicle.type)}
                      {getCategoryBadge(vehicle.category)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.isAvailable ? 'Disponible' : 'No Disponible'}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <p>Motor: {vehicle.motor}</p>
                      <p>Transmisión: {vehicle.transmission === 'MANUAL' ? 'Manual' : 'Automática'}</p>
                      <p>Combustible: {vehicle.fuelType}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={() => handleShowDetails(vehicle)} className="mr-2">Ver Detalles</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {user?.rol === 'VENDEDOR' ? 'No hay vehículos en tu concesionario' : 'No hay vehículos disponibles'}
              </h3>
              <p className="text-gray-600 mb-4">
                {user?.rol === 'VENDEDOR' 
                  ? 'Actualmente no hay vehículos registrados en tu concesionario. Puedes agregar nuevos vehículos usando el botón "Agregar Vehículo".'
                  : 'No se encontraron vehículos que coincidan con los filtros aplicados.'
                }
              </p>
              {user?.rol === 'VENDEDOR' && (
                <Button onClick={handleOpenForm} className="bg-blue-600 hover:bg-blue-700">
                  Agregar Primer Vehículo
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Anterior
                </Button>
                
                <span className="px-4 py-2 text-sm text-gray-700">
                  Página {page} de {totalPages}
                </span>
                
                <Button
                  variant="secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Siguiente
                </Button>
              </nav>
            </div>
          )}
        </>
      )}

      <Modal isOpen={showForm} onClose={handleCloseForm} title={isEditing ? "Editar Vehículo" : "Agregar Vehículo"}>
        <div className="space-y-4">
          <select 
            name="concesionario" 
            value={form.concesionario} 
            onChange={handleChange} 
            className={`w-full border rounded px-2 py-1 ${user?.rol === 'VENDEDOR' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={user?.rol === 'VENDEDOR'}
          >
            <option value="">Selecciona un concesionario</option>
            {concesionarios.map(c => <option key={c.ruc} value={c.ruc}>{c.razonSocial}</option>)}
          </select>
          {user?.rol === 'VENDEDOR' && (
            <p className="text-sm text-gray-500 mt-1">
              Solo puedes crear vehículos en tu concesionario: {concesionarios[0]?.razonSocial}
            </p>
          )}
          <Input name="marca" label="Marca" value={form.marca} onChange={handleChange} />
          {errors.marca && <div className="text-red-500 text-xs">{errors.marca}</div>}
          <Input name="modelo" label="Modelo" value={form.modelo} onChange={handleChange} />
          {errors.modelo && <div className="text-red-500 text-xs">{errors.modelo}</div>}
          <Input name="cilindraje" label="Cilindraje" type="number" value={form.cilindraje} onChange={handleChange} />
          {errors.cilindraje && <div className="text-red-500 text-xs">{errors.cilindraje}</div>}
          <Input name="anio" label="Año" value={form.anio} onChange={handleChange} />
          {errors.anio && <div className="text-red-500 text-xs">{errors.anio}</div>}
          <Input name="valor" label="Valor" type="number" value={form.valor} onChange={handleChange} />
          {errors.valor && <div className="text-red-500 text-xs">{errors.valor}</div>}
          <Input name="color" label="Color" value={form.color} onChange={handleChange} />
          {errors.color && <div className="text-red-500 text-xs">{errors.color}</div>}
          <Input name="extras" label="Extras" value={form.extras} onChange={handleChange} />
          {errors.extras && <div className="text-red-500 text-xs">{errors.extras}</div>}
          <select name="estado" value={form.estado} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="">Selecciona estado</option>
            <option value="DISPONIBLE">DISPONIBLE</option>
            <option value="VENDIDO">VENDIDO</option>
            <option value="NO_DISPONIBLE">NO_DISPONIBLE</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
          {errors.estado && <div className="text-red-500 text-xs">{errors.estado}</div>}
          <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="">Selecciona tipo</option>
            <option value="AUTOMOVIL">AUTOMOVIL</option>
            <option value="CAMIONETA">CAMIONETA</option>
            <option value="SUV">SUV</option>
            <option value="SEDAN">SEDAN</option>
          </select>
          {errors.tipo && <div className="text-red-500 text-xs">{errors.tipo}</div>}
          <select name="combustible" value={form.combustible} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="">Selecciona combustible</option>
            <option value="GASOLINA">GASOLINA</option>
            <option value="DIESEL">DIESEL</option>
            <option value="HIBRIDO">HIBRIDO</option>
            <option value="ELECTRICO">ELECTRICO</option>
          </select>
          {errors.combustible && <div className="text-red-500 text-xs">{errors.combustible}</div>}
          <select name="condicion" value={form.condicion} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="">Selecciona condición</option>
            <option value="NUEVO">NUEVO</option>
            <option value="USADO">USADO</option>
          </select>
          {errors.condicion && <div className="text-red-500 text-xs">{errors.condicion}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Input name="placa" label="Placa" value={form.placa} onChange={handleChange} />
              {errors.placa && <div className="text-red-500 text-xs mt-1">{errors.placa}</div>}
            </div>
            <div>
              <Input name="chasis" label="Chasis" value={form.chasis} onChange={handleChange} />
              {errors.chasis && <div className="text-red-500 text-xs mt-1">{errors.chasis}</div>}
            </div>
            <div>
              <Input name="motor" label="Motor" value={form.motor} onChange={handleChange} />
              {errors.motor && <div className="text-red-500 text-xs mt-1">{errors.motor}</div>}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-2">
          <Button onClick={handleCloseForm} variant="secondary">Cancelar</Button>
          <Button onClick={isEditing ? handleUpdate : handleSave} disabled={saving}>{saving ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar' : 'Crear')}</Button>
        </div>
      </Modal>

      <Modal isOpen={showDetails} onClose={handleCloseDetails} title="Detalles del Vehículo">
        {detailsVehicle && (
          <div className="space-y-2">
            <div><b>Marca:</b> {detailsVehicle.marca}</div>
            <div><b>Modelo:</b> {detailsVehicle.modelo}</div>
            <div><b>Año:</b> {detailsVehicle.anio}</div>
            <div><b>Valor:</b> ${detailsVehicle.valor}</div>
            <div><b>Color:</b> {detailsVehicle.color}</div>
            <div><b>Extras:</b> {detailsVehicle.extras}</div>
            <div><b>Estado:</b> {detailsVehicle.estado}</div>
            <div><b>Tipo:</b> {detailsVehicle.tipo}</div>
            <div><b>Combustible:</b> {detailsVehicle.combustible}</div>
            <div><b>Condición:</b> {detailsVehicle.condicion}</div>
            <div><b>Placa:</b> {detailsVehicle.placa}</div>
            <div><b>Chasis:</b> {detailsVehicle.chasis}</div>
            <div><b>Motor:</b> {detailsVehicle.motor}</div>
            <div><b>Cilindraje:</b> {detailsVehicle.cilindraje}</div>
            <div><b>Concesionario:</b> {concesionarios.find(c => c.ruc === detailsVehicle.concesionario)?.razonSocial || '-'}</div>
            <div className="flex justify-end mt-6 space-x-2">
              <Button onClick={handleEditFromDetails}>Editar</Button>
              <Button onClick={handleDeactivate} variant="danger" disabled={deactivating}>{deactivating ? 'Desactivando...' : 'Desactivar'}</Button>
            </div>
          </div>
        )}
      </Modal>

      <IdentificadoresModal isOpen={showIdentificadorModal} onClose={handleCloseIdentificadorModal} />
    </div>
  );
};

export default VehiclesPage;