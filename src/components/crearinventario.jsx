import React, { useState, useEffect } from 'react';
import { Checkbox,Form, Input, Button, Select, notification } from 'antd';

const { Option } = Select;

const CrearInventario = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [bodegas, setBodegas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [componentes, setComponentes] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [isProductoSelected, setIsProductoSelected] = useState(false);
  const [isComponenteSelected, setIsComponenteSelected] = useState(false);



  // Obtener la lista de sucursales al cargar el componente
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch('projectdjangobakfebrero-production.up.railway.app/sucursal/sucusarleslist/');
        const data = await response.json();
        setSucursales(data.sucursales);
      } catch (error) {
        console.error('Error al obtener la lista de sucursales:', error);
      }
    };

    fetchSucursales();
  }, []);

  // Obtener la lista de bodegas cuando se selecciona una sucursal
  useEffect(() => {
    const fetchBodegas = async () => {
      if (selectedSucursal) {
        try {
          const response = await fetch(`projectdjangobakfebrero-production.up.railway.app/bodega/listar/?id_sucursal=${selectedSucursal}`);
          const data = await response.json();
          setBodegas(data.bodegas);
        } catch (error) {
          console.error('Error al obtener la lista de bodegas:', error);
        }
      }
    };

    fetchBodegas();
  }, [selectedSucursal]);


  // Obtener la lista de bodegas, productos, componentes y unidades de medida al cargar el componente
  useEffect(() => {
    const fetchBodegas = async () => {
      try {
        const response = await fetch('projectdjangobakfebrero-production.up.railway.app/bodega/listar/');
        const data = await response.json();
        setBodegas(data.bodegas);
      } catch (error) {
        console.error('Error al obtener la lista de bodegas:', error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listar/');
        const data = await response.json();
        setProductos(data.productos);
      } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
      }
    };

    const fetchComponentes = async () => {
      try {
        const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listarcomponentes/');
        const data = await response.json();
        setComponentes(data.componentes);
      } catch (error) {
        console.error('Error al obtener la lista de componentes:', error);
      }
    };

    const fetchUnidadesMedida = async () => {
      try {
        const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listarum/');
        const data = await response.json();
        setUnidadesMedida(data.unidades_medida);
      } catch (error) {
        console.error('Error al obtener la lista de unidades de medida:', error);
      }
    };

    fetchBodegas();
    fetchProductos();
    fetchComponentes();
    fetchUnidadesMedida();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
  
      const formData = new FormData();
      if (values.id_producto) {
        formData.append('id_producto', values.id_producto);
      }
  
      if (values.id_componente) {
        formData.append('id_componente', values.id_componente);
      }
  
      formData.append('id_bodega', values.id_bodega);
      
      // Añade id_um solo si no es un componente
      if (values.id_um && !values.id_componente) {
        formData.append('id_um', values.id_um);
      }
  
      formData.append('stock_minimo', values.stock_minimo);
  
      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Inventario/crearinventario/', {
        method: 'POST',
        body: formData,
      });
  
      const responseData = await response.json();
  
      console.log('Respuesta de la API:', responseData);
      notification.success({
        message: 'Inventario creado exitosamente',
      });
    } catch (error) {
      console.error('Error al crear inventario:', error);
      notification.error({
        message: 'Error al crear inventario',
        description: 'Hubo un problema al enviar los datos al servidor.',
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleCheckboxChange = (checkedValues) => {
    setIsProductoSelected(checkedValues.includes('producto'));
    setIsComponenteSelected(checkedValues.includes('componente'));
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="id_sucursal"
        label="Sucursal"
        rules={[{ required: true, message: 'Por favor seleccione una sucursal' }]}
      >
        <Select
          placeholder="Seleccione una sucursal"
          onChange={(value) => setSelectedSucursal(value)}
        >
          {sucursales.map((sucursal) => (
            <Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
              {sucursal.srazon_social}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="id_bodega" label="Bodega" rules={[{ required: true, message: 'Por favor seleccione una bodega' }]}>
        <Select placeholder="Seleccione una bodega">
          {bodegas.map((bodega) => (
            <Option key={bodega.id_bodega} value={bodega.id_bodega}>
              {bodega.nombrebog}
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item
        name="seleccion"
        label="Seleccione"
        rules={[{ required: true, message: 'Por favor seleccione al menos una opción' }]}
      >
        <Checkbox.Group onChange={handleCheckboxChange}>
          <Checkbox value="producto" disabled={isComponenteSelected}>
            Producto
          </Checkbox>
          <Checkbox value="componente" disabled={isProductoSelected}>
            Componente
          </Checkbox>
        </Checkbox.Group>
      </Form.Item>
      {isProductoSelected && (
        <Form.Item
          name="id_producto"
          label="Producto"
          rules={[{ required: true, message: 'Por favor seleccione un producto' }]}
        >
          <Select placeholder="Seleccione un producto">
            {productos.map((producto) => (
              <Option key={producto.id_producto} value={producto.id_producto}>
                {producto.nombreproducto}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {isProductoSelected && (
        <Form.Item
          name="id_um"
          label="Unidad de Medida"
          rules={[{ required: true, message: 'Por favor seleccione una unidad de medida' }]}
        >
          <Select placeholder="Seleccione una unidad de medida">
            {unidadesMedida.map((um) => (
              <Option key={um.id_um} value={um.id_um}>
                {um.nombre_um}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {isComponenteSelected && (
        <Form.Item
          name="id_componente"
          label="Componente"
          rules={[{ required: true, message: 'Por favor seleccione un componente' }]}
        >
          <Select placeholder="Seleccione un componente">
            {componentes.map((componente) => (
              <Option key={componente.id_componente} value={componente.id_componente}>
                {componente.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {isComponenteSelected && (
        <Form.Item
          name="id_um"
          label="Unidad de Medida"
          rules={[{ required: true, message: 'Por favor seleccione una unidad de medida' }]}
        >
          <Select placeholder="Seleccione una unidad de medida">
            {unidadesMedida.map((um) => (
              <Option key={um.id_um} value={um.id_um}>
                {um.nombre_um}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      <Form.Item name="stock_minimo" label="Stock Mínimo" rules={[{ required: true, message: 'Por favor ingrese el stock mínimo' }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Crear Inventario
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CrearInventario;