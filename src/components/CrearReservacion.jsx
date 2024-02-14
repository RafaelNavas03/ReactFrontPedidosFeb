import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, TimePicker, Button, message } from 'antd';

const { Option } = Select;

const CrearReservacionForm = () => {
  const [form] = Form.useForm(); // Agrega esto al inicio del componente funcional
  const [clientes, setClientes] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  useEffect(() => {
    fetch('https://projectdjangobakfebrero-production.up.railway.app/cliente/ver_clientes/')
      .then(response => response.json())
      .then(data => setClientes(data.clientes))
      .catch(error => console.error(error));

    fetch('https://projectdjangobakfebrero-production.up.railway.app/Mesas/ver_mesas/')
      .then(response => response.json())
      .then(data => setMesas(data.mesas))
      .catch(error => console.error(error));
  }, []);

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        ...values,
        fecha_reserva: selectedDate.format('YYYY-MM-DD'),
      };

      const formData = new FormData();

      for (const key in formattedValues) {
        formData.append(key, formattedValues[key]);
      }

      const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/Mesas/crear_reservacion/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();
      message.success(data.mensaje);

      // Resetear los campos del formulario después de una creación exitosa
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Error al crear la reservación. Consulta la consola para más detalles.');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const loadHorarios = async () => {
      if (selectedDate) {
        const dayOfWeek = selectedDate.format('ddd').toUpperCase();
        const dayIdMap = { SUN: 1, MON: 2, TUE: 3, WED: 4, THU: 5, FRI: 6, SAT: 7 };
        const dayId = dayIdMap[dayOfWeek];

        setLoadingHorarios(true);

        try {
          const response = await fetch(`https://projectdjangobakfebrero-production.up.railway.app/horarios/get/${dayId}`);
          if (!response.ok) {
            throw new Error('Error al obtener los detalles del horario');
          }

          const data = await response.json();
          const horas = generarListaHoras(data.detalles);
          setHorarios(horas);
        } catch (error) {
          console.error(error);
          message.error('Error al obtener los detalles del horario. Consulta la consola para más detalles.');
        } finally {
          setLoadingHorarios(false);
        }
      }
    };

    loadHorarios();
  }, [selectedDate]);

  const generarListaHoras = (detalles) => {
    const horas = [];
    detalles.forEach(detalle => {
      let horaActual = detalle.hora_inicio;
      while (horaActual <= detalle.hora_fin) {
        horas.push(horaActual);
        horaActual = sumarIntervalo(horaActual, 30);
      }
    });
    return horas;
  };

  const sumarIntervalo = (hora, minutos) => {
    const [horas, minutosActuales] = hora.split(':').map(Number);
    const totalMinutos = horas * 60 + minutosActuales + minutos;
    const nuevasHoras = Math.floor(totalMinutos / 60);
    const nuevosMinutos = totalMinutos % 60;
    return `${nuevasHoras.toString().padStart(2, '0')}:${nuevosMinutos.toString().padStart(2, '0')}`;
  };

  const transformarHora = (hora) => {
    return hora;
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item label="Cliente" name="id_cliente" rules={[{ required: true, message: 'Seleccione un cliente' }]}>
        <Select>
          {clientes.map(cliente => (
            <Option key={cliente.id_cliente} value={cliente.id_cliente}>
              {`${cliente.snombre} ${cliente.capellido}`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Mesa" name="id_mesa" rules={[{ required: true, message: 'Seleccione una mesa' }]}>
        <Select>
          {mesas.map(mesa => (
            <Option key={mesa.id_mesa} value={mesa.id_mesa}>
              {mesa.observacion}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Fecha" name="fecha_reserva" rules={[{ required: true, message: 'Seleccione una fecha' }]}>
        <DatePicker onChange={handleDateChange} />
      </Form.Item>
      <Form.Item label="Hora" name="hora_reserva" rules={[{ required: true, message: 'Seleccione una hora' }]}>
        <Select loading={loadingHorarios}>
          {horarios.map(hora => (
            <Option key={hora} value={transformarHora(hora)}>
              {hora}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Estado" name="estado" rules={[{ required: true, message: 'Seleccione un estado' }]}>
        <Select>
          <Option value="E">En espera</Option>
          <Option value="D">En desarrollo</Option>
          <Option value="F">No asistió</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Crear Reservación
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CrearReservacionForm;