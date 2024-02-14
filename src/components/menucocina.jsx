import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Input, Segmented, Avatar, Card, Divider, Watermark } from 'antd';
import { Container, Row, Col, Button, Form, Nav, Navbar, NavDropdown, Dropdown, Offcanvas } from 'react-bootstrap';
import TipoProducto from './cocina/tipoproducto';
import CategoriaCocina from './cocina/categoria';

const MenuCocina = () => {
    const [empresaInfo, setEmpresaInfo] = useState(null);
    const [optionSucursales, setOptions] = useState([]);
    const [Sucursalesdata, setSucursalesData] = useState([]);
    const [selectedSucursal, setSelectedSucursal] = useState([]);

    const handleSucuralChange = (value) => {

        setSelectedSucursal(value);
    };

    const obtenerInformacionEmpresa = async () => {
        try {
            const respuesta = await fetch('https://projectdjangobakfebrero-production.up.railway.app/empresa/infoEmpresa/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            const datos = await respuesta.json();
            setEmpresaInfo(datos.empresa_info);
            fetch('https://projectdjangobakfebrero-production.up.railway.app/sucursal/sucusarleslist/')
                .then((response) => response.json())
                .then((data) => {
                    setSucursalesData(data.sucursales);
                    if (data.sucursales && data.sucursales.length > 0) {
                        const allSucursalesOptions = data.sucursales.map((sucursal) => ({
                            value: sucursal.id_sucursal,
                            label: sucursal.snombre,
                        }));
                        setOptions(allSucursalesOptions);
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener los datos de sucursales:', error);
                });
        } catch (error) {
            console.error('Error al obtener la información de la empresa:', error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/Login/rol/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem('token'), // Obtener el token almacenado
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const rol = data.rol;

                    // Puedes realizar acciones con el rol recibido si es necesario

                    // Ejemplo de redirección basada en el rol
                    if (rol !== 'S' && rol !== 'X') {
                        window.location.href = '/';
                    }
                    obtenerInformacionEmpresa();
                } else {
                    window.location.href = '/';
                }
            } catch (error) {
                // Manejar errores de la solicitud
                console.error('Error en la solicitud:', error);
            }
        };

        // Llamar a la función fetchData al cargar el componente
        fetchData();
    }, []); // Dependencia vacía para que se ejecute solo una vez al montar el componente
    const handleClearLocalStorage = () => {
        // Limpiar todo el localStorage
        window.location.href = '/';
        localStorage.clear();

        console.log('LocalStorage limpiado.');
    };

    const openNewWindow = () => {
        window.open('/Comandas', '_blank');
    };



    return (
        <>
            <div style={{ backgroundColor: '#DBE3E3', padding: '0.5%', height: '100%' }}>
                <Navbar expand="lg" style={{ backgroundColor: '#4CAF50', color: '#fff', borderRadius: '10px' }}>
                    <Container fluid>
                        <Navbar.Brand href="/cocina">
                            {empresaInfo && empresaInfo.elogo && (
                                <img src={`data:image/png;base64,${empresaInfo.elogo}`} width={50} style={{ borderRadius: '50%' }} />
                            )}
                            <strong style={{ fontWeight: 'bold', fontSize: '15px' }}>      CONTROL COCINA</strong>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                            </Nav>
                            <Form className="d-flex">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                        <strong style={{ fontWeight: 'bold', fontSize: '10.5px' }}> Perfil</strong>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1" onClick={handleClearLocalStorage}>Salir</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Row>
                    <Col md={12}>
                        <Card
                            hoverable
                            style={{ height: '96%', width: '100%', margin: '16px', marginLeft: '2px', marginBottom: '16px', cursor: 'default' }}
                            className="text-center"
                        >
                            <Button type="primary" onClick={openNewWindow}>
                                Ver comandas
                            </Button>
                            <Divider>Productos y artículos</Divider>
                            <Col md={12}>
                                <Col md={12} style={{ padding: '1%' }}>
                                    <Input
                                        style={{
                                            padding: '1%',
                                            borderRadius: '20px', // Puedes ajustar el valor según tu preferencia
                                            paddingRight: '30px', // Espacio para la lupa
                                        }}
                                        placeholder="Buscar producto o artículo"
                                    />
                                </Col>
                                <Col md={12}>
                                    <Row>
                                        <Col md={12}>
                                            <Segmented options={optionSucursales}
                                                value={selectedSucursal}
                                                onChange={handleSucuralChange}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={12}>
                                    <Row>
                                        <Col md={12}>
                                            <Divider>Tipos de productos</Divider>
                                            <TipoProducto></TipoProducto>
                                        </Col>
                                        <Col md={12}>

                                        </Col>
                                    </Row>
                                </Col>
                            </Col>
                        </Card>
                    </Col>

                </Row>

            </div >
        </>
    );
};

export default MenuCocina;