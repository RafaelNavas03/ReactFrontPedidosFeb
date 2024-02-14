import React, { useState, useEffect } from 'react';
import { Form, Card, Input, Pagination, Button, Select, Modal, Upload, Tooltip, Badge, Segmented, Avatar, Checkbox, Drawer, Divider } from 'antd';
import { Row, Col } from 'react-bootstrap';
import imgcombos from './res/imgcombos.png';
import CrearBodegaForm from './crearbodega';
import EditarBodegaForm from './editarbodega';

const { Meta } = Card;

const Bodegas = () => {
    const [selectedOpcion, setSelectedOpcion] = useState('Bodegas');
    const [openp, setOpenp] = useState(false);
    const [bodegas, setBodegas] = useState([]);
    const [selectedBodega, setSelectedBodega] = useState(null);

    const Changueopcion = (value) => {
        setSelectedOpcion(value);
    }

    const showDrawerp = () => {
        setOpenp(true);
    };
    
    const onClosep = () => {
        setOpenp(false);
    };

    const handleEditarBodega = (bodega) => {
        setSelectedBodega(bodega);
        setOpenp(true);
    };

    useEffect(() => {
        if (selectedOpcion === 'Bodegas') {
            fetchBodegas();
        }
    }, [selectedOpcion]);

    const fetchBodegas = async () => {
        try {
            const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/bodega/listar/');
            const data = await response.json();
            setBodegas(data.bodegas);
        } catch (error) {
            console.error('Error fetching bodegas:', error);
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
                                    <Tooltip title="Bodegas">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={imgcombos} size="large" />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'Bodegas',
                            }
                        ]}
                        value={selectedOpcion}
                        onChange={Changueopcion}
                    />
                </Col>
                {selectedOpcion === 'Bodegas' && (
                    <>
                        <Divider>Control Bodegas</Divider>
                        <Col md={12}>
                            <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawerp}>
                                Crear nueva bodega
                            </Button>
                        </Col>
                        <Col md={12}>
                            {bodegas.map((bodega, index) => (
                                <Card key={index} onClick={() => handleEditarBodega(bodega)}>
                                    <Meta title={bodega.nombrebog} description={bodega.descripcion} />
                                </Card>
                            ))}
                        </Col>
                    </>)}
            </Row>
            <Drawer
                title={selectedBodega ? `Editar bodega: ${selectedBodega.nombrebog}` : 'Crear bodega'}
                width={720}
                onClose={onClosep}
                open={openp}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                {selectedBodega ? (
                    <EditarBodegaForm bodega={selectedBodega} />
                ) : (
                    <CrearBodegaForm />
                )}
            </Drawer>
        </div>
    );
};

export default Bodegas;
