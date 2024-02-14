import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Table, Space, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// Función para convertir Base64 a URL de datos
const base64ToUrl = (base64String, mimeType) => {
  return `data:${mimeType};base64,${base64String}`;
};

// Función para redimensionar la imagen
const resizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const width = Math.min(maxWidth, img.width);
      const height = Math.min(maxHeight, img.height);

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, file.type);
    };
  });
};

const CrearAvisos = () => {
  const [form] = Form.useForm();
  const [avisos, setAvisos] = useState([]);

  const onFinish = async (values) => {
    const { titulo, descripcion, imagen } = values;

    // Redimensionar la imagen antes de enviarla
    const resizedImage = await resizeImage(imagen.file, 1050, 500);

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('imagen', resizedImage);

    try {
      const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/avisos/crear/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Aviso creado con éxito');
        form.resetFields();
        obtenerAvisos();
      } else {
        message.error(`Error al crear aviso: ${data.error}`);
      }
    } catch (error) {
      console.log(error);
      message.error('Error en la solicitud de creación de aviso');
    }
  };
  const resizeImage = (file, targetWidth, targetHeight) => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        canvas.width = targetWidth;
        canvas.height = targetHeight;
  
        // Calcula el punto de inicio para el recorte centrado
        const offsetX = (img.width - targetWidth) / 2;
        const offsetY = (img.height - targetHeight) / 2;
  
        // Dibuja la imagen recortada en el lienzo
        ctx.drawImage(img, offsetX, offsetY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
  
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type);
      };
    });
  };
  


  const obtenerAvisos = async () => {
    try {
      const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/avisos/avisos/');
      const data = await response.json();
      if (response.ok) {
        setAvisos(data.avisos_principales);
      } else {
        message.error(`Error al obtener la lista de avisos: ${data.error}`);
      }
    } catch (error) {
      message.error('Error en la solicitud de lista de avisos');
    }
  };

  useEffect(() => {
    obtenerAvisos();
  }, []);

  const columns = [
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Imagen',
      dataIndex: 'imagen',
      key: 'imagen',
      render: (text, record) => (
        <Space size="middle">
          {record.imagen && (
            <Image
              src={base64ToUrl(record.imagen, 'image/png')}
              alt={`Imagen para ${record.titulo}`}
              style={{ maxWidth: '100px' }}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3>Crear Nuevo Aviso</h3>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Título" name="titulo" rules={[
          { required: true, message: 'Por favor, ingresa el título' },
          { max: 150, message: 'El título no puede tener más de 150 caracteres' },
        ]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[
            { required: true, message: 'Por favor, ingresa la descripción' },
            { max: 500, message: 'La descripción no puede tener más de 500 caracteres' },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Imagen" name="imagen" valuePropName="file">
          <Upload
            maxCount={1}
            beforeUpload={() => false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Crear Aviso
          </Button>
        </Form.Item>
      </Form>


      {/* Tabla de avisos */}
      <h3>Lista de Avisos Principales</h3>
      <Table columns={columns} dataSource={avisos} rowKey="id_aviso" />
    </div>
  );
};
export default CrearAvisos;