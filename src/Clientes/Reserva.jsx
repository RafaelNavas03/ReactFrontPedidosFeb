import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Pagination, DatePicker, Select, Space, Modal, Button, message } from 'antd';

const { Option } = Select;

const Reserva = () => {
  const [mesas, setMesas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pageSize = 8; // Número de tarjetas por página

  const obtenerMesas = async () => {
    try {
      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Mesas/ver_mesas/');
      if (!response.ok) {
        throw new Error('Error al obtener las mesas');
      }

      const data = await response.json();
      setMesas(data.mesas.filter(mesa => mesa.activa === '1'));
    } catch (error) {
      console.error('Error al obtener las mesas:', error);
    }
  };

  useEffect(() => {
    obtenerMesas();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (mesa) => {
    console.log('Mesa seleccionada:', mesa.id_mesa);
    setSelectedMesa(mesa);
    setModalVisible(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleHourChange = (value) => {
    setSelectedHour(value);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleReserveClick = async () => {
    try {
      if (!selectedMesa || !selectedDate || !selectedHour) {
        throw new Error('Por favor, seleccione una mesa, fecha y hora válidas.');
      }

      const formData = new FormData();
      formData.append('id_cliente', '1');
      formData.append('id_mesa', selectedMesa.id_mesa);
      formData.append('fecha_reserva', selectedDate && selectedDate.format('YYYY-MM-DD'));
      formData.append('hora_reserva', selectedHour);
      formData.append('estado', 'E');  // Ajusta el estado según tus necesidades

      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Mesas/crear_reservacion/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la reserva');
      }

      // Cerrar el modal después de la reserva exitosa
      setModalVisible(false);
      message.success('Reservación creada con éxito');
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      message.error('Error al crear la reserva: ' + error.message);
    }
  };

  const generateHourOptions = () => {
    const options = [];
    const startHour = 12;
    const endHour = 21;
    const interval = 30;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const formattedHour = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(<Option key={formattedHour} value={formattedHour}>{formattedHour}</Option>);
      }
    }

    return options;
  };

  const paginatedMesas = mesas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Determinar el tamaño de las columnas de acuerdo al tamaño de la fila
  let colSize = Math.floor(24 / Math.min(paginatedMesas.length, 3));

  return (
    <>
      <Row gutter={16}>
        {paginatedMesas.map((mesa) => (
          <Col key={mesa.id_mesa} xs={24} sm={colSize} md={colSize} lg={colSize} style={{ marginBottom: '16px' }}>
            <Card title={`Mesa ${mesa.id_mesa}`} onClick={() => handleCardClick(mesa)}>
              <p>Observación: {mesa.observacion}</p>
              <p>Máx. Personas: {mesa.max_personas}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        total={mesas.length}
        onChange={handlePageChange}
        pageSize={pageSize}
        style={{ marginTop: '16px', textAlign: 'center' }}
      />

      <Modal
        title={`Reservar Mesa ${selectedMesa && selectedMesa.id_mesa}`}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleReserveClick}>
            Reservar
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <DatePicker onChange={handleDateChange} placeholder="Seleccione una fecha" style={{ marginBottom: '8px' }} />
          <Select onChange={handleHourChange} placeholder="Seleccione una hora" style={{ width: '100%', marginBottom: '16px' }}>
            {generateHourOptions()}
          </Select>
          <p>Fecha seleccionada: {selectedDate && selectedDate.format('YYYY-MM-DD')}</p>
          <p>Hora seleccionada: {selectedHour}</p>
        </Space>
      </Modal>
    </>
  );
};

export default Reserva;
