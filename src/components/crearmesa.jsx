import React from "react";
import { Form, Input, Button, Select, message, InputNumber } from "antd";

const { Option } = Select;

const CrearMesa = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      const response = await fetch("projectdjangobakfebrero-production.up.railway.app/Mesas/crear/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del servidor:", data.message);

        // Mostrar mensaje de éxito
        message.success("Mesa creada con éxito");

        // Limpiar el formulario
        form.resetFields();
      } else {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error.message);

      // Mostrar mensaje de error
      message.error("Error al crear la mesa. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item
        name="observacion"
        label="Observación"
        rules={[
          { required: true, message: "Por favor, ingresa la observación" },
          {
            max: 500,
            message: "La observación no puede tener más de 500 caracteres",
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="estado" label="Estado" rules={[{ required: true }]}>
        <Select>
          <Option value="D">Disponible</Option>
          <Option value="R">Reservada</Option>
          <Option value="U">En uso</Option>
          <Option value="A">Atendida</Option>
        </Select>
      </Form.Item>
      <Form.Item name="activa" label="Activa" rules={[{ required: true }]}>
        <Select>
          <Option value="1">Activa</Option>
          <Option value="0">Desactivada</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="max_personas"
        label="Máximo de Personas"
        rules={[
          {
            required: true,
            message: "Por favor, ingresa el número máximo de personas",
          },
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Crear Mesa
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CrearMesa;
