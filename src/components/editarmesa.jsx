import React, { useState, useEffect } from 'react';
import { Table, Form, Card, Input, Pagination, Button, Select, Modal, Upload, Tooltip, Badge, Segmented, Avatar, Checkbox, notification, Drawer, Divider, Watermark, message } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { UploadOutlined, CalendarTwoTone, EditFilled } from '@ant-design/icons';
import imgmesas from './res/imgmesas.png';
import CrearMesa from './crearmesa';

const Mesas = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [mesas, setMesas] = useState([]);
  const [editingMesa, setEditingMesa] = useState(null);
  const [form] = Form.useForm();
  const [selectedOpcion, setSelectedOpcion] = useState('Mesas');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openp, setOpenp] = useState(false);

  useEffect(() => {
    fetch('projectdjangobakfebrero-production.up.railway.app/Mesas/ver_mesas/')
      .then(response => response.json())
      .then(data => setMesas(data.mesas))
      .catch(error => console.error('Error al obtener las mesas:', error));
  }, []);

  const showEditModal = (mesa) => {
    setEditingMesa(mesa);
    form.setFieldsValue({
      observacion: mesa.observacion,
      estado: mesa.estado,
      activa: mesa.activa.toString(),
      max_personas: mesa.max_personas.toString(),
    });
    showModal();
  };

  const handleEdit = async () => {
    try {
      const values = form.getFieldsValue();
      const mesa_id = editingMesa.id_mesa;

      const formData = new FormData();
      formData.append('observacion', values.observacion);
      formData.append('estado', values.estado);
      formData.append('activa', values.activa);
      formData.append('max_personas', values.max_personas);

      await fetch(`projectdjangobakfebrero-production.up.railway.app/Mesas/editar_mesa/${mesa_id}/`, {
        method: 'POST',
        body: formData,
      });

      fetch('projectdjangobakfebrero-production.up.railway.app/Mesas/ver_mesas/')
        .then(response => response.json())
        .then(data => setMesas(data.mesas))
        .catch(error => console.error('Error al obtener las mesas:', error));

      hideModal();

      // Mostrar mensaje de éxito
      message.success('Mesa editada con éxito');
    } catch (error) {
      console.error('Error al editar la mesa:', error);
      // Mostrar mensaje de error
      message.error('Error al editar la mesa');
    }
  };

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const Changueopcion = (value) => {
    setSelectedOpcion(value);
  }

  const showDrawerp = () => {
    setOpenp(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onClosep = () => {
    setOpenp(false);
  };

  const hideModal = () => {
    setVisible(false);
    setEditingMesa(null);
    form.resetFields();
  };

  const cargarMesas = async () => {
    fetch('projectdjangobakfebrero-production.up.railway.app/Mesas/ver_mesas/')
      .then(response => response.json())
      .then(data => setMesas(data.mesas))
      .catch(error => console.error('Error al obtener las mesas:', error));

    hideModal();
  };

  useEffect(() => {
    form.resetFields();
    if (!editModalVisible) {
      cargarMesas(currentPage);
    }
  }, []);

  const columns = [
    {
      title: 'Observación',
      dataIndex: 'observacion',
      key: 'observacion',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: estado => {
        // Mapear valores de estado
        const estadoMapping = {
          'D': 'Disponible',
          'R': 'Reservada',
          'U': 'En uso',
          'A': 'Atendida',
        };
        return estadoMapping[estado];
      },
    },
    {
      title: 'Activa',
      dataIndex: 'activa',
      key: 'activa',
      render: activa => (activa ? 'Activa' : 'Desactivada'),
    },
    {
      title: 'Max Personas',
      dataIndex: 'max_personas',
      key: 'max_personas',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (_, mesa) => (
        <Button type="primary" onClick={() => showEditModal(mesa)}>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Row>
        <Col md={12}>
          <Segmented
            options={[
              {
                label: (
                  <Tooltip title="Mesas">
                    <div style={{ padding: 4 }}>
                      <Avatar shape="square" src={imgmesas} size="large" />
                    </div>
                  </Tooltip>
                ),
                value: 'Mesas',
              }
            ]}
            value={selectedOpcion}
            onChange={Changueopcion}
          />
        </Col>
        {selectedOpcion === 'Mesas' && (
          <>
            <Divider>Control mesas</Divider>
            <Col md={12}>
              <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawerp}>
                Crear nueva mesa
              </Button>
            </Col>
            <Col md={12}>
              <Row>
                <Table dataSource={mesas} columns={columns} rowKey="id_mesa" />
                <Modal
                  title="Editar Mesa"
                  visible={visible}
                  onOk={handleEdit}
                  onCancel={hideModal}
                >
                  <Form form={form}>
                    <Form.Item label="Observación" name="observacion">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Estado" name="estado">
                      <Select>
                        <Select.Option value="D">Disponible</Select.Option>
                        <Select.Option value="R">Reservada</Select.Option>
                        <Select.Option value="U">En uso</Select.Option>
                        <Select.Option value="A">Atendida</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Activa" name="activa">
                      <Select>
                        <Select.Option value="1">Activa</Select.Option>
                        <Select.Option value="0">Desactivada</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Max Personas" name="max_personas">
                      <Input />
                    </Form.Item>
                  </Form>
                </Modal>
              </Row>
              <Pagination current={currentPage} total={total} onChange={handlePageChange} pageSize={8} style={{ marginTop: '16px', textAlign: 'center' }} />
            </Col>
          </>
        )}
      </Row>
      <Drawer
        title="Crear Mesa"
        width={720}
        onClose={onClosep}
        open={openp}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <CrearMesa />
      </Drawer>
    </div>
  );
};

export default Mesas;