import React, { useState, useEffect } from 'react';
import { Form, Card, Input, Pagination, Button, Select, Modal, Upload, Tooltip, Badge, Segmented, Avatar, Checkbox, Drawer, Divider } from 'antd';
import { Row, Col } from 'react-bootstrap';
import imgproveedor from './res/proveedor.png';
import CrearProveedor from './crearproveedor';
import EditarProveedor from './editarproveedor';

const { Meta } = Card;

const Proveedores = () => {
    const [selectedOpcion, setSelectedOpcion] = useState('Proveedores');
    const [openp, setOpenp] = useState(false);
    const [proveedores, setProveedores] = useState([]);
    const [selectedProveedor, setSelectedProveedor] = useState(null);

    const Changueopcion = (value) => {
        setSelectedOpcion(value);
    }

    const showDrawerp = () => {
        setSelectedProveedor(null);
        setOpenp(true);
    };

    const onClosep = () => {
        setOpenp(false);
        fetchProveedores();
    };

    const handleEditarProveedor = (proveedor) => {
        setSelectedProveedor(proveedor);
        setOpenp(true);
    };


    useEffect(() => {
        if (selectedOpcion === 'Proveedores') {
            fetchProveedores();
        }
    }, [selectedOpcion]);

    const fetchProveedores = async () => {
        try {
            const response = await fetch('projectdjangobakfebrero-production.up.railway.app/Proveedores/listar_proveedor/');
            const data = await response.json();
            setProveedores(data.proveedores);
        } catch (error) {
            console.error('Error fetching proveedores:', error);
        }
    };

    return (
        <div>
            <Row>
                <Col md={12}>
                    <Segmented
                        options={[
                            {
                                label: (
                                    <Tooltip title="Proveedores">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={imgproveedor} size="large" />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'Proveedores',
                            }
                        ]}
                        value={selectedOpcion}
                        onChange={Changueopcion}
                    />
                </Col>
                {selectedOpcion === 'Proveedores' && (
                    <>
                        <Divider>Control Proveedores</Divider>
                        <Col md={12}>
                            <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawerp}>
                                Crear nuevo proveedor
                            </Button>
                        </Col>
                        <Col md={12}>
                            {proveedores.map((proveedor, index) => (
                                <Card key={index} onClick={() => handleEditarProveedor(proveedor)}>
                                    <Meta title={proveedor.nombreproveedor} description={proveedor.direccionproveedor} />
                                </Card>
                            ))}
                        </Col>
                    </>)}
            </Row>
            <Drawer
                title={selectedProveedor ? `Editar proveedor: ${selectedProveedor.nombreproveedor}` : 'Crear proveedor'}
                width={720}
                onClose={onClosep}
                open={openp}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                {selectedProveedor ? (
                    <EditarProveedor
                        initialValues={selectedProveedor}
                        onFinish={(editedValues) => {
                            console.log('Proveedor editado:', editedValues);
                            onClosep();
                        }}
                        onCancel={onClosep}
                    />
                ) : (
                    <CrearProveedor
                        onFinish={(createdValues) => {
                            console.log('Proveedor creado:', createdValues);
                            onClosep(); 
                        }}
                    />
                )}
            </Drawer>

        </div>
    );
};

export default Proveedores;
