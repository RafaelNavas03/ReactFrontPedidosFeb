import React, { useState, useEffect } from 'react';
import {
  Space,
  Table,
  Form,
  Card,
  Input,
  Pagination,
  Button,
  Select,
  Modal,
  Upload,
  Tooltip,
  Badge,
  Segmented,
  Avatar,
  Checkbox,
  notification,
  Drawer,
  Divider,
  Watermark,
  message,
  Row,
  Col
} from "antd";
import CrearBodegaForm from "./crearbodega";
import RealizarPedido from "./pedidos";
import CrearReservacionForm from './CrearReservacion';
import imgreservado from "./res/imgreservado.png";

const EditarReservacionesForm = () => {
  const [reservaciones, setReservaciones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReservacion, setEditingReservacion] = useState(null);
  const [form] = Form.useForm();
  const [selectedOpcion, setSelectedOpcion] = useState("Reservacion");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [BodegaEnv, setBodegaEnv] = useState('');
  const [openp, setOpenp] = useState(false);

  useEffect(() => {
    cargarReservaciones();
  }, []);

  const cargarReservaciones = async () => {
    try {
      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Mesas/listar_reservaciones/');
      if (!response.ok) {
        throw new Error('Error al obtener la lista de reservaciones');
      }

      const data = await response.json();
      setReservaciones(data.reservaciones);
    } catch (error) {
      console.error('Error al obtener la lista de reservaciones:', error);
    }
  };
  const Changueopcion = (value) => {
    setSelectedOpcion(value);
  };

  const showDrawerp = () => {
    setOpenp(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onClosep = () => {
    setOpenp(false);
  };

  const mostrarModalEditar = (reservacion) => {
    setEditingReservacion(reservacion);
    form.setFieldsValue({
      fecha_reserva: reservacion.fecha_reserva,
      hora_reserva: reservacion.hora_reserva,
      estado: reservacion.estado,
    });
    setModalVisible(true);
  };

  const handleEditarReservacion = async () => {
    try {
      console.log('Antes de validar campos');
      const values = await form.validateFields();
      console.log('Después de validar campos', values);
  
      const idReservacion = editingReservacion.id_reservacion;
  
      console.log('Enviando solicitud de edición...');
      const response = await fetch(`projectdjangobakfebrero-production.up.railway.app/Mesas/editar_reservacion/${idReservacion}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha_reserva: values.fecha_reserva,
          hora_reserva: values.hora_reserva,
          estado: values.estado,
        }),
      });
      console.log('Respuesta recibida:', response);
  
      if (!response.ok) {
        throw new Error('Error al editar la reservación');
      }
  
      cargarReservaciones();
      setModalVisible(false);
      message.success('Reservación editada exitosamente');
    } catch (error) {
      console.error('Error al editar la reservación:', error);
      message.error('Error al editar la reservación');
    }
  };

  const columnas = [
    {
      title: 'ID de Reservación',
      dataIndex: 'id_reservacion',
      key: 'id_reservacion',
    },
    {
      title: 'Fecha de Reservación',
      dataIndex: 'fecha_reserva',
      key: 'fecha_reserva',
    },
    {
      title: 'Hora de Reservación',
      dataIndex: 'hora_reserva',
      key: 'hora_reserva',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (_, reservacion) => (
        <Space>
          <Button type="primary" onClick={() => mostrarModalEditar(reservacion)}>
            Editar
          </Button>
        </Space>
      ),
    },
  ];
  const renderBodegasContent = () => (
    <>
      <Divider>Control de Reservaciones</Divider>
      <Col md={24}>
        <Button
          type="primary"
          style={{ width: '100%', margin: '2%' }}
          onClick={showDrawerp}
        >
          Crear nueva reservacion
        </Button>
      </Col>
      <Col md={24}>
        <Table dataSource={reservaciones} columns={columnas} rowKey="id_reservacion" />
        <Pagination
          current={currentPage}
          total={total}
          onChange={handlePageChange}
          pageSize={8}
          style={{ marginTop: '16px', textAlign: 'center' }}
        />
      </Col>
      <Modal
        title="Editar Reservación"
        visible={modalVisible}
        onOk={handleEditarReservacion}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} onFinish={handleEditarReservacion}>
          {/* Campos de edición, por ejemplo */}
          <Form.Item name="fecha_reserva" label="Fecha de Reservación">
            <Input />
          </Form.Item>
          <Form.Item name="hora_reserva" label="Hora de Reservación">
            <Input />
          </Form.Item>
          <Form.Item name="estado" label="Estado">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar cambios
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  return (
    <div>
      <Row>
        <Col md={24}>
          <Segmented
            options={[
              {
                label: (
                  <Tooltip title="Reservacion">
                    <div style={{ padding: 4 }}>
                      <Avatar shape="square" src={imgreservado} size="large" />
                    </div>
                  </Tooltip>
                ),
                value: 'Reservacion',
              },
            ]}
            value={selectedOpcion}
            onChange={Changueopcion}
          />
        </Col>
        {selectedOpcion === 'Reservacion' && renderBodegasContent()}
      </Row>
      <Drawer
        title="Crear Bodega"
        width={720}
        onClose={onClosep}
        open={openp}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <CrearReservacionForm />
      </Drawer>
    </div>
  );
};


export default EditarReservacionesForm;
