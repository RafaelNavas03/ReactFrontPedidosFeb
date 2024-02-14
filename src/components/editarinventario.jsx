import React, { useState, useEffect } from 'react';
import { notification, Segmented, Table, Tag, Tooltip, Avatar, Button, Row, Col, Drawer, Divider, Pagination, Input, Form } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import imginventario from './res/imginventario.png';
import CrearInventario from './crearinventario';

const Inventario = () => {
    const [selectedOpcion, setSelectedOpcion] = useState('Inventario');
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [openp, setOpenp] = useState(false);
    const [inventario, setInventario] = useState([]);
    const [bodegas, setBodegas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [componentes, setComponentes] = useState([]);
    const [editStockMinimoId, setEditStockMinimoId] = useState(null);
    const [newStockMinimo, setNewStockMinimo] = useState('');
    const [unidadesMedida, setUnidadesMedida] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [form] = Form.useForm();

    const cargarInventario = async () => {
        try {
            const responseInventario = await fetch('https://projectdjangobakfebrero-production.up.railway.app/Inventario/verinventario/');
            const dataInventario = await responseInventario.json();
            setInventario(dataInventario.inventario);

            const responseBodegas = await fetch('https://projectdjangobakfebrero-production.up.railway.app/bodega/listar/');
            const dataBodegas = await responseBodegas.json();
            setBodegas(dataBodegas.bodegas);

            const responseProductos = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listar/');
            const dataProductos = await responseProductos.json();
            setProductos(dataProductos.productos);

            const responseComponentes = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listarcomponentes/');
            const dataComponentes = await responseComponentes.json();
            setComponentes(dataComponentes.componentes);

            const responseUnidadesMedida = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listarum/');
            const dataUnidadesMedida = await responseUnidadesMedida.json();
            setUnidadesMedida(dataUnidadesMedida.unidades_medida);
        } catch (error) {
            console.error('Error al obtener el inventario, bodegas, productos, unidades de medidas o componentes:', error);
        }
    };

    useEffect(() => {
        cargarInventario();
    }, []);

    const Changueopcion = (value) => {
        setSelectedOpcion(value);
    };

    const showDrawerp = () => {
        setOpenp(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const onClosep = () => {
        setOpenp(false);
    };

    const onEditStockMinimo = (id) => {
        setEditStockMinimoId(id);
        const item = inventario.find(i => i.id_inventario === id);
        setNewStockMinimo(item.stock_minimo.toString());
    };

    const onCancelEditStockMinimo = () => {
        setEditStockMinimoId(null);
        setNewStockMinimo('');
    };

    const onSaveEditStockMinimo = async (id) => {
        try {
            const formData = new FormData();
            formData.append('nuevo_stock_minimo', newStockMinimo);
    
            const response = await fetch(`https://projectdjangobakfebrero-production.up.railway.app/Inventario/editar/${id}/`, {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                // Actualizar la lista de inventario después de editar el stock mínimo
                cargarInventario();
                onCancelEditStockMinimo();
    
                // Mostrar notificación de éxito
                notification.success({
                    message: 'Éxito',
                    description: 'El stock mínimo se ha editado correctamente.',
                });
            } else {
                console.error('Error al editar el stock mínimo:', response.statusText);
    
                // Mostrar notificación de error
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error al editar el stock mínimo.',
                });
            }
        } catch (error) {
            console.error('Error al editar el stock mínimo:', error);
    
            // Mostrar notificación de error
            notification.error({
                message: 'Error',
                description: 'Hubo un error al editar el stock mínimo.',
            });
        }
    };

    useEffect(() => {
        form.resetFields();
        if (!editModalVisible) {
            cargarInventario(currentPage);
        }
      }, []);
    

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id_inventario',
            key: 'id_inventario',
        },
        {
            title: 'Bodega',
            dataIndex: 'id_bodega',
            key: 'id_bodega',
            render: (idBodega) => {
                const bodega = bodegas.find(b => b.id_bodega === idBodega);
                return bodega ? (
                    <Tag color="blue">
                        {bodega.nombrebog}
                    </Tag>
                ) : null;
            },
        },
        {
            title: 'Producto',
            dataIndex: 'id_producto',
            key: 'id_producto',
            render: (idProducto) => {
                const producto = productos.find(p => p.id_producto === idProducto);
                return producto ? (
                    <Tag color="pink">
                        {`Producto ${producto.nombreproducto}`}
                    </Tag>
                ) : null;
            },
        },
        {
            title: 'Componente',
            dataIndex: 'id_componente',
            key: 'id_componente',
            render: (idComponente) => {
                const componente = componentes.find(c => c.id_componente === idComponente);
                return componente ? (
                    <Tag color="purple">
                        {`Componente ${componente.nombre}`}
                    </Tag>
                ) : null;
            },
        },
        {
            title: 'Costo Unitario',
            dataIndex: 'costo_unitario',
            key: 'costo_unitario',
        },
        {
            title: 'ID UM',
            dataIndex: 'id_um',
            key: 'id_um',
            render: (idUM) => {
                const unidadMedida = unidadesMedida.find(um => um.id_um === idUM);
                return unidadMedida ? (
                    <Tag color="orange">
                        {unidadMedida.nombre_um}
                    </Tag>
                ) : null;
            },
        },
        {
            title: 'Stock Mínimo',
            dataIndex: 'stock_minimo',
            key: 'stock_minimo',
            render: (stockMinimo, record) => {
                return editStockMinimoId === record.id_inventario ? (
                    <Form>
                        <Form.Item
                            name="newStockMinimo"
                            initialValue={newStockMinimo}
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, ingrese el nuevo stock mínimo',
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                autoFocus
                                onChange={(e) => setNewStockMinimo(e.target.value)}
                                style={{ width: 80 }}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                            onClick={() => onSaveEditStockMinimo(record.id_inventario)}
                        />
                        <Button
                            type="default"
                            icon={<CloseOutlined />}
                            size="small"
                            onClick={onCancelEditStockMinimo}
                        />
                    </Form>
                ) : (
                    <>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            {stockMinimo} <EditOutlined onClick={() => onEditStockMinimo(record.id_inventario)} />
                        </span>
                    </>
                );
            },
        },
        {
            title: 'Cantidad Disponible',
            dataIndex: 'cantidad_disponible',
            key: 'cantidad_disponible',
        },
    ];

    return (
        <div>
            <Row>
                <Col md={24}>
                    <Segmented
                        options={[
                            {
                                label: (
                                    <Tooltip title="Inventario">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={imginventario} size="large" />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'Inventario',
                            },
                        ]}
                        value={selectedOpcion}
                        onChange={Changueopcion}
                    />
                </Col>
                {selectedOpcion === 'Inventario' && (
                    <>
                        <Divider>Control Inventario</Divider>
                        <Col md={24}>
                            <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawerp}>
                                Crear nuevo espacio en inventario
                            </Button>
                        </Col>
                        <Col md={24}>
                            <div className="table-responsive">
                                <Table dataSource={inventario} columns={columns} rowKey="id_inventario" pagination={true} />
                            </div>
                        </Col>
                        <Col md={24}>
                            <Pagination
                                current={currentPage}
                                total={total}
                                onChange={handlePageChange}
                                pageSize={8}
                                style={{ marginTop: '16px', textAlign: 'center' }}
                            />
                        </Col>
                    </>
                )}
            </Row>
            <Drawer
                title="Crear Inventario"
                width={720}
                onClose={onClosep}
                open={openp}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <CrearInventario />
            </Drawer>
        </div>
    );
};

export default Inventario;