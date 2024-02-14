import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CrearCategoriaCombos = () => {
  const [form] = Form.useForm();
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [imagenCategoria, setImagenCategoria] = useState(null);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      setImagenCategoria(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('catnombre', values.catnombre);
  
      if (values.descripcion !== undefined) {
        formData.append('descripcion', values.descripcion);
      }
  
      if (values.imagencategoria && values.imagencategoria[0]?.originFileObj) {
        formData.append('imagencategoria', values.imagencategoria[0].originFileObj);
      }
  
      const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/combos/crearcat/', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setMensaje(data.mensaje);
        form.resetFields();
        message.success(data.mensaje);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        message.error(`Error: ${errorData.error}`);
        console.error(errorData); 
      }
    } catch (error) {
      setError('Error al procesar la solicitud');
      message.error('Error al procesar la solicitud, ya existe la categoría');
    }
  };
  

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Form
        form={form}
        name="crearCategoriaComboForm"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        encType="multipart/form-data"
      >
        <Form.Item label="Nombre de la categoría" name="catnombre" rules={[{ required: true, message: 'Por favor, ingresa el nombre de la categoría' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Descripción" name="descripcion">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Imagen de la categoría" name="imagencategoria" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload
            maxCount={1}
            listType="picture"
            beforeUpload={() => false}
            fileList={imagenCategoria ? [{ uid: '1', originFileObj: imagenCategoria }] : []}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Seleccionar imagen</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Crear Categoría de Combo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CrearCategoriaCombos;