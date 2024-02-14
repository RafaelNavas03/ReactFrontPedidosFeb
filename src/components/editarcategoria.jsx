import React, { useState, useEffect } from 'react';
import { Tag, Table, Space, Image, Button, Form, Input, Select, Modal, Upload, Drawer, Popconfirm, Tooltip, message } from 'antd';
import { UploadOutlined, EditTwoTone, DeleteFilled } from '@ant-design/icons';
import { Row, Col } from 'react-bootstrap';
import CrearCategoria from './crearcategoria';

const EditarCategoria = ({ onCancel }) => {
  const [categorias, setCategorias] = useState([]);
  const [tiposProductos, setTiposProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [openc, setOpenc] = useState(false);
  const [openca, setOpenca] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const showDrawerc = () => {
    console.log('Que pasaa');
    setOpenc(true);
  };

  const onClosec = () => {
    console.log('Que pasab');
    setOpenc(false);
    fetchCategorias();
  };

  const onCloseca = () => {
    console.log('Que pasab');
    setOpenca(false);
    fetchCategorias();
  };

  const handleTipoProductoChange = (value) => {
    setSelectedTipoProducto(value);
  };


  const fetchCategorias = async () => {
    try {
      const responseCategorias = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listar_categorias/');
      const dataCategorias = await responseCategorias.json();

      const responseTiposProductos = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listarproductos/');
      const dataTiposProductos = await responseTiposProductos.json();

      const tiposProductosMap = {};
      dataTiposProductos.tipos_productos.forEach((tipoProducto) => {
        tiposProductosMap[tipoProducto.id_tipoproducto] = tipoProducto;
      });

      const categoriasConTipos = dataCategorias.categorias.map((categoria) => ({
        ...categoria,
        tipoProducto: tiposProductosMap[categoria.id_tipoproducto.id_tipoproducto],
      }));

      setCategorias(categoriasConTipos);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const eliminartp = async (idca) => {
    try {
      const formData = new FormData();
      console.log('El valor enviado es :' + idca)
      formData.append('sestado', 0);
      const response = await fetch(`projectdjangobakfebrero-production.up.railway.app/producto/editar_categoria/${idca}/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success('Categoria eliminada con exito');
        listarca();
      } else {
        message.error(responseData.error || 'Hubo un error al realizar la solicitud');
      }
    } catch (error) {
      message.error('Hubo un error al realizar la solicitud');
    }
  }

  useEffect(() => {
    listarca();
  }, []);

  const listarca = () => {
    const fetchTiposProductos = async () => {
      console.log('Que pasae');
      try {
        const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listarproductos/');
        const data = await response.json();
        setTiposProductos(data.tipos_productos);
      } catch (error) {
        console.error('Error fetching tipos de productos:', error);
      }
    };

    fetchTiposProductos();
    fetchCategorias();
  }

  const handleEdit = (record) => {
    console.log('Que pasaf');
    setSelectedCategoria(record);
    setOpenca(true);
  };

  const handleCancelEdit = () => {
    console.log('Que pasag');
    setSelectedCategoria(null);
  };

  const handleUpdateCategoria = async (values) => {
    try {
      console.log('Que pasah');

      const formData = new FormData();
      formData.append('catnombre', values.catnombre);
      formData.append('descripcion', values.descripcion);
      formData.append('id_tipoproducto', values.id_tipoproducto);

      if (values.imagen && values.imagen[0]?.originFileObj) {
        formData.append('imagencategoria', values.imagen[0].originFileObj);
      }

      const response = await fetch(
        `projectdjangobakfebrero-production.up.railway.app/producto/editar_categoria/${selectedCategoria.id_categoria}/`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Categoría editada con éxito:', data);
        fetchCategorias();
        handleCancelEdit();
        Modal.success({
          title: 'Éxito',
          content: 'Categoría editada con éxito',
        });
      } else {
        console.error('Error al editar categoría:', data.error);
        Modal.error({
          title: 'Error',
          content: `Error al editar categoría: ${data.error}`,
        });
      }
    } catch (error) {
      console.error('Error en la solicitud de edición:', error);
      Modal.error({
        title: 'Error',
        content: 'Error en la solicitud de edición',
      });
    }
  };

  const validateImageFormat = (_, fileList) => {
    const isValidFormat = fileList.every(file => file.type.startsWith('image/'));
    if (!isValidFormat) {
      return Promise.reject('Solo se permiten archivos de imagen');
    }
    return Promise.resolve();
  };

  const CategoriaForm = ({ onFinish, onCancel, initialValues, tiposProductos }) => {
    const [form] = Form.useForm();
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'catnombre',
      key: 'catnombre',
    },
    {
      title: 'Imagen',
      dataIndex: 'imagencategoria',
      key: 'imagencategoria',
      render: (imagencategoria) => (
        imagencategoria ? (
          <Image src={`data:image/png;base64, ${imagencategoria}`} alt="Imagen de la categoría" width={50} />
        ) : (
          <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.45)' }}>Sin imagen</div>
        )
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Tipo de Producto',
      dataIndex: 'tipoProducto',
      key: 'tipoProducto',
      render: (tipoProducto) => (
        <Tag color="blue">{tipoProducto ? tipoProducto.tpnombre : 'Sin Tipo'}</Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Row>
          <Col md={1}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tooltip title='Editar categoría'>
                <Button
                  type="link"
                  style={{ fontSize: '24px', marginLeft: 'auto' }}
                  icon={<EditTwoTone style={{ fontSize: '30px', color: '#eb2f96', marginLeft: '5%', border: '1px solid #268A2E' }} />}
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
              <Popconfirm
                title="Eliminar tipo de producto"
                description="¿Estas seguro que que deseas eliminar el tipo de producto?"
                onConfirm={() => eliminartp(record.id_categoria)}
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

  const filteredCategorias = categorias.filter(categoria =>
    categoria.catnombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedCategoriaWithValidTipo = {
    ...selectedCategoria,
    id_tipoproducto:
      selectedCategoria?.id_tipoproducto &&
        tiposProductos.find((tipo) => tipo.id_tipoproducto === selectedCategoria.id_tipoproducto)
        ? selectedCategoria.id_tipoproducto
        : tiposProductos[0]?.id_tipoproducto,
  };

  return (
    <>
      <Row>
        <Col md={12}>
          <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawerc}>
            Crear nueva categoria
          </Button>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={12}>
          <Input
            placeholder="Buscar categoría"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Table dataSource={filteredCategorias} columns={columns} />
        </Col>
      </Row>
      <Drawer
        title="Crear categoria"
        width={720}
        onClose={onClosec}
        open={openc}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <CrearCategoria />
      </Drawer>
      {selectedCategoria && (
        <Drawer
          title="Editar categoria"
          width={720}
          open={openca}
          onClose={onCloseca}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
        >
          <Form
            form={form}
            name="editarCategoriaForm"
            onFinish={handleUpdateCategoria}
            initialValues={selectedCategoriaWithValidTipo}
            onCancel={handleCancelEdit}
          >
            <Form.Item
              label="Nombre"
              name="catnombre"
              rules={[
                {
                  required: true,
                  message: 'Por favor ingresa el nombre de la categoría',
                },
                { max: 300, message: 'El nombre de la categoría no puede exceder los 300 caracteres' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Descripción"
              name="descripcion"
              rules={[{ max: 500, message: 'La descripción no puede exceder los 500 caracteres' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Tipo de Producto"
              name="id_tipoproducto"
              rules={[
                {
                  required: true,
                  message: 'Por favor selecciona el tipo de producto',
                },
              ]}
            >
              <Select>
                {tiposProductos.map((tipo) => (
                  <Select.Option key={tipo.id_tipoproducto} value={tipo.id_tipoproducto}>
                    {tipo.tpnombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Imagen de la Categoría"
              name="imagen"
              valuePropName="fileList"
              getValueFromEvent={(e) => e && e.fileList}
            >
              <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Guardar cambios
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      )}
    </>
  );
};
export default EditarCategoria;