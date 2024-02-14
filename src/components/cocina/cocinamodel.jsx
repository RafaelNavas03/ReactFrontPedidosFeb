import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, InputNumber, Select, Button, Tag, notification } from 'antd';

const { Option } = Select;

const CocinaFuncion = ({ componente, producto }) => {
    const [cantidad, setCantidad] = useState(1);
    const [bodega, setBodega] = useState('');
    const [costoTotal, setCostoTotal] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [bodegas, setBodegas] = useState([]);
    const [suficientes, setSuficientes] = useState([]);

    useEffect(() => {
        fetch('projectdjangobakfebrero-production.up.railway.app/bodega/listar/')
            .then(response => response.json())
            .then(data => {
                setBodegas(data.bodegas);
                console.log(data.bodegas);
                if (data.bodegas.length > 0) {
                    setBodega(data.bodegas[0].id_bodega);
                    console.log(bodega);
                }
            })
            .catch(error => console.error('Error fetching bodegas:', error));

    }, []); // Se mueve la carga inicial de bodegas fuera del useEffect principal

    useEffect(() => {
        verificarcomponentes(cantidad);
    }, [selectedItems, costoTotal, bodega]); // Agregamos bodega a las dependencias

    const handleBodega = (value) => {
        setBodega(value);
    };
    const handleCantidad = (value) => {
        setCantidad(value)
        verificarcomponentes(value);
    };

    useEffect(() => {
        cargarcomponentes();
    }, [componente, bodegas]); // Agregamos bodegas a las dependencias

    const cargarcomponentes = () => {
        if (componente && componente.detalle) {
            const initialItems = componente.detalle.detalle.map(item => ({
                key: item.id_componentehijo.id.toString(),
                title: item.id_componentehijo.nombre,
                quantity: item.cantidadhijo,
            }));
            setSelectedItems(initialItems);
            const costoIndividual = componente.costo || 0;
            setCostoTotal(cantidad * costoIndividual);
        }
        if (producto && producto.detalle) {
            const initialItems = producto.detalle.detalle.map(item => ({
                key: item.id_componentehijo.id.toString(),
                title: item.id_componentehijo.nombre,
                quantity: item.cantidadhijo,
            }));
            setSelectedItems(initialItems);
            const costoIndividual = producto.costo || 0;
            setCostoTotal(cantidad * costoIndividual);
        }
    };

    const verificarcomponentes = (canti) => {
        console.log('Lo que se envia');
        console.log(selectedItems);
        console.log('Cantidad enviada: ' + canti);
        if (selectedItems.length > 0 && bodega && componente) {
            console.log('Por componente');
            console.log(selectedItems);
            const promises = selectedItems.map(item => {
                const formData = new FormData();
                formData.append('id_componente', item.key);
                formData.append('cantxensamble', item.quantity);
                formData.append('catngenensamble', componente.detalle.padrecant);
                formData.append('id_componentegen', componente.id_componente);
                formData.append('cantxfabricar', canti);
                formData.append('id_bodega', bodega); // Buscamos el id de la bodega

                return fetch('projectdjangobakfebrero-production.up.railway.app/producto/componentenecesario/', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => data.mensaje);
            });

            Promise.all(promises)
                .then(results => setSuficientes(results))
                .catch(error => console.error('Error fetching inventory:', error));
        }
        if (selectedItems.length > 0 && bodega && producto) {
            console.log('Por producto');
            console.log(selectedItems);
            const promises = selectedItems.map(item => {
                const formData = new FormData();
                formData.append('id_componente', item.key);
                formData.append('cantxensamble', item.quantity);
                formData.append('catngenensamble', producto.detalle.padrecant);
                formData.append('id_productogen', producto.id_producto);
                formData.append('cantxfabricar', canti);
                formData.append('id_bodega', bodega); // Buscamos el id de la bodega

                return fetch('projectdjangobakfebrero-production.up.railway.app/producto/componentenecesariop/', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => data.mensaje);
            });

            Promise.all(promises)
                .then(results => setSuficientes(results))
                .catch(error => console.error('Error fetching inventory:', error));
        }
    };

    const handlePreparar = () => {
        verificarcomponentes(cantidad);
        const haySuficientes = suficientes.every(result => result === 1);

        if (haySuficientes) {
            prepareComponent();
        } else {
            notification.error({
                message: 'Error',
                description: 'Al menos un artículo no tiene suficiente disponibilidad',
            });
        }
    };

    const prepareComponent = () => {
        const formData = new FormData();
        if (selectedItems.length > 0 && bodega && componente) {
            console.log('Gastar');
            console.log(selectedItems);
            formData.append('lista_componentes', JSON.stringify(selectedItems));
            formData.append('cantidad_fabricar', cantidad);
            formData.append('id_componente_generado', componente.id_componente);
            formData.append('id_bodega', bodega);
            fetch('projectdjangobakfebrero-production.up.railway.app/producto/fabricarcomponente/', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.mensaje === 'Operación exitosa') {
                        notification.success({
                            message: 'Éxito',
                            description: 'Preparando ' + cantidad + ' ' + componente.nombre + ' en ' + bodega,
                        });
                    } else {
                        notification.error({
                            message: 'Éxito',
                            description: 'Error en la operación',
                        });
                    }
                })
                .catch(error => console.error('Error preparing component:', error));
        }
        if (selectedItems.length > 0 && bodega && producto) {
            console.log('Gastar');
            console.log(selectedItems);
            formData.append('lista_componentes', JSON.stringify(selectedItems));
            formData.append('cantidad_fabricar', cantidad);
            formData.append('id_producto_generado', producto.id_producto);
            formData.append('id_bodega', bodega);

            fetch('projectdjangobakfebrero-production.up.railway.app/producto/fabricarproducto/', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.mensaje === 'Operación exitosa') {
                        notification.success({
                            message: 'Éxito',
                            description: 'Preparando ' + cantidad + ' ' + producto.nombreproducto + ' en ' + bodega,
                        });
                    } else {
                        notification.error({
                            message: 'Éxito',
                            description: 'Error en la operación',
                        });
                    }
                })
                .catch(error => console.error('Error preparing component:', error));
        }


    };

    return (
        <Row>
            {componente && bodega && (
                <Col md={24}>
                    <Row>
                        {componente.detalle && (
                            <Col md={12} style={{ padding: '2%' }}>
                                <Card title={`Ensamble de ${componente.nombre}`} style={{ minHeight: '500px' }}>
                                    <p>Para preparar {componente.detalle.padrecant} </p>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Nombre</th>
                                                <th>Cantidad</th>
                                                <th>Suficientes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedItems.map((item, index) => (
                                                <tr key={item.key}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.title}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{suficientes[index] === 1 ? <Tag color={'#4CAF50'}>Hay suficientes</Tag> : <Tag color={'#f5222d'}>No hay suficientes</Tag>}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Card>
                            </Col>
                        )}
                        <Col md={12} style={{ padding: '2%' }}>
                            <Card title="Preparación" style={{ minHeight: '300px', marginTop: '16px' }}>
                                <label>Cantidad: </label>
                                <InputNumber
                                    min={1}
                                    value={cantidad}
                                    onChange={(value) => handleCantidad(value)}
                                    style={{ marginRight: '16px' }}
                                />
                                <br />
                                <label>Bodega:</label>
                                <Select
                                    style={{ width: '100%', marginBottom: '16px' }}
                                    value={bodega}
                                    onChange={(value) => handleBodega(value)}
                                >
                                    {bodegas.map(bodega => (
                                        <Option key={bodega.id_bodega} value={bodega.id_bodega}>
                                            {bodega.nombrebog}
                                        </Option>
                                    ))}
                                </Select>
                                <br />

                                <Button type="primary" onClick={handlePreparar}>
                                    Preparar
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                    <table className="table" border={'1px'}></table>
                </Col>
            )}
            {producto && bodega && (
                <Col md={24}>
                    <Row>
                        {producto.detalle && (
                            <Col md={12} style={{ padding: '2%' }}>
                                <Card title={`Ensamble de ${producto.nombreproducto}`} style={{ minHeight: '500px' }}>
                                    <p>Para preparar {producto.detalle.padrecant} </p>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Nombre</th>
                                                <th>Cantidad</th>
                                                <th>Suficientes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedItems.map((item, index) => (
                                                <tr key={item.key}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.title}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{suficientes[index] === 1 ? <Tag color={'#4CAF50'}>Hay suficientes</Tag> : <Tag color={'#f5222d'}>No hay suficientes</Tag>}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Card>
                            </Col>
                        )}
                        <Col md={12} style={{ padding: '2%' }}>
                            <Card title="Preparación" style={{ minHeight: '300px', marginTop: '16px' }}>
                                <label>Cantidad: </label>
                                <InputNumber
                                    min={1}
                                    value={cantidad}
                                    onChange={(value) => handleCantidad(value)}
                                    style={{ marginRight: '16px' }}
                                />
                                <br />
                                <label>Bodega:</label>
                                <Select
                                    style={{ width: '100%', marginBottom: '16px' }}
                                    value={bodega}
                                    onChange={(value) => handleBodega(value)}
                                >
                                    {bodegas.map(bodega => (
                                        <Option key={bodega.id_bodega} value={bodega.id_bodega}>
                                            {bodega.nombrebog}
                                        </Option>
                                    ))}
                                </Select>
                                <br />

                                <Button type="primary" onClick={handlePreparar}>
                                    Preparar
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                    <table className="table" border={'1px'}></table>
                </Col>
            )}
        </Row>
    );
};

export default CocinaFuncion;