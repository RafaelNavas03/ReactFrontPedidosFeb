import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, Drawer } from 'antd';
import CocinaFuncion from './cocinamodel';

const ProductosCocina = ({ idcategoria }) => {
    const [productosData, setProductos] = useState([]);
    const [componentesData, setComponentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // Estado para almacenar el producto o componente seleccionado
    const [drawerVisible, setDrawerVisible] = useState(false); // Estado para controlar la visibilidad del Drawer

    const listarProductos = async () => {
        try {
            const responseProductos = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listar/');
            const data = await responseProductos.json();

            if (data && Array.isArray(data.productos)) {
                const productosFiltrados = data.productos.filter(producto => producto.detalle);

                // Filtrar por categoría si se proporciona
                const productosCategoria = idcategoria ? productosFiltrados.filter(producto => producto.id_categoria === idcategoria) : productosFiltrados;

                setProductos(productosCategoria);
            } else {
                message.error('La respuesta de la API de productos no tiene el formato esperado.');
            }
        } catch (error) {
            message.error('Hubo un error al realizar la solicitud de productos' + error);
        } finally {
            setLoading(false);
        }
    };

    const listarComponentes = async () => {
        try {
            // Obtener todos los componentes de la API
            const responseComponentes = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listarcomponentes/');
            const data = await responseComponentes.json();

            if (data && Array.isArray(data.componentes)) {
                const componentesFiltrados = idcategoria
                    ? data.componentes.filter(componente => componente.id_categoria.id_categoria === idcategoria)
                    : data.componentes;
                setComponentes(componentesFiltrados);
            } else {
                message.error('La respuesta de la API de componentes no tiene el formato esperado.');
            }
        } catch (error) {
            message.error('Hubo un error al realizar la solicitud de componentes' + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listarProductos();
        listarComponentes();
    }, [idcategoria]);

    const renderCards = (data, isComponente) => {
        if (!Array.isArray(data)) {
            return null;
        }

        return data.map((item, index) => (
            <Col
                key={index}
                md={5}
                style={{ marginBottom: '16px', margin: '0.5%', width: '100%', cursor: 'pointer' }}
                onClick={() => handleItemClick(item)}
            >
                <Card
                    hoverable
                    title={item.nombre || item.nombreproducto}
                    style={{ borderLeft: `7px solid ${getColor(index)}`, borderRadius: '8px' }}
                >
                    <p>{item.descripcion || 'Sin descripción'}</p>
                    <p>{isComponente ? `Tipo: Componente` : `Tipo: Producto`}</p>
                </Card>
            </Col>
        ));
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        console.log('Item');
        console.log(item);
        setDrawerVisible(true);
    };

    const handleDrawerClose = () => {
        setSelectedItem(null);
        setDrawerVisible(false);
    };

    const getColor = (index) => {
        const colors = ['#722ed1', '#faad14', '#f5222d', '#52c41a', '#1890ff'];
        return colors[index % colors.length];
    };

    return (
        <>
            <Row gutter={[16, 16]}>
                {renderCards(productosData, false)}
                {renderCards(componentesData, true)}
            </Row>

            <Drawer
                title={selectedItem ? selectedItem.nombre : 'Detalle del Producto/Componente'}
                closable={true}
                onClose={handleDrawerClose}
                width={'75%'}
                visible={drawerVisible}
            >
                {selectedItem && selectedItem.id_componente && (
                    <>
                        <CocinaFuncion componente={selectedItem}></CocinaFuncion>
                    </>
                )}
                {selectedItem && selectedItem.id_producto && (
                    <>
                        <CocinaFuncion producto={selectedItem}></CocinaFuncion>
                    </>
                )}
            </Drawer>
        </>
    );
};

export default ProductosCocina;