import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, InputNumber, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TransferContainer from './selectcomponent.jsx';  // Importar el nuevo componente
import { Row, Col } from 'react-bootstrap';

const { Item } = Form;
const { Option } = Select;

const CrearComponenteForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [componenteslist, setComponentes] = useState([]);
  const [agregarDetalle, setagregarDetalle] = useState(false);
  const [detallecomponente, setdetallecomponente] = useState(false);

  const handleTipoChange = (value) => {
    setagregarDetalle(value === 'F');
  };

  useEffect(() => {
    const fetchComponentes = async () => {
      try {
        const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listarcomponentes/');
        if (response.ok) {
          const data = await response.json();
          const componentesWithDefaultCosto = data.componentes.map((componente) => ({
            ...componente,
            costo: componente.costo !== null ? componente.costo : '0.00',
          }));
          setComponentes(componentesWithDefaultCosto);
        } else {
          const errorData = await response.json();
          message.error(errorData.error);
        }
      } catch (error) {
        console.error('Error al cargar los componentes:', error);
        message.error('Hubo un error al cargar los componentes');
      } finally {
        setLoading(false);
      }
    };

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

    fetchUnidadesMedida();
    fetchCategorias();
    fetchComponentes();
  }, []);

  const savedetalle = async (jsondetalle) => {
    setdetallecomponente(jsondetalle);
  }

  const onFinish = async (values) => {
    try {
      const formDataObject = new FormData();
      if (values.tipo == 'F') {
        formDataObject.append('detalle_comp', detallecomponente);
        formDataObject.append('cantidad', values.cantidad);
      }
      if (values.descripcion) {
        formDataObject.append('descripcion', values.descripcion);
      }
      formDataObject.append('nombre', values.nombre);
      formDataObject.append('costo', values.costo);
      formDataObject.append('tipo', values.tipo);
      formDataObject.append('id_um', values.id_um);
      formDataObject.append('id_categoria', values.id_categoria);
      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/crearcomponente/', {
        method: 'POST',
        body: formDataObject,
      });

      const data = await response.json();
      if (response.ok) {
        notification.success({
          message: 'Éxito',
          description: 'Se creó el componente con exito',
        });
        form.resetFields();
      } else {
        message.error('Algo salió mal' + error);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Algo salió mal' + error,
      });
    }
  };



  return (
    <Form
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
    >
      <Item
        label="Nombre"
        name="nombre"
        rules={[{ required: true, message: 'Por favor, ingrese el nombre del componente' }]}
      >
        <Input />
      </Item>

      <Item
        label="Descripción"
        name="descripcion"
      >
        <Input.TextArea />
      </Item>

      <Form.Item name="id_categoria" label="Categoría" rules={[{ required: true }]}>
        <Select placeholder="Seleccione una categoría">
          {categorias.map((categoria) => (
            <Select.Option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.catnombre}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Item
        label="Costo de producción"
        name="costo"
        values={0}
        rules={[
          { required: true },
          { type: 'number', message: 'Por favor, ingrese un valor numérico válido para el costo' },
        ]}
      >
        <InputNumber
          step={0.01}
          min={0}
        />
      </Item>

      <Item
        label="Tipo"
        name="tipo"
        rules={[{ required: true, message: 'Por favor, seleccione el tipo del componente' }]}
      >
        <Select onChange={handleTipoChange}>
          <Option value="N">Normal</Option>
          <Option value="F">Fabricado</Option>
        </Select>
      </Item>
      <Item
        label="Unidades de Medida"
        name="id_um"
        rules={[{ required: true, message: 'Por favor, seleccione la unidad de medida' }]}
      >
        <Select>
          {unidadesMedida.map((um) => (
            <Option key={um.id_um} value={um.id_um}>
              {um.nombre_um}
            </Option>
          ))}
        </Select>
      </Item>

      {agregarDetalle && (

        <Row>
          <label>Cantidad generada a partir del ensamble</label>
          <Col md={12}>
            <Item
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
            </Item>
            <h6>Selecciona los artículos que ensamblan tu artículo</h6>
            <div style={{ border: '1px solid #A4A4A4', padding: '2%', margin: '5%' }}>
              <TransferContainer onValor={savedetalle} />
            </div>
          </Col>
        </Row>
      )}



      <Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
          Crear Componente
        </Button>
      </Item>
    </Form>
  );
};

export default CrearComponenteForm;
