import React, { useState } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const CrearProveedor = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      for (const key in values) {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      }
  
      console.log('Valores a enviar:', formData); 
  
      const response = await axios.post('https://projectdjangobakfebrero-production.up.railway.app/Proveedores/crear_proveedor/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      message.success(response.data.mensaje);
      form.resetFields();
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error);
      } else {
        message.error('Error al enviar la solicitud');
      }
    } finally {
      setLoading(false);
    }
  };  

  const validatePhoneNumber = (_, value) => {
    // Utiliza una expresión regular para validar si es un número de 10 dígitos
    const phoneNumberRegex = /^\d{10}$/;
    if (value && !phoneNumberRegex.test(value)) {
      return Promise.reject('Ingrese un número de 10 dígitos válido');
    }
    return Promise.resolve();
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Form.Item
        label="Nombres"
        name="nombreproveedor"
        rules={[{ required: true, message: 'Por favor, ingrese el nombre del proveedor' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dirección"
        name="direccionproveedor"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Teléfono"
        name="telefonoproveedor"
        rules={[
          { required: true, message: 'Por favor ingrese el teléfono' },
          { validator: validatePhoneNumber },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Correo"
        name="correoproveedor"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Estado"
        name="sestado"
        rules={[{ required: true, message: 'Por favor, seleccione el estado del proveedor' }]}
      >
        <Select>
          <Option value="1">Activo</Option>
          <Option value="0">Desactivo</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Crear Proveedor
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CrearProveedor;
