import React, { useState, useEffect } from "react";
import { Modal, Button, notification, Select, Input, DatePicker, message, Card } from "antd";
import { Row, Col } from 'react-bootstrap';
import ConfigPagos from "./configpagos";
import moment from 'moment';

const { Option } = Select;

const PagosE = ({ }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const [pagos, setPagos] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [tipoActual, setTipoActual] = useState(null);
    const [tipoPagos, setTipoPagos] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);


    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        tipoPagData();
        setModalVisible(false);
    };
    const handleOpenModal2 = (employee) => {
        tipoPagData();
        setSelectedEmployee(employee);
        setModalVisible2(true);
        setTipoActual(null);
        tipoPagos.forEach((item) => {
            console.log('Tipo de empleado:' + employee.tipo);
            console.log('rol de item: ' + item.rol);
            if (employee.tipo == item.rol) {
                console.log('Tipo de pago: ' + item.tipo_pago);
                setTipoActual(item.tipo_pago);
            }
        })
        console.log(employee.tipo);
    };

    const handleCloseModal2 = () => {
        setModalVisible2(false);
    };

    const handleSaveConfig = () => {
        // Lógica para guardar la configuración de pagos
        message.success("Configuración de pagos guardada con éxito");
        handleCloseModal();
    };

    useEffect(() => {
        tipoPagData();
    }, []);
    const tipoPagData = async () => {
        try {
            const response = await fetch("projectdjangobakfebrero-production.up.railway.app/pagos/tipodepagos/");
            if (response.ok) {
                const result = await response.json();
                setTipoPagos(result.tipopagos);
            } else {
                console.error("Error al cargar los datos");
            }
        } catch (error) {
            console.error("Error al procesar la solicitud", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("projectdjangobakfebrero-production.up.railway.app/empleado/listar-empleados2/0/");
                if (response.ok) {
                    const result = await response.json();
                    setEmpleados(result.empleados);
                    console.log(result);
                } else {
                    console.error("Error al cargar los datos");
                }
            } catch (error) {
                console.error("Error al procesar la solicitud", error);
            }
        };

        fetchData();
        pagosAct();
    }, []);
    const pagosAct = async () => {
        try {
            const response = await fetch("projectdjangobakfebrero-production.up.railway.app/pagos/ConsultarPagos/");
            if (response.ok) {
                const result = await response.json();
                setPagos(result.pagos);
                console.log(result);
            } else {
                console.error("Error al cargar los datos");
            }
        } catch (error) {
            console.error("Error al procesar la solicitud", error);
        }
    };


    const handleSavePayment = async () => {
        try {
            // Construir el objeto FormData con los datos necesarios
            const formData = new FormData();
            formData.append('id_empleado', selectedEmployee.id);
            formData.append('fecha_inicio', fechaInicio);
            formData.append('fecha_fin', fechaFin);
            formData.append('rol', selectedEmployee.tipo);

            // Realizar la solicitud POST a la API Django con fetch
            const response = await fetch('projectdjangobakfebrero-production.up.railway.app/pagos/CrearPago/', {
                method: 'POST',
                body: formData,
            });

            // Verificar la respuesta de la API
            if (response.ok) {
                message.success('Pago creado con éxito');
                pagosAct();
                handleCloseModal2(); // Cerrar el modal después de un pago exitoso
            } else {
                const errorData = await response.json();
                notification.error({
                    message: errorData.error || 'Error al crear el pago',
                    description: 'Hubo un problema al enviar los datos al servidor.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error al procesar la solicitud',
                description: 'Hubo un problema al enviar los datos al servidor.',
            });
        }
    };
    const getRolByTipo = (tipo) => {
        switch (tipo) {
            case 'X':
                return 'Jefe de cocina';
            case 'M':
                return 'Mesero';
            case 'D':
                return 'Motorizado';
            default:
                return 'Desconocido';
        }
    };

    return (
        <>
            <Row>
                <Col md={11}></Col>
                <Col md={1}>
                    <Button
                        type="primary"
                        onClick={handleOpenModal}
                    >
                        Configurar Pagos
                    </Button>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md={12}>
                    <Card
                        hoverable
                        className="text-center"
                        style={{ border: '1px solid' }}
                    >

                        <Row>

                            <Col md={2} style={{ borderRight: '1px solid' }}>

                                <p>Fecha</p>
                                <Row>
                                    <Col md={4}>Desde:</Col>
                                    <Col md={8}><DatePicker /></Col>
                                </Row>
                                <Row>
                                    <Col md={4}>Hasta:</Col>
                                    <Col md={8}><DatePicker /></Col>
                                </Row>
                            </Col>
                            <Col md={2} style={{ borderRight: '1px solid' }}>

                                <p>Trabajador</p>
                                <Row>
                                    <Col md={12}>
                                        <Input
                                            style={{ width: "100%" }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={2} style={{ borderRight: '1px solid' }}>

                                <p>Estado</p>
                                <Row>
                                    <Col md={12}>
                                        <Select defaultValue={"Sin pagar"}>
                                            <Option value="s">Sin pagar</Option>
                                            <Option value="p">Pagados</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={2} style={{ borderRight: '1px solid' }}>

                                <p>Tipo de pago</p>
                                <Row>
                                    <Col md={12}>
                                        <Select defaultValue={"S"}>
                                            <Option value="H">Pago por horas</Option>
                                            <Option value="S">Pago semanal</Option>
                                            <Option value="M">Pago mensual</Option>
                                            <Option value="T">Pago trimestral</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md={12}>
                    <Card
                        hoverable
                        className="text-center"
                        style={{ border: '1px solid' }}
                    >
                        <table style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>N</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Trabajador</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Rol</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Sucursal</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {empleados.map((empleado) => (
                                    <tr>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{empleado.id}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{empleado.nombre} {empleado.apellido}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{getRolByTipo(empleado.tipo)}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{empleado.sucursal ? empleado.sucursal : 'N/A'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>
                                            <Button
                                                type="primary"
                                                onClick={() => handleOpenModal2(empleado)}
                                            >
                                                Registrar Pagos
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </Card>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md={12}>
                    <Card
                        hoverable
                        className="text-center"
                        style={{ border: '1px solid' }}
                    >
                        <table style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>N</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Fecha Pago</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Trabajador</th>
                                    <th style={{ border: '1px solid #ddd', padding: '4px' }}>Pagado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagos.map((pago, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{pago.id_pago}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{pago.horadepago}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>
                                            {empleados.find(empleado => empleado.id === pago.idempleado) && (
                                                <span>
                                                    {empleados.find(empleado => empleado.id === pago.idempleado).nombre}{' '}
                                                    {empleados.find(empleado => empleado.id === pago.idempleado).apellido}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '4px' }}>{pago.cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </Card>
                </Col>
            </Row>
            {/* Modal para la configuración de pagos */}
            <Modal
                title="Configura los pagos"
                visible={modalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                <ConfigPagos />

            </Modal>
            <Modal
                title="Agregar pago"
                visible={modalVisible2}
                onCancel={handleCloseModal2}
                footer={null}
            >
                {selectedEmployee && (
                    <div>
                        <p>Empleado Seleccionado: {selectedEmployee.nombre} {selectedEmployee.apellido}</p>
                        <p>Selecciona {tipoActual === 'S' ? 'semana' : (tipoActual === 'T' ? 'el trimestre' : (tipoActual === 'M' ? 'el mes' : ''))}</p>
                        <Row><Col md={6}>
                            {tipoActual == 'S' && (
                                <DatePicker picker="week" onChange={(date, dateString) => {
                                    // date representa la fecha seleccionada y dateString la representación en cadena de la fecha
                                    // Aquí puedes procesar y almacenar la fecha de inicio y fin de la semana
                                    // Por ejemplo, supongamos que deseas almacenar el inicio y fin del lunes al domingo de la semana seleccionada
                                    console.log('La fecha es ' + date);
                                    const fecha = new Date(date);
                                    const fechaInicio = new Date(date);
                                    fechaInicio.setDate(fechaInicio.getDate() - fechaInicio.getDay()); // Establecer al primer día de la semana
                                    const fechaFin = new Date(date);
                                    fechaFin.setDate(fechaFin.getDate() - fechaFin.getDay() + 6); // Establecer al último día de la semana
                                    console.log(fechaInicio); // Fecha de inicio de la semana
                                    console.log(fechaFin); // Fecha de fin de la semana
                                    setFechaInicio(fechaInicio.toLocaleDateString('en-US'));
                                    setFechaFin(fechaFin.toLocaleDateString('en-US'));
                                }}></DatePicker>
                            )}
                            {tipoActual == 'T' && (
                                <DatePicker picker="quarter" onChange={(date, dateString) => {
                                    // date representa la fecha seleccionada y dateString la representación en cadena de la fecha
                                    // Aquí puedes procesar y almacenar la fecha de inicio y fin del trimestre
                                    const fecha = new Date(date);
                                    const trimestre = Math.floor((fecha.getMonth() + 3) / 3); // Obtener el trimestre actual

                                    const primerDiaTrimestre = new Date(fecha.getFullYear(), (trimestre - 1) * 3, 1); // Primer día del trimestre
                                    const ultimoDiaTrimestre = new Date(fecha.getFullYear(), trimestre * 3, 0); // Último día del trimestre

                                    console.log(primerDiaTrimestre); // Fecha de inicio del trimestre
                                    console.log(ultimoDiaTrimestre); // Fecha de fin del trimestre

                                    setFechaInicio(primerDiaTrimestre.toLocaleDateString('en-US'));
                                    setFechaFin(ultimoDiaTrimestre.toLocaleDateString('en-US'));
                                }} />
                            )}
                            {tipoActual == 'M' && (
                                <DatePicker picker="month" onChange={(date, dateString) => {
                                    // date representa la fecha seleccionada y dateString la representación en cadena de la fecha
                                    // Aquí puedes procesar y almacenar la fecha de inicio y fin del mes
                                    const fecha = new Date(date);
                                    const primerDiaMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1); // Primer día del mes
                                    const ultimoDiaMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0); // Último día del mes

                                    console.log(primerDiaMes); // Fecha de inicio del mes
                                    console.log(ultimoDiaMes); // Fecha de fin del mes

                                    setFechaInicio(primerDiaMes.toLocaleDateString('en-US'));
                                    setFechaFin(ultimoDiaMes.toLocaleDateString('en-US'));
                                }} />
                            )}
                        </Col>
                            <Col md={6}>
                                <Button
                                    type="primary"
                                    onClick={handleSavePayment}
                                >
                                    Registrar pago
                                </Button>
                            </Col>
                        </Row>
                    </div>

                )}
            </Modal>
        </>
    );
};

export default PagosE;
