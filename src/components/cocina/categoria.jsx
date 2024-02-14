import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, Divider } from 'antd';
import ProductosCocina from './productosarticulos';
import './style.css'

const CategoriaCocina = ({ id_tipoproducto }) => {
    const [categoriasData, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [CategoriaId, setCategoriaId] = useState('');

    const handleCardClick = (idcategoria) => {
        setCategoriaId(idcategoria);
        console.log(idcategoria);
      };

    const listarp = async () => {
        try {
            let url = 'https://projectdjangobakfebrero-production.up.railway.app/producto/listar_categorias/';

            const responseCategorias = await fetch(url);
            const data = await responseCategorias.json();

            if (data && Array.isArray(data.categorias)) {
                // Filtrar las categorías si se proporciona id_tipoproducto
                const categoriasFiltradas = id_tipoproducto
                    ? data.categorias.filter(categoria => categoria.id_tipoproducto.id_tipoproducto === id_tipoproducto)
                    : data.categorias;

                setCategorias(categoriasFiltradas);
                setCategoriaId(categoriasFiltradas[0].id_categoria);
            } else {
                message.error('La respuesta de la API no tiene el formato esperado.');
            }
        } catch (error) {
            message.error('Hubo un error al realizar la solicitud' + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listarp();
    }, [id_tipoproducto]); // Agregar id_tipoproducto como dependencia del efecto

    const renderCards = () => {
        if (!Array.isArray(categoriasData)) {
            return null; // o algún otro comportamiento por defecto
        }
        return categoriasData.map((categorias, index) => (
            <Col key={index} md={5} style={{ marginBottom: '16px', margin: '0.5%', width: '100%' }}>
                <Card
                    className={CategoriaId === categorias.id_categoria ? 'selected-card' : 'card'}
                    title={categorias.catnombre}
                    style={{
                        borderLeft: `7px solid ${getColor(categorias.id_categoria)}`,
                        borderRadius: '8px',
                        height: '150px',
                        cursor: 'pointer',
                      }}
                    onClick={() => handleCardClick(categorias.id_categoria)}
                >
                    <p>{categorias.descripcion || 'Sin descripción'}</p>
                </Card>
            </Col>
        ));
    };

    const getColor = (index) => {
        const colors = ['#722ed1', '#faad14', '#f5222d', '#52c41a', '#1890ff'];
        return colors[index % colors.length];
    };

    return (
        <>
            <Row>
                {renderCards()}
            </Row>
            <Row>
                <Col md={24}>
                    <Divider>Productos & Artículos</Divider>
                    <ProductosCocina idcategoria={CategoriaId}></ProductosCocina>
                </Col>
            </Row>
        </>
    );
};

export default CategoriaCocina;