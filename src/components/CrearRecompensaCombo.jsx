import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, Checkbox } from 'antd';

const { Option } = Select;

const CrearRecompensaComboForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [combos, setCombos] = useState([]);
  const [combosConRecompensas, setCombosConRecompensas] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const combosResponse = await fetch('projectdjangobakfebrero-production.up.railway.app/combos/ver_combos/');
        const recompensasCombosResponse = await fetch('projectdjangobakfebrero-production.up.railway.app/Recompensas/listar_combos_con_recompensas/');
        
        if (isMounted) {
          const combosData = await combosResponse.json();
          const recompensasCombosData = await recompensasCombosResponse.json();

          if (Array.isArray(combosData.combos)) {
            setCombos(combosData.combos);
          } else {
            console.error('La respuesta de combos no contiene una propiedad "combos" o no es un array:', combosData);
          }

          if (Array.isArray(recompensasCombosData.combos_con_recompensas)) {
            setCombosConRecompensas(recompensasCombosData.combos_con_recompensas);
          } else {
            console.error('La respuesta de combos con recompensas no contiene una propiedad "combos_con_recompensas" o no es un array:', recompensasCombosData);
          }
        }
      } catch (error) {
        console.error('Error al obtener la lista de combos o recompensas_combos:', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const combosFiltrados = combos.filter(combo => !combosConRecompensas.includes(combo.id_combo));

  const opcionesCombos = combosFiltrados.map(combo => (
    <Option key={String(combo.id_combo)} value={String(combo.id_combo)}>
      {combo.nombrecb}
    </Option>
  ));

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Convertir el valor del checkbox a 1 o 0
      values.sestado = values.sestado ? "1" : "0";

      const formData = new FormData();
      for (const key in values) {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      }

      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Recompensas/crear_recompensa_combo/', {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();

      if (response.ok) {
        message.success(responseData.mensaje);
        form.resetFields();
      } else {
        message.error(responseData.error || 'Error al crear recompensa de combo');
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
        label="Combo"
        name="id_combo"
        rules={[{ required: true, message: 'Por favor, seleccione el combo' }]}
      >
        <Select>
          {opcionesCombos}
        </Select>
      </Form.Item>

      <Form.Item
        label="Puntos Recompensa Combo"
        name="puntos_recompensa_combo"
        rules={[{ required: true, message: 'Por favor, ingrese los puntos de recompensa del combo' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Estado"
        name="sestado"
        valuePropName="checked"
        rules={[{ required: true, message: 'Por favor, seleccione el estado de la recompensa' }]}
      >
        <Checkbox></Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Crear Recompensa de Combo
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CrearRecompensaComboForm;
