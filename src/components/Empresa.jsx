import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Button, Modal, Form, Input, message, Image, Upload,Divider,Drawer } from 'antd';
import { EditTwoTone, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Row, Col, Table } from 'react-bootstrap';
import Sucursales from './sucursales';
import EditarRecompensaProductoForm from './recompensa';


const { Title } = Typography;

const Empresa = () => {
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [opene, setOpene] = useState(false);

  const onFinishFailed = (errorInfo) => {
    console.log('Falló la validación:', errorInfo);
  };

  const showDrawere = () => {
    setOpene(true);
    form.setFieldsValue({
      enombre: empresaInfo.enombre,
      direccion: empresaInfo.direccion,
      etelefono: empresaInfo.etelefono,
      correoelectronico: empresaInfo.correoelectronico,
      fechafundacion: empresaInfo.fechafundacion,
      sitioweb: empresaInfo.sitioweb,
      eslogan: empresaInfo.eslogan,
    });
  };

  const onClosee = () => {
    setOpene(false);
  };

  const obtenerInformacionEmpresa = async () => {
    try {
      const respuesta = await fetch('projectdjangobakfebrero-production.up.railway.app/empresa/infoEmpresa/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const datos = await respuesta.json();
      setEmpresaInfo(datos.empresa_info);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener la información de la empresa:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerInformacionEmpresa();
  }, []);



  const manejarEdicion = async (values) => {
    const formData = new FormData();
    if (values.enombre) {
      formData.append('enombre', values.enombre);
    }

    if (values.direccion) {
      formData.append('direccion', values.direccion);
    }

    if (values.etelefono) {
      formData.append('etelefono', values.etelefono);
    }

    if (values.correoelectronico) {
      formData.append('correoelectronico', values.correoelectronico);
    }

    if (values.fechafundacion) {
      formData.append('fechafundacion', values.fechafundacion);
    }

    if (values.sitioweb) {
      formData.append('sitioweb', values.sitioweb);
    }

    if (values.eslogan) {
      formData.append('eslogan', values.eslogan);
    }

    if (values.logo && values.logo.length > 0) {
      formData.append('elogo', values.logo[0].originFileObj);
    }

    try {
      const respuesta = await fetch(`projectdjangobakfebrero-production.up.railway.app/empresa/editar/`, {
        method: 'POST',
        body: formData,
      });
  
      if (respuesta.ok) {
        message.success('Datos de la empresa actualizados correctamente'); // Mensaje de éxito
        onClosee(false);
        obtenerInformacionEmpresa();
        window.location.href = '/home';
      } else {
        message.error('Error al editar la información de la empresa');
        console.log(await respuesta.text());
      }
    } catch (error) {
      message.error('Error al editar la información de la empresa:', error);
    }
  };


  const columns = [
    {
      title: 'Campo',
      dataIndex: 'campo',
      key: 'campo',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (text, record) => {
        if (record.campo === 'Logo' && empresaInfo.elogo) {
          return <Image src={`data:image/png;base64,${text}`} width={50} />;
        }
        return text;
      },
    },
  ];

  const dataSource = empresaInfo
    ? [
      { key: '1', campo: 'Nombre', valor: empresaInfo.enombre },
      { key: '2', campo: 'Dirección', valor: empresaInfo.direccion || 'No disponible' },
      { key: '3', campo: 'Teléfono', valor: empresaInfo.etelefono || 'No disponible' },
      { key: '4', campo: 'Correo Electrónico', valor: empresaInfo.correoelectronico || 'No disponible' },
      { key: '5', campo: 'Fecha de Fundación', valor: empresaInfo.fechafundacion },
      { key: '6', campo: 'Sitio Web', valor: empresaInfo.sitioweb || 'No disponible' },
      { key: '7', campo: 'Eslogan', valor: empresaInfo.eslogan || 'No disponible' },
      { key: '8', campo: 'Logo', valor: empresaInfo.elogo || 'No disponible' },
    ]
    : [];

  return (
    <>
      <Row>
        <Col md={12}>
          <Title level={4} style={{ marginBottom: '20px' }}>
            Información de la Empresa
          </Title>
          <Card
            hoverable
            className="text-center"
            style={{backgroundColor: '#CDEECC',border: '1px solid #A4A4A4',cursor: 'default'}}
          >
            <div className="table-responsive">
              <table className="table table-bordered" headers="false" style={{border: '1px solid #A4A4A4'}}>

                <tbody>
                  {dataSource.map(record => (
                    <tr key={record.key}>
                      <td className="text-left">{record.campo}</td> {/* Alinea a la izquierda */}
                      <td className="text-left">
                        {record.campo === 'Logo' && empresaInfo.elogo ? (
                          <Image src={`data:image/png;base64,${record.valor}`} width={50} />
                        ) : (
                          record.valor
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                type="link"
                style={{ fontSize: '24px', marginLeft: 'auto'}}
                icon={<EditTwoTone style={{ fontSize: '40px', color: '#eb2f96',marginLeft:'2%',border: '3px solid #268A2E'}} />}
                onClick={showDrawere}
              />
            </div>
          </Card>
        </Col> 
        <Divider>Sucursales</Divider>
        <Col md={12} style={{ padding: '2%' }}>
            <Sucursales />
        </Col>
      </Row>

      <Drawer
        title="Editar información de empresa"
        width={720}
        onClose={onClosee}
        open={opene}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form form={form} onFinish={manejarEdicion} onFinishFailed={onFinishFailed}>
        <Form.Item label="Nombre" name="enombre" rules={[{ required: true, message: 'Por favor, ingresa el nombre' }, { max: 200, message: 'El nombre debe tener máximo 200 caracteres' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Dirección" name="direccion" rules={[{ max: 300, message: 'La dirección debe tener máximo 300 caracteres' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="etelefono"
            rules={[
              { pattern: /^[0-9]+$/, message: 'Por favor, ingresa solo números en el teléfono' },
              { max: 10, message: 'El teléfono debe tener máximo 10 dígitos' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Correo Electrónico"
            name="correoelectronico"
            type="email"
            rules={[
              { type: 'email', message: 'Por favor, ingresa un correo electrónico válido' },
              { max: 256, message: 'El correo electrónico debe tener máximo 256 caracteres' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Sitio Web" name="sitioweb" rules={[{ max: 2000, message: 'El sitio web debe tener máximo 2000 caracteres' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Eslogan" name="eslogan" rules={[{ max: 300, message: 'El eslogan debe tener máximo 300 caracteres' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="logo"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
            noStyle
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              maxCount={1}
              accept=".png, .jpg, .jpeg"
            >
              <Button icon={<UploadOutlined />}>Subir Imagen</Button>
            </Upload>
          </Form.Item>
          <br/>
          <Button type="primary" htmlType="submit">
            Guardar Cambios
          </Button>
        </Form>
      </Drawer>
      <EditarRecompensaProductoForm/>
    </>
  );
};

export default Empresa;