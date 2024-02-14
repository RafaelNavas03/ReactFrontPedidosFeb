import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, Checkbox } from 'antd';

const { Option } = Select;

const CrearRecompensaProductoForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productosConRecompensas, setProductosConRecompensas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listar/');
        const recompensasProductosResponse = await fetch('https://projectdjangobakfebrero-production.up.railway.app/Recompensas/listar_productos_con_recompensas/');

        const productosData = await productosResponse.json();
        const recompensasProductosData = await recompensasProductosResponse.json();

        if (Array.isArray(productosData.productos)) {
          setProductos(productosData.productos);
        } else {
          console.error('La respuesta de productos no contiene una propiedad "productos" o no es un array:', productosData);
        }

        if (Array.isArray(recompensasProductosData.productos_con_recompensas)) {
          setProductosConRecompensas(recompensasProductosData.productos_con_recompensas);
        } else {
          console.error('La respuesta de productos con recompensas no contiene una propiedad "productos_con_recompensas" o no es un array:', recompensasProductosData);
        }
      } catch (error) {
        console.error('Error al obtener la lista de productos o recompensas_productos:', error);
      }
    };

    fetchData();
  }, []);  // Sin dependencias

  const opcionesProductos = productos
    .filter(producto => !productosConRecompensas.includes(producto.id_producto))  // Filtrar productos sin recompensas
    .map(producto => (
      <Option key={producto.id_producto} value={producto.id_producto}>
        {producto.nombreproducto}
      </Option>
    ));

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      values.sestado = values.sestado ? "1" : "0";

      const formData = new FormData();
      for (const key in values) {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      }

      const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/Recompensas/crear_recompensa_producto/', {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();

      if (response.ok) {
        message.success(responseData.mensaje);
        form.resetFields();
        
        const recompensasProductosResponse = await fetch('https://projectdjangobakfebrero-production.up.railway.app/Recompensas/listar_productos_con_recompensas/');
        const recompensasProductosData = await recompensasProductosResponse.json();
        
        if (Array.isArray(recompensasProductosData.productos_con_recompensas)) {
          setProductosConRecompensas(recompensasProductosData.productos_con_recompensas);
        }
      } else {
        message.error(responseData.error || 'Error al crear recompensa de producto');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      message.error('Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Producto"
        name="id_producto"
        rules={[{ required: true, message: 'Por favor, seleccione el producto' }]}
      >
        <Select>
          {opcionesProductos}
        </Select>
      </Form.Item>

      <Form.Item
        label="Puntos Recompensa Producto"
        name="puntos_recompensa_producto"
        rules={[{ required: true, message: 'Por favor, ingrese los puntos de recompensa del producto' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Estado"
        name="sestado"
        valuePropName="checked"
        rules={[{ required: true, message: 'Por favor, seleccione el estado de la recompensa' }]}
      >
        <Checkbox>Activo</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Crear Recompensa de Producto
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CrearRecompensaProductoForm;
