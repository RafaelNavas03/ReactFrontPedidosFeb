import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Drawer, Tooltip, Popconfirm } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { EditTwoTone, DeleteFilled } from '@ant-design/icons';
import CrearTipoProducto from './creartipoproducto';

const EditarTipoProducto = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setTiposProductos] = useState([]);
  const [tipoProductoId, setTipoProductoId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [opentp, setOpentp] = useState(false);
  const [openetp, setOpenetp] = useState(false);
  const [searchText, setSearchText] = useState('');

  const onCloseetp = () => {
    listarp();
    setOpenetp(false);
    
  };

  const showDrawertp = () => {
    setOpentp(true);
  };

  const onClosetp = () => {
    setOpentp(false);
    listarp();
  };

  const eliminartp = async (idtp) => {
    try {
      const formData = new FormData();
      console.log('El valor enviado es :' + idtp);
      formData.append('sestado', '0');
      const response = await fetch(`projectdjangobakfebrero-production.up.railway.app/producto/editar_tipo_producto/${idtp}/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success('Sucursal eliminada con éxito');
        setModalVisible(false);
        listarp();
      } else {
        message.error(responseData.error || 'Hubo un error al realizar la solicitud');
      }
    } catch (error) {
      message.error('Hubo un error al realizar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const listarp= async ()=>{
    try {
      fetch('projectdjangobakfebrero-production.up.railway.app/producto/listarproductos/')
        .then((response) => response.json())
        .then((data) => setTiposProductos(data.tipos_productos))
        .catch((error) => console.error('Error fetching tipos de productos:', error));
    } catch (error) {
      message.error('Hubo un error al realizar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('SD');
    listarp();
  }, []);

  const columns = [
    {
      title: 'Nombre del Tipo de Producto',
      dataIndex: 'tpnombre',
      key: 'tpnombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Row>
          <Col md={1}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tooltip title='Editar tipo de producto'>
                <Button
                  type="link"
                  style={{ fontSize: '24px', marginLeft: 'auto' }}
                  icon={<EditTwoTone style={{ fontSize: '30px', color: '#eb2f96', marginLeft: '5%', border: '1px solid #268A2E' }} />}
                  onClick={() => handleEdit(record.id_tipoproducto)}
                />
              </Tooltip>
              <Popconfirm
                title="Eliminar tipo de producto"
                description="¿Estás seguro que deseas eliminar el tipo de producto?"
                onConfirm={() => eliminartp(record.id_tipoproducto)}
                onCancel={'cancel'}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="link"
                  style={{ fontSize: '24px', marginLeft: 'auto' }}
                  icon={<DeleteFilled style={{ fontSize: '30px', marginLeft: '2%', border: '1px solid red', color: 'red' }} />}
                />
              </Popconfirm>
            </div>
          </Col>
        </Row>
      ),
    },
  ];

  const handleEdit = (id) => {
    setTipoProductoId(id);
    setOpenetp(true);
    const tipoProductoSeleccionado = data.find((tipo) => tipo.id_tipoproducto === id);

    // Establecer los valores iniciales en el formulario
    form.setFieldsValue({
      name: tipoProductoSeleccionado.tpnombre,
      description: tipoProductoSeleccionado.descripcion,
    });
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('tpnombre', values.name);
      if (values.description) {
        formData.append('descripcion', values.description);
      }

      const response = await fetch(`projectdjangobakfebrero-production.up.railway.app/producto/editar_tipo_producto/${tipoProductoId}/`, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        message.success(responseData.mensaje);
        setModalVisible(false);
        listarp();
      } else {
        message.error(responseData.error || 'Hubo un error al realizar la solicitud');
      }
    } catch (error) {
      message.error('Hubo un error al realizar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const filteredTiposProductos = data.filter((tipo) =>
    tipo.tpnombre.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Row>
        <Col md={12}>
          <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawertp}>
            Crear nuevo tipo de producto
          </Button>
        </Col>
        <Col md={12}>
          <Row gutter={[16, 16]}>
            <Col md={12}>
              <Input
                placeholder="Buscar tipo de producto"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
          </Row>
        </Col>
        <Col md={12}>
          <Table dataSource={filteredTiposProductos} columns={columns} rowKey="id_tipoproducto" />
        </Col>
      </Row>
      <Drawer
        title="Crear tipo de producto"
        width={720}
        open={opentp}
        onClose={onClosetp}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <CrearTipoProducto />
      </Drawer>
      <Drawer
        title="Editar tipo de producto"
        width={720}
        onClose={onCloseetp}
        open={openetp}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Nombre del tipo de producto"
            name="name"
            rules={[
              { required: true, message: 'Por favor ingresa el nombre del tipo de producto' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('name') && getFieldValue('name').length > 300) {
                    return Promise.reject('El nombre del tipo de producto no puede exceder los 300 caracteres.');
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Descripción" name="description"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('description') && getFieldValue('description').length > 500) {
                    return Promise.reject('La descripción no puede exceder los 500 caracteres.');
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          {form.getFieldValue('description') && form.getFieldValue('description').length > 500 && (
            <p style={{ color: 'red' }}>La descripción no puede exceder los 500 caracteres.</p>
          )}
          <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Guardar cambios
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default EditarTipoProducto;