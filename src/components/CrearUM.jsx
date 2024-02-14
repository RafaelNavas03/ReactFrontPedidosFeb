import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';

const CrearUnidadMedida = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/crearum/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }); 

      if (response.ok) {
        form.resetFields(); // Reset the form fields
        openNotificationWithIcon('success', 'Unidad de medida creada con éxito');
      } else {
        const errorData = await response.json();
        console.error('Error al crear la unidad de medida:', errorData);
        openNotificationWithIcon('error', 'Error al crear la unidad de medida');
      }
    } catch (error) {
      console.error('Error al crear la unidad de medida:', error);
      openNotificationWithIcon('error', 'Error al crear la unidad de medida');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, maxLength) => {
    const inputValue = e.target.value;
    if (inputValue.length > maxLength) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  return (
    <div>
      <Form
        form={form}
        name="crearUnidadMedida"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Nombre de la Unidad de Medida"
          name="nombre_um"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese el nombre de la Unidad de Medida',
            },
          ]}
        >
          <Input
            placeholder="Ej. Kilogramo, Litro, etc."
            maxLength={100}
            onChange={(e) => handleInputChange(e, 100)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Crear Unidad de Medida
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CrearUnidadMedida;
