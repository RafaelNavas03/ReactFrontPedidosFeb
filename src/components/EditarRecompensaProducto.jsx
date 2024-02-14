import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Drawer, Form, Input, Button, Row, Col, Divider, Pagination } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import EditarRecompensaComboForm from './EditarRecompensaCombo';

const EditarRecompensaProductoForm = () => {
    const [recompensasProductos, setRecompensasProductos] = useState([]);
    const [visible, setVisible] = useState(false);
    const [editedRecompensaProducto, setEditedRecompensaProducto] = useState(null);
    const [form] = Form.useForm();
    const [productos, setProductos] = useState([]);
    const [selectedOpcion, setSelectedOpcion] = useState('Productos');
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [imgproductos, setImgProductos] = useState('');

    const fetchRecompensasProductos = async () => {
        try {
            const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Recompensas/lista_recompensas_producto/');
            if (!response.ok) {
                throw new Error('Error fetching recompensas de producto');
            }
            const data = await response.json();
            setRecompensasProductos(data.recompensas_productos || []);
        } catch (error) {
            console.error('Error fetching recompensas de producto:', error);
        }
    };

    useEffect(() => {
        fetchRecompensasProductos();
    }, []);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('projectdjangobakfebrero-production.up.railway.app/producto/listar/');
                if (!response.ok) {
                    throw new Error('Error fetching productos');
                }
                const data = await response.json();
                setProductos(data.productos || []);
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };

        fetchProductos();
    }, []);

    const showDrawer = (recompensaProducto) => {
        setEditedRecompensaProducto(recompensaProducto);
        form.setFieldsValue({
            puntos_recompensa_producto: recompensaProducto.puntos_recompensa_producto,
            sestado: recompensaProducto.sestado === '1',
        });
        setVisible(true);
    };

    const onClose = () => {
        setEditedRecompensaProducto(null);
        setVisible(false);
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('puntos_recompensa_producto', form.getFieldValue('puntos_recompensa_producto'));
            formData.append('sestado', form.getFieldValue('sestado') ? '1' : '0');

            console.log('Valor del checkbox:', form.getFieldValue('sestado')); // Debugging

            const response = await fetch(`projectdjangobakfebrero-production.up.railway.app/Recompensas/editar_recompensa_producto/${editedRecompensaProducto.id_recompensa_producto}/`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error updating recompensa de producto');
            }

            // Recargar datos después de guardar
            fetchRecompensasProductos();

            form.resetFields();
            setVisible(false);
        } catch (error) {
            console.error('Error updating recompensa de producto:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            {recompensasProductos.map((recompensaProducto) => {
                const producto = productos.find((p) => p.id_producto === recompensaProducto.id_producto);

                if (!producto) {
                    return null;
                }
                return (
                    <div key={recompensaProducto.id_recompensa_producto}>
                        <Row>
                            <Col md={12}>
                                <Row>
                                    <Col xs={24} sm={12} md={3} lg={3}>
                                        <Card
                                            key={recompensaProducto.id_recompensa_producto}
                                            title={`${producto.nombreproducto}`}
                                            style={{ marginBottom: '16px' }}
                                            onClick={() => showDrawer(recompensaProducto)}
                                        >
                                            <img
                                                src={`data:image/png;base64,${producto.imagenp}`}
                                                alt={producto.nombreproducto}
                                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                            />
                                            <p>Puntos de recompensa: {recompensaProducto.puntos_recompensa_producto}</p>
                                            <p>Estado: {recompensaProducto.sestado === '1' ? 'Activo' : 'Inactivo'}</p>
                                        </Card>
                                    </Col>
                                </Row>
                                <Pagination current={currentPage} total={total} onChange={handlePageChange} pageSize={8} style={{ marginTop: '16px', textAlign: 'center' }} />
                            </Col>
                            {selectedOpcion === 'Productos' && (
                                <>
                                    <Divider>Control productos</Divider>
                                    <Col md={12}>
                                        <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawer}>
                                            Crear nuevo producto
                                        </Button>
                                    </Col>
                                    <Col md={12}>
                                        <Row>
                                            <Col xs={24} sm={12} md={3} lg={3}>
                                                <Card
                                                    key={recompensaProducto.id_recompensa_producto}
                                                    title={`${producto.nombreproducto}`}
                                                    style={{ marginBottom: '16px' }}
                                                    onClick={() => showDrawer(recompensaProducto)}
                                                >
                                                    <img
                                                        src={`data:image/png;base64,${producto.imagenp}`}
                                                        alt={producto.nombreproducto}
                                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                    />
                                                    <p>Puntos de recompensa: {recompensaProducto.puntos_recompensa_producto}</p>
                                                    <p>Estado: {recompensaProducto.sestado === '1' ? 'Activo' : 'Inactivo'}</p>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Pagination current={currentPage} total={total} onChange={handlePageChange} pageSize={8} style={{ marginTop: '16px', textAlign: 'center' }} />
                                    </Col>
                                </>
                            )}
                            {selectedOpcion === 'Categorias' && (
                                <>
                                    <Divider>Control categorías</Divider>
                                    <Col md={12}>
                                        <EditarRecompensaComboForm/>
                                    </Col>
                                </>
                            )}
                        </Row>

                        <Drawer
                            title="Editar Recompensa de Producto"
                            width={360}
                            onClose={onClose}
                            visible={visible}
                            bodyStyle={{ paddingBottom: 80 }}
                        >
                            <Form form={form} onFinish={handleSave} layout="vertical">
                                <Form.Item label="Puntos" name="puntos_recompensa_producto">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Estado" name="sestado" valuePropName="checked">
                                    <Checkbox />
                                </Form.Item>
                                <Button key="submit" type="primary" htmlType="submit">
                                    Guardar
                                </Button>
                            </Form>
                        </Drawer>
                    </div>
                );
            })}
        </div>
    );
};

export default EditarRecompensaProductoForm;
