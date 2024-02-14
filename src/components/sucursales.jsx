import React, { useState, useEffect } from 'react';
import { UserOutlined, CloseOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Modal, message, Switch, Watermark, Tooltip, Result, Drawer } from 'antd';
import { Row, Col } from 'react-bootstrap';
import CrearSucursal from './crearsucursal';
import mapa from './res/mapa.png';
import MapaActual from './mapaactual';
import Mapafijo from './mapafijo';
import AdminSucursal from './adminsucursal'

const Sucursales = () => {
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [sucursalesData, setSucursalesData] = useState([]);
    const [ubicacionVisible, setUbicacionVisible] = useState(false);
    const [ubicacionAltitud, setUbicacionAltitud] = useState(null);
    const [ubicacionLongitud, setUbicacionLongitud] = useState(null);
    const [currentSucursal, setCurrentSucursal] = useState(null);
    const [currentPage, setCurrentPage] = useState('sucursal');
    const [opens, setOpens] = useState(false);

    const showDrawers = () => {
        setOpens(true);
    };

    const onCloses = () => {
        setOpens(false);
        fetchData();
    };

    const handleCardClick = (page, ids) => () => {
        setCurrentPage(page);
        setCurrentSucursal(ids);
    };

    const handleAtrasClick = () => {
        setCurrentPage('sucursal');
        fetchData();
    };

    const handleUbicacionCancel = () => {
        setUbicacionVisible(false);
    };

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize]);

    const fetchData = () => {
        setLoading(true);
        setCurrentPage('sucursal');
        setSucursalesData([]);

        const { current, pageSize } = pagination;
        const url = `https://projectdjangobakfebrero-production.up.railway.app/sucursal/sucusarleslist/?page=${current}&pageSize=${pageSize}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setSucursalesData(data.sucursales);
                setLoading(false);
                setPagination({
                    ...pagination,
                    total: data.total, // Total de filas sin paginación
                });
            })
            .catch((error) => {
                console.error('Error al obtener los datos de sucursales:', error);
                setLoading(false);
            });
    };

    const handleSwitchChange = (checked, record) => {
        console.log(
            `Switch cambiado para la sucursal ${record.id_sucursal}. Nuevo estado: ${checked}`
        );
        const formData = new FormData();
        formData.append('id_sucursal', record.id_sucursal);
        formData.append('sestado', checked ? '1' : '0');
        fetch('https://projectdjangobakfebrero-production.up.railway.app/sucursal/actsucursal/', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                console.log('Respuesta completa de la API:', response);
                return response.json();
            })
            .then((data) => {
                fetchData();
                message.success('Actualizando...');
                console.log('Respuesta de la API:', data);
            })
            .catch((error) => {
                console.error('Error al enviar la solicitud POST:', error);
            });
    };

    const handleSaveUbicacion = (latitud, longitud) => {
        if (!currentSucursal) {
            message.error('Error: No se pudo recoger la sucursal');
            return;
        }
        Modal.confirm({
            title: 'Confirmar',
            content: '¿Estás seguro de que deseas actualizar la ubicación de esta sucursal?',
            onOk() {
                const formData = new FormData();
                formData.append('id_sucursal', currentSucursal);
                formData.append('latitud', latitud);
                formData.append('longitud', longitud);

                fetch('https://projectdjangobakfebrero-production.up.railway.app/sucursal/editarubicacion/', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => {
                        fetchData();
                        handleUbicacionCancel();
                        message.success('Ubicación actualizada con éxito');
                        console.log('Respuesta de la API:', data);
                    })
                    .catch(error => {
                        console.error('Error al enviar la solicitud POST:', error);
                        message.error('Error al actualizar la ubicación')
                    });
            },
            onCancel() {
                message.success('Actualización de ubicación cancelada');
            },
        });
    };


    return (
        <>
            {currentPage === 'sucursal' && (
                <div>
                    <Button type="primary" style={{ width: '100%' }} onClick={showDrawers}>
                        Crear Nueva Sucursal
                    </Button>
                    {sucursalesData.length ? (
                        <Row>
                            {sucursalesData.map(sucursal => (
                                <Col key={sucursal.id_sucursal} xs={24} sm={12} md={3} lg={3}>
                                    <Card
                                        hoverable
                                        title={sucursal.snombre}
                                        style={{
                                            width: '100%', backgroundColor: '#CAF0EF', border: '1px solid #A4A4A4', marginTop: '5%',
                                            height: '92%', margin: '16px', marginLeft: '1px',
                                        }}
                                        cover={
                                            sucursal.id_ubicacion.longitud ? (
                                                <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                                                    <Mapafijo
                                                        latitud={sucursal.id_ubicacion.latitud}
                                                        longitud={sucursal.id_ubicacion.longitud}
                                                        idm={sucursal.id_sucursal}
                                                    />
                                                </div>
                                            ) : (
                                                <Watermark content={[sucursal.snombre, 'Sin ubicación']}>
                                                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', backgroundColor: '#ffff', borderLeft: '1px solid  #A4A4A4', borderRight: ' 1px solid  #A4A4A4' }} />
                                                </Watermark>
                                            )
                                        }
                                        onClick={handleCardClick('editar', sucursal.id_sucursal)}
                                    >
                                        <strong style={{ fontWeight: 'bold', fontSize: '10.5px' }}>Dirección:</strong> {sucursal.sdireccion}
                                        <Row align="right">
                                            <strong style={{ fontWeight: 'bold', fontSize: '10.5px' }}>Estado:</strong>
                                            <Col md={12}>
                                                <Tooltip title={sucursal.sestado === '1' ? 'Desactivar Sucursal' : 'Activar Sucursal'}>
                                                    <Switch
                                                        defaultChecked={sucursal.sestado === '1'}
                                                        checked={sucursal.sestado === '1'}
                                                        onChange={(checked) => handleSwitchChange(checked, sucursal)}
                                                    />
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                        <Row align="left">
                                            <br />
                                            <Col md={12}>
                                                <strong style={{ fontWeight: 'bold', fontSize: '10.5px' }}>Empleados: </strong>
                                                <Badge count={sucursal.cantidadempleados} showZero color='#06CE15' />
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) :
                        <Result
                            status="404"
                            title="Vacío"
                            subTitle="No tienes sucursales creadas."
 
                        />
                    }
                </div >
            )}
            {currentPage === 'editar' && (
                <div style={{ position: 'relative', marginBottom: '10px', border: '1px solid #A4A4A4', borderRadius: '1%', padding: '5%', margin: '1%' }}>
                    <Button
                        shape="circle"
                        icon={<CloseOutlined />}
                        size="small"
                        style={{ position: 'absolute', top: 0, right: 0, margin: '2%' }}
                        onClick={handleAtrasClick}
                    />
                    <AdminSucursal idsucursalx={currentSucursal} />
                </div>
            )}
            <br />
            <br />
            <Drawer
                title="Crear sucursal"
                width={720}
                onClose={onCloses}
                open={opens}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <CrearSucursal />
            </Drawer>
        </>

    );
};

export default Sucursales;
