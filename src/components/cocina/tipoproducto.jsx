import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, Divider } from 'antd';
import CategoriaCocina from './categoria';
import './style.css'

const TipoProducto = () => {
  const [loading, setLoading] = useState(false);
  const [data, setTiposProductos] = useState([]);
  const [tipoProductoId, setTipoProductoId] = useState('');

  const listarp = async () => {
    try {
      const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listarproductos/');
      const data = await response.json();
      setTiposProductos(data.tipos_productos);
    } catch (error) {
      message.error('Hubo un error al realizar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarp();
  }, []);

  const handleCardClick = (id_tipoproducto) => {
    setTipoProductoId(id_tipoproducto);
  };

  const renderCards = () => {
    return data.map((tipoProducto) => (
      <Col key={tipoProducto.id_tipoproducto} md={5} style={{ marginBottom: '16px', margin: '0.5%', width: '100%' }}>
        <Card
          title={tipoProducto.tpnombre}
          className={tipoProductoId === tipoProducto.id_tipoproducto ? 'selected-card' : 'card'}
          style={{
            borderLeft: `7px solid ${getColor(tipoProducto.id_tipoproducto)}`,
            borderRadius: '8px',
            height: '150px',
            cursor: 'pointer',
          }}
          onClick={() => handleCardClick(tipoProducto.id_tipoproducto)}
        >
          <p>{tipoProducto.descripcion || 'Sin descripción'}</p>
        </Card>
      </Col>
    ));
  };

  const getColor = (id_tipoproducto) => {
    const colors = ['#1890ff', '#f5222d', '#52c41a', '#faad14', '#722ed1'];
    return colors[id_tipoproducto % colors.length];
  };

  return (
    <>
      <Row>
        <Col key={'all'} md={5} style={{ marginBottom: '16px', margin: '0.5%', width: '100%' }}>
          <Card
            hoverable
            title='Tipos de productos'
            className='card'
            style={{
              background: '#FDF2E1',
              borderRadius: '8px',
              height: '150px',
              borderColor: tipoProductoId === '' ? '#1890ff' : '', // Establecer el color si está seleccionado
            }}
            onClick={() => handleCardClick('')}
          >
            <p>Todos los tipos</p>
          </Card>
        </Col>
        {renderCards()}
      </Row>
      <Row>
        <Col md={24}>
          <Divider>Categorias</Divider>
          <CategoriaCocina id_tipoproducto={tipoProductoId}></CategoriaCocina>
        </Col>
      </Row>
    </>
  );
};

export default TipoProducto;