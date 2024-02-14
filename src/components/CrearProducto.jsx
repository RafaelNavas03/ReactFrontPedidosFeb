import React, { useState, useEffect } from 'react';
import { notification, Form, Input, Button, Upload, message, Select, Checkbox, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TransferContainer from './selectcomponent.jsx';
import { Row, Col } from 'react-bootstrap';  // Importar el nuevo componente

const CrearProducto = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [imagenP, setimagenP] = useState(null);
  const [detallecomponente, setdetallecomponente] = useState(false);
  const [mostrarFabricacion, setMostrarFabricacion] = useState(false);


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listar_categorias/');
        if (response.ok) {
          const data = await response.json();
          setCategorias(data.categorias);
        } else {
          const errorData = await response.json();
          message.error(errorData.error);
        }
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
        message.error('Hubo un error al cargar las categorías');
      }
    };



    const fetchUnidadesMedida = async () => {
      try {
        const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listarum/');
        if (response.ok) {
          const data = await response.json();
          setUnidadesMedida(data.unidades_medida);
        } else {
          const errorData = await response.json();
          message.error(errorData.error);
        }
      } catch (error) {
        console.error('Error al cargar las unidades de medida:', error);
        message.error('Hubo un error al cargar las unidades de medida');
      }
    };
    fetchCategorias();
    fetchUnidadesMedida();
  }, []);

  const savedetalle = async (jsondetalle) => {
    setdetallecomponente(jsondetalle);
  }

  useEffect(() => {
    const imagenValue = form.getFieldValue('imagen_p');
    console.log(imagenValue);
    if (imagenValue) {
      setFileList([
        {
          uid: '-1',
          name: 'Imagen existente',
          status: 'done',
          url: imagenValue,
        },
      ]);
    }
  }, [form.getFieldValue('imagen_p')]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('id_categoria', values.id_categoria);
      formData.append('id_um', values.id_um);
      formData.append('nombre_producto', values.nombre_producto);
      formData.append('descripcion_producto', values.descripcion_producto);
      formData.append('precio_unitario', values.precio_unitario);
      formData.append('puntos_p', values.puntos_p);
      formData.append('iva', values.iva ? '1' : '0');
      formData.append('ice', values.ice ? '1' : '0');
      formData.append('irbpnr', values.irbpnr ? '1' : '0');
      console.log("Hay imagn?" + imagenP);
      formData.append('imagen_p', imagenP);
      formData.append('detalle_comp', detallecomponente);
      formData.append('cantidad', values.cantidad);

      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/crearproducto/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        notification.success({
          message: 'Éxito',
          description: data.mensaje,
        });
        form.resetFields();
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error,
        });
      }
    } catch (error) {
      console.error('Error al crear el producto:', error);
      notification.error({
        message: 'Error',
        description: 'Hubo un error al crear el producto',
      });
    } finally {
      setLoading(false);
    }
  };


  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const handleChange = (info) => {
    if (info.fileList.length > 1) {

      info.fileList = [info.fileList.shift()];
    }
    setimagenP(info.fileList.length > 0 ? info.fileList[0].originFileObj : null);
  };

  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      <Form.Item name="id_categoria" label="Categoría" rules={[{ required: true }]}>
        <Select placeholder="Seleccione una categoría">
          {categorias.map((categoria) => (
            <Select.Option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.catnombre}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="id_um" label="Unidad de Medida" rules={[{ required: true }]}>
        <Select placeholder="Seleccione una unidad de medida">
          {unidadesMedida.map((um) => (
            <Select.Option key={um.id_um} value={um.id_um}>
              {um.nombre_um}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="nombre_producto" label="Nombre del Producto" rules={[
        { required: true, message: 'Por favor ingrese el nombre del producto' },
        { max: 300, message: 'El nombre del producto no puede tener más de 300 caracteres' },
      ]}>
        <Input />
      </Form.Item>

      <Form.Item name="descripcion_producto" label="Descripción del Producto" rules={[
        { max: 300, message: 'La descripción del producto no puede tener más de 300 caracteres' },
      ]}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        name="precio_unitario"
        label="Precio Unitario"
        rules={[
          { required: true, message: 'Por favor ingrese el precio unitario' },
          {
            pattern: /^(?:\d+)?(?:\.\d{1,2})?$/,
            message: 'El precio unitario debe ser un número válido con hasta 2 decimales',
          },
        ]}
      >
        <Input type="text" min={0} />
      </Form.Item>

      <Form.Item
        name="puntos_p"
        label="Puntos del Producto"
        rules={[
          { required: true, message: 'Por favor ingrese los puntos del producto' },
          {
            type: 'number',
            transform: value => parseFloat(value),
            validator: (rule, value) => {
              if (isNaN(value) || value < 0) {
                return Promise.reject('Los puntos del producto no pueden ser negativos');
              }
              if (value.toString().length > 3) {
                return Promise.reject('Los puntos del producto no pueden tener más de 3 dígitos');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input type="number" min={0} />
      </Form.Item>

      <Form.Item name="iva" label="IVA" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item name="ice" label="ICE" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item name="irbpnr" label="IRBPNR" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item label="Imagen" name="imagen_p" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload
          accept="image/*"
          listType="picture"
          beforeUpload={() => false}
          fileList={imagenP ? [{ uid: '1', originFileObj: imagenP }] : []}
          onChange={handleChange}
        >
          <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
        </Upload>
      </Form.Item>
      <Row hidden={!mostrarFabricacion}>
        <label>Cantidad generada a partir del ensamble</label>
        <Col md={12}>
          <Form.Item
            label=':'
            name="cantidad"
            rules={[
              { required: false },
              { type: 'number', message: 'Por favor, ingrese un valor numérico válido para la cantidad' },
            ]}
          >
            <InputNumber
              step={0.01}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              min={0}
            />
          </Form.Item>
          <h6>Selecciona los artículos que ensamblan tu artículo</h6>
          <div style={{ border: '1px solid #A4A4A4', padding: '2%', margin: '5%' }}>
            <TransferContainer onValor={savedetalle} />
          </div>
        </Col>
      </Row>
      <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
        <Button type="primary" onClick={() => setMostrarFabricacion(!mostrarFabricacion)}>
          Añadir fabricación
        </Button>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Crear Producto
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CrearProducto;
