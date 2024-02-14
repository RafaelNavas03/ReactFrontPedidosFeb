import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';

const CrearTipoProducto = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/creartipop/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tp_nombre: values.productName,
          descripcion: values.productDescription,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        form.resetFields();
        openNotificationWithIcon('success', 'Tipo de Producto creado exitosamente');
        // Puedes realizar otras acciones después de un éxito, si es necesario
      } else {
        openNotificationWithIcon('error', data.error || 'Hubo un error al realizar la solicitud');
      }
    } catch (error) {
      openNotificationWithIcon('error', 'Hubo un error al realizar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Nombre del tipo de producto"
        name="productName"
        rules={[
          { required: true, message: 'Por favor ingresa el nombre del tipo de producto' },
          {
            validator: async (_, value) => {
              try {
                const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/tipoProductoExist/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    tpnombre: value,
                  }),
                });

                const data = await response.json();

                if (data.mensaje === '1') {
                  throw new Error('El tipo de producto ya está registrado');
                }
              } catch (error) {
                throw error.message;
              }
            },
          },
        ]}
      >
        <Input placeholder="Nombre del tipo de producto" />
      </Form.Item>

      <Form.Item
        label="Descripción"
        name="productDescription"
      >
        <Input.TextArea placeholder="Descripción" />
      </Form.Item>

      {form.getFieldValue('productName') && form.getFieldValue('productName').length > 300 && (
        <p style={{ color: 'red' }}>El nombre del tipo de producto no puede exceder los 300 caracteres.</p>
      )}

      {form.getFieldValue('productDescription') && form.getFieldValue('productDescription').length > 500 && (
        <p style={{ color: 'red' }}>La descripción no puede exceder los 500 caracteres.</p>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
          Crear Tipo de Producto
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CrearTipoProducto;
