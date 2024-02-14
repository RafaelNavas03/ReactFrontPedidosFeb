import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Modal, Form, Input, Button, Select, Badge, Drawer } from 'antd';

const EditarEmpleado = ({ idsucur, oficio }) => {
    const [sucursales, setSucursales] = useState([]);
    const [empleados, setEmpleados] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editedEmpleado, setEditedEmpleado] = useState(null);
    const [form] = Form.useForm();
    const [opene, setOpene] = useState(false);

    const showDrawere = (empleado) => {
        setOpene(true);
        setEditedEmpleado(empleado);
        form.setFieldsValue({
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            telefono: empleado.telefono,
            sucursales: empleado.sucursal,
        });
    };

    const onClosee = () => {
        fetchDataEmpleados();
        setOpene(false);
    };


    useEffect(() => {
        console.log('llegó: ' + idsucur)
        

        fetchDataEmpleados();


    }, [idsucur]);

    const fetchDataEmpleados = async () => {
        try {

            if (!idsucur) {
                idsucur = 0;
            }
            const responseEmpleados = await fetch('projectdjangobakfebrero-production.up.railway.app/empleado/listar-empleados/' + idsucur + '/');

            if (!responseEmpleados.ok) {
                throw new Error('Error fetching empleados');
            }
            const dataEmpleados = await responseEmpleados.json();
            setEmpleados(dataEmpleados.empleados);

        } catch (error) {
            console.error('Error fetching empleados:', error);
        }

        try {
            const responseSucursales = await fetch('projectdjangobakfebrero-production.up.railway.app/sucursal/sucusarleslist/');
            if (!responseSucursales.ok) {
                throw new Error('Error fetching sucursales');
            }
            const dataSucursales = await responseSucursales.json();
            const sucursales = dataSucursales.sucursales || [];
            setSucursales(sucursales);
        } catch (error) {
            console.error('Error fetching sucursales:', error);
        }
    };

    const handleEditClick = (empleado) => {
        console.log('Empleado seleccionado para editar:', empleado);

        setEditedEmpleado(empleado);
        form.setFieldsValue({
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            telefono: empleado.telefono,
            sucursales: empleado.sucursal,
        });
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleSave = async () => {
        try {
            console.log('Valores antes de la solicitud POST:');
            console.log('Tipo de empleado:', 'X');
            console.log('ID del empleado:', editedEmpleado.id);
            console.log('Datos del formulario:', form.getFieldsValue());

            const response = await fetch('projectdjangobakfebrero-production.up.railway.app/empleado/editar-empleado/' + editedEmpleado.tipo + '/' + editedEmpleado.id + '/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.getFieldsValue()),
            });

            if (!response.ok) {
                throw new Error('Error updating empleado');
            }
            form.resetFields();
            setVisible(false);
            const fetchData = async () => {
                try {
                    if (!idsucur) {
                        idsucur = 0;
                    }
                    const responseEmpleados = await fetch('projectdjangobakfebrero-production.up.railway.app/empleado/listar-empleados/' + idsucur + '/');

                    if (!responseEmpleados.ok) {
                        throw new Error('Error fetching empleados');
                    }
                    const dataEmpleados = await responseEmpleados.json();
                    setEmpleados(dataEmpleados.empleados);
                } catch (error) {
                    console.error('Error fetching empleados:', error);
                }
            };

            fetchDataEmpleados();
        } catch (error) {
            console.error('Error updating empleado:', error);
        }
    };

    if (!empleados) {
        return <div>Cargando...</div>;
    }
    const getSucursalNombre = (idSucursal) => {
        const sucursal = sucursales.find((sucursal) => sucursal.id_sucursal === idSucursal);
        return sucursal ? sucursal.snombre : '';
    };




    return (
        <div>
            {Object.keys(empleados).map((tipoEmpleado, index) => (
                tipoEmpleado === oficio && (
                    <Card key={index} title={tipoEmpleado} style={{ margin: '16px 0' }}>
                        <Row gutter={16}>
                            {empleados[tipoEmpleado].map((empleado, i) => (
                                <Col md={8} key={i}>
                                    <Card onClick={() => showDrawere(empleado)}>
                                        <Card.Meta
                                            avatar={<Avatar>{empleado.nombre[0]}</Avatar>}
                                            id={`id: ${empleado.id}`}
                                            tipo={`tipo: ${empleado.tipo}`}
                                            sucursal={`sucursal: ${empleado.sucursal}`}
                                            title={`${empleado.nombre} ${empleado.apellido}`}
                                            description={`Teléfono: ${empleado.telefono}`}
                                        />
                                        <br />
                                        <Badge count={getSucursalNombre(empleado.sucursal)} showZero color='#CE6F04' />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                )
            ))}
            <Drawer
                title="Editar empleado"
                width={720}
                onClose={onClosee}
                open={opene}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <Form form={form} onFinish={handleSave} layout="vertical">
                    <Form.Item label="Nombre" name="nombre">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Apellido" name="apellido">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Teléfono" name="telefono">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Sucursales" name="sucursales">
                        <Select>
                            {sucursales.map((sucursal) => (
                                <Select.Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                    {sucursal.snombre}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Button key="submit" type="primary" htmlType="submit">
                        Guardar
                    </Button>
                </Form>
            </Drawer>
        </div>
    );
};

export default EditarEmpleado;
