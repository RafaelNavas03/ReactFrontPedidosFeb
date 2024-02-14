import React, { useState } from 'react';
import { Form, Button, Input, Alert, Select, message } from 'antd';
import { Modal } from 'react-bootstrap';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Map2 from '../Clientes/Map2';

const { Option } = Select;

const RegistroForm = () => {
  const [locationData, setLocationData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const handleOpenModal = () => setModalShow(true);
  const handleCloseModal = () => setModalShow(false);

  const handleLocationSelect = (location) => {
    setLocationData(location);
    handleCloseModal();
  };

  const toggleOptionalFields = () => {
    setShowOptionalFields(!showOptionalFields);
  };

  const onFinish = async (values) => {
    try {
      const requestBody = {
        nombreusuario: values.username,
        contrasenia: values.password,
        ctelefono: values.phone,
        crazon_social: values.rsocial,
        tipocliente: values.docu,
        snombre: values.sname,
        capellido: values.lastname,
        ruc_cedula: values.doc,
        correorecuperacion: values.email,
      };

      if (locationData) {
        requestBody.latitud = locationData.latitud;
        requestBody.longitud = locationData.longitud;
      }

      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Login/crear/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("uwu");
      } else {
        const errorMessage = data && data.error ? data.error : 'Error desconocido';
        showError(errorMessage);
      }
    } catch (error) {
      showError('Error desconocido');
      console.error('Error en la solicitud de registro:', error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    showError('Por favor, completa todos los campos correctamente');
  };

  const showError = (errorMessage) => {
    message.error({
      content: errorMessage,
    });
  };

  return (
    <>
      <Form
        name="registroForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ maxWidth: '600px', margin: '0 auto', marginTop:'30px',
        borderRadius: '10px', padding: '20px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }} >Regístrate</h2>

        <Form.Item
          label="Usuario"
          name="username"
          rules={[
            { required: true, message: 'Ingresa un nombre de usuario' },
            { max: 300, message: 'Máximo 300 caracteres' },
            {
              validator: async (_, value) => {
                try {
                  const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Login/cuentaexist/', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      nombreusuario: value,
                    }),
                  });

                  const data = await response.json();

                  if (data.mensaje === '1') {
                    throw new Error('Nombre de usuario en uso');
                  }
                } catch (error) {
                  throw error.message;
                }
              },
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Usuario" />
        </Form.Item>

        <Form.Item
          label="Teléfono"
          name="phone"
          rules={[
            { required: true, message: 'Ingresa tu número de teléfono' },
            { max: 300, message: 'Máximo 300 caracteres' },
            {
              pattern: /^[0-9]+$/, // Solo números
              message: 'Ingresa solo números en el teléfono',
            },
            {
              validator: async (_, value) => {
                try {
                  const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Login/phoneExist/', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      ctelefono: value,
                    }),
                  });

                  const data = await response.json();

                  if (data.mensaje === '1') {
                    throw new Error('Número de teléfono registrado');
                  }
                } catch (error) {
                  throw error.message;
                }
              },
            },
          ]}
        >
          <Input placeholder="Teléfono" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            { required: true, message: 'Ingresa tu contraseña' },
            { max: 20, message: 'Máximo 20 caracteres' },
            { min: 6, message: 'Mínimo 6 caracteres' },
          ]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>

        <Form.Item
          label="Repite tu contraseña"
          name="repeat_password"
          rules={[
            { required: true, message: 'Repite tu contraseña' },
            {
              validator: (_, value) => {
                const password = value;
                const repeatPassword = value;
                if (password !== repeatPassword) {
                  return Promise.reject('Las contraseñas no coinciden');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password placeholder="Repite contraseña" />
        </Form.Item>

        <Form.Item>
          <Button type="default" onClick={toggleOptionalFields} style={{ width: '100%' 
        , backgroundColor: '#52c5f7',  // Color de fondo del botón
        color: '#fff',}}>
            {showOptionalFields ? 'Ocultar campos opcionales' : 'Mostrar campos opcionales'}
          </Button>
        </Form.Item>

        {showOptionalFields && (
          <>
            <Form.Item
              label="Razón social"
              name="rsocial"
              rules={[
                { max: 300, message: 'Máximo 300 caracteres' },
              ]}
            >
              <Input placeholder="Razón Social" />
            </Form.Item>

            <Form.Item
              label="Nombre"
              name="sname"
              rules={[
                { max: 300, message: 'Máximo 300 caracteres' },
              ]}
            >
              <Input placeholder="Nombre" />
            </Form.Item>

            <Form.Item
              label="Apellido"
              name="lastname"
              rules={[
                { max: 300, message: 'Máximo 300 caracteres' },
              ]}
            >
              <Input placeholder="Apellido" />
            </Form.Item>

            <Form.Item
              label="T. de documento:"
              name="docu"
            >
              <Select placeholder="Selecciona">
                <Option value="04">RUC</Option>
                <Option value="05">Cédula</Option>
                <Option value="06">Pasaporte</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Documento"
              name="doc"
              rules={[
                { max: 300, message: 'Máximo 300 caracteres' },
                {
                  pattern: /^[0-9]+$/, // Solo números
                  message: 'Ingresa solo números en el documento',
                },
                {
                  validator: async (_, value) => {
                    try {
                      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Login/DocumentExist/', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          ruc_cedula: value,
                        }),
                      });

                      const data = await response.json();

                      if (data.mensaje === '1') {
                        throw new Error('Documento de identidad registrado');
                      }
                    } catch (error) {
                      throw error.message;
                    }
                  },
                },
              ]}
            >
              <Input placeholder="Documento" />
            </Form.Item>

            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { type: 'email', message: 'Ingresa un correo electrónico válido' },
                { max: 300, message: 'Máximo 20 caracteres' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Correo electrónico" />
            </Form.Item>

            <Form.Item
              label="Dirección"
              name="adress"
            >
              <Button onClick={handleOpenModal} style={{ width: '100%',
                 backgroundColor: '#555555',  // Color de fondo del botón
                 color: '#fff',              // Color del texto del botón
                 }}>
                Agregar Ubicación
              </Button>
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%', 
                 backgroundColor: '#1890ff',  
                 color: '#fff',             
                }}>
            Registrarse
          </Button>
        </Form.Item>

        <Form.Item>
          <Link to={'/'}>
            <Button type="default" htmlType="button" style={{ width: '100%',
                 backgroundColor: '#00245f',  
                 color: '#ffffff',            
                  }}>
              Iniciar sesión
            </Button>
          </Link>
        </Form.Item>

        <Alert
          message="¿Ya tienes una cuenta? Inicia sesión para disfrutar de nuestros productos."
          type="info"
          showIcon
          style={{ marginTop: '10px' }}
        />
      </Form>

      {/* Modal de Mapa */}
      <Modal show={modalShow} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton style={{ borderBottom: 'none' }} />
        <Modal.Body>
          <Map2 onLocationSelect={handleLocationSelect} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RegistroForm;
