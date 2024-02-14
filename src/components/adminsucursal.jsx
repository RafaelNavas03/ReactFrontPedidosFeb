import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Table, Select, Switch,message , notification, Modal, Upload, Card, Tooltip, Watermark, Badge, Tag, Divider, Drawer, Segmented, Avatar } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { UploadOutlined, EditFilled, UserOutlined } from '@ant-design/icons';
import MapaActual from './mapaactual';
import CrearHorariosSemanales from './crearhorarioS';
import TextArea from 'antd/es/input/TextArea';
import Mapafijo from './mapafijo';
import repartidor from './res/repartidor.png'
import administrador from './res/administrador.png'
import camarero from './res/camarero.png';
import cocinero from './res/cocinero.png';
import anadir from './res/anadir.png'
import EditarEmpleado from './EditarEmpleado';
import CrearEmpleadoForm from './crearempleado';

const { Option } = Select;

const AdminSucursal = ({ idsucursalx }) => {
    const [form] = Form.useForm();
    const [sucursalData, setSucursalData] = useState(null);
    const [ids, setID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [valorb, setvalor] = useState('Agregar horario');
    const [fileList, setFileList] = useState([]);
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const [mostrarComponenteB, setMostrarComponenteB] = useState(false);
    const [horarioDetails, setHorarioDetails] = useState([]);
    const [horario, sethorario] = useState('mostrar');
    const [idhorario, sethorarioid] = useState(null);
    const [openu, setOpenu] = useState(false);
    const [selectedOficio, setSelectedOficio] = useState('Administradores');
    const [opene, setOpene] = useState(false);

    const showDrawere = () => {
        setOpene(true);
    };

    const onClosee = () => {
        setSelectedOficio('Administradores');
        setOpene(false);
    };

    const handleOficioChange = (value) => {
        if (value == 'agregar') {
            showDrawere();
            return;
        }
        setSelectedOficio(value);
    };

    const showDraweru = () => {
        setOpenu(true);
    };

    const onCloseu = () => {
        setOpenu(false);
    };


    const editarSucursal = () => {
        if (horario == 'mostrar') {
            sethorario('editar')
        } else {
            sethorario('mostrar')
        }

    }

    const handleHorarioClick = () => {
        if (mostrarComponenteB) {
            setMostrarComponenteB(false);
            setvalor('Agregar horario')
        } else { setMostrarComponenteB(true); setvalor('Cancelar'); }

    };

    const editHorarioCreate = async (jsonHorario) => {
        try {
            const formDataObject = new FormData();
            formDataObject.append('detalle', JSON.stringify(jsonHorario));

            const response = await fetch('http://projectdjangobakfebrero-production.up.railway.app/horarios/edit/' + idhorario, {
                method: 'POST',
                body: formDataObject,
            });

            const responseData = await response.json();

            if (responseData.mensaje) {
                notification.success({
                    message: 'Éxito',
                    description: 'Horario editado exitosamente',
                });
                fetchData();
                handleHorarioClick();
                sethorario('mostrar');
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Error al editar el horario: ' + responseData.error,
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error al validar el formulario',
            });
        }
    };


    const handleHorarioCreate = async (jsonHorario) => {
        try {
            const formData = await form.validateFields();
            const { nombreh, hordescripcion } = formData;

            const formDataObject = new FormData();
            formDataObject.append('nombreh', 'horarioSucursal' + idsucursalx);
            formDataObject.append('detalle', JSON.stringify(jsonHorario));
            formDataObject.append('idsucursal', idsucursalx);

            const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/horarios/CrearHorarioSucursal/', {
                method: 'POST',
                body: formDataObject,
            });

            const responseData = await response.json();

            if (responseData.mensaje) {
                notification.success({
                    message: 'Éxito',
                    description: 'Horario creado exitosamente',
                });
                fetchData();
                handleHorarioClick();
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Error al crear el horario: ' + responseData.error,
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error al validar el formulario',
            });
        }
    };


    useEffect(() => {

        fetchData();
    }, [idsucursalx]);

    const fetchHorarioDetails = async (idHorario) => {
        try {
            console.log(idHorario);
            const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/horarios/get/' + idHorario);
            const data = await response.json();

            if (data.detalles) {
                console.log('Detalles' + data.detalles[0].dia);
                setHorarioDetails(data.detalles);
            }
        } catch (error) {
            notification.warning({
                message: 'No hay horario',
                description: 'No haz creado un horario de atención para tu sucursal',
            });
        }
    };


    const fetchData = async () => {
        try {
            const response = await fetch(`https://projectdjangobakfebrero-production.up.railway.app/sucursal/cargarSucursal/${idsucursalx}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const data = await response.json();
            if (data.mensaje && data.mensaje.length > 0) {

                setLoading(false);
                setSucursalData(data.mensaje[0]);

            } else {
                console.error('No se encontraron datos de la sucursal');
                setLoading(false);
            }
            fetchHorarioDetails(data.mensaje[0].id_horarios);
            sethorarioid(data.mensaje[0].id_horarios);

            setFileList([
                {
                    uid: '-1',
                    name: 'imagen',
                    status: 'done',
                    url: data.mensaje[0]?.imagensucursal
                        ? `data:image/png;base64,${data.mensaje[0].imagensucursal}`
                        : null,
                },
            ]);

            form.setFieldsValue(data.mensaje[0]);
        } catch (error) {
            console.error('Error al obtener los datos de la sucursal:', error);
            setLoading(false);
        }
    };

    const handleSwitchChange = (checked) => {
        const formData = new FormData();
        formData.append('id_sucursal', idsucursalx);
        formData.append('sestado', checked ? '1' : '0');

        fetch('https://projectdjangobakfebrero-production.up.railway.app/sucursal/actsucursal/', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                message.success('Actualizando...');
                console.log('Respuesta de la API:', data);
                fetchData();
            })
            .catch((error) => {
                console.error('Error al enviar la solicitud POST:', error);
            });
    };

    const handleGuardarClick = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            formData.append('id_sucursal', idsucursalx);
            formData.append('razonsocial', values.srazon_social);
            formData.append('sruc', values.sruc);
            formData.append('capacidad', values.scapacidad);
            formData.append('scorreo', values.scorreo);
            formData.append('ctelefono', values.stelefono);
            formData.append('sdireccion', values.sdireccion);
            formData.append('snombre', values.snombre);

            if (values.imagensucursal.fileList) {
                formData.append('imagensucursal', fileList[0].originFileObj);
            } else {
                console.error('Tipo de archivo no válido');
            }

            const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/sucursal/EditarSucursal/' + idsucursalx, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            notification.success({
                message: 'Éxito',
                description: data.mensaje,
            });

            fetchData();
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            notification.error({
                message: 'Error',
                description: 'Error al guardar los datos: ' + error.message,
            });
        }
    };

    const handleSaveUbicacion = async (latitud, longitud) => {
        Modal.confirm({
            title: 'Confirmar',
            content: '¿Estás seguro de que deseas actualizar la ubicación de esta sucursal?',
            onOk() {
                const formData = new FormData();

                formData.append('id_sucursal', idsucursalx);
                formData.append('latitud', latitud);
                formData.append('longitud', longitud);

                fetch('https://projectdjangobakfebrero-production.up.railway.app/sucursal/editarubicacion/', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => {
                        if (response.ok) {
                            notification.success({
                                message: 'Éxito',
                                description: 'Ubicación actualizada correctamente',
                            });
                            fetchData();
                        } else {
                            throw new Error('Error al editar la ubicación de la sucursal');
                        }
                    })
                    .catch(error => {
                        notification.error({
                            message: 'Error',
                            description: 'Error al editar la ubicación de la sucursal: ' + error.message,
                        });
                        console.error('Error al editar la ubicación de la sucursal', error);
                    });
            },
            onCancel() {
                notification.success({
                    message: 'Éxito',
                    description: 'Actualización de ubicación cancelada',
                });
            },
        });
    };
    const onFinish = (values) => {
        console.log('Valores del formulario:', values);
    };

    const renderFormItems = () => {
        if (loading) {
            return null;
        }

        return [
            {
                key: '1',
                Datos: 'Nombre*',
                Valor: <Form.Item name="snombre" rules={[
                    { max: 300, message: 'Maximo de caracteres' },
                    { required: true, message: 'Por favor, ingrese un nombre de sucursal' }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '2',
                Datos: 'Razón social*',
                Valor: <Form.Item name="srazon_social" rules={[{ required: true, message: 'Por favor, ingrese una razón social' },
                { max: 300, message: 'Maximo de caracteres' }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '3',
                Datos: 'Ruc*',
                Valor: <Form.Item name="sruc" rules={[{ required: true, message: 'Por favor, ingrese un RUC' },
                { max: 20, message: 'Maximo de caracteres' },
                {
                    pattern: /^[0-9]+$/,
                    message: 'Por favor, ingrese solo caracteres numéricos.',
                }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '4',
                Datos: 'Capacidad*',
                Valor: <Form.Item name="scapacidad" rules={[{ required: true, message: 'Por favor, seleccione una capacidad' },
                ]}>
                    <Select>
                        <Option value="P">Principal</Option>
                        <Option value="S">Secundaria</Option>
                    </Select>
                </Form.Item>,
            },
            {
                key: '5',
                Datos: 'Correo*',
                Valor: <Form.Item name="scorreo" rules={[{ required: true, message: 'Por favor, ingrese un correo' },
                { max: 300, message: 'Maximo de caracteres' }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '6',
                Datos: 'Telefono',
                Valor: <Form.Item name="stelefono" rules={[
                    { max: 300, message: 'Maximo de caracteres' },
                    {
                        pattern: /^[0-9]+$/,
                        message: 'Por favor, ingrese solo caracteres numéricos.',
                    }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '7',
                Datos: 'Direccion*',
                Valor: <Form.Item name="sdireccion" rules={[
                    { max: 300, message: 'Maximo de caracteres' },
                    { required: true, message: 'Por favor, ingrese una dirección' }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '8',
                Datos: 'Imagen*',
                Valor: <Form.Item name="imagensucursal" valuePropName="file">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={(file) => {
                            const isImage = /\.(png|jpg|jpeg)$/i.test(file.name);
                            if (isImage) {

                                return false;
                            }
                            return true;
                        }}
                        accept=".png, .jpg, .jpeg"
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                </Form.Item>,
            },
        ];
    };


    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Subir</div>
        </div>
    );

    const columns = [
        { dataIndex: 'Datos', key: 'Datos' },
        {

            dataIndex: 'Valor',
            key: 'Valor',
            render: (text) => <span>{text}</span>,
        },
    ];

    return (
        <>
            <Divider>{sucursalData && (sucursalData.snombre)}</Divider>
            <Row>
                <Col md={4}>
                    <Col xs={24} sm={12} md={12} lg={12}>
                        {sucursalData && (
                            <Card
                                hoverable
                                title={sucursalData.snombre}
                                style={{
                                    width: '100%', backgroundColor: '#CAF0EF', border: '1px solid #A4A4A4', marginTop: '5%',
                                    height: '100%',
                                    marginLeft: '1px',
                                }}
                                cover={
                                    sucursalData.id_ubicacion.longitud ? (
                                        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                                <>
                                                    <Mapafijo
                                                        latitud={sucursalData.id_ubicacion.latitud}
                                                        longitud={sucursalData.id_ubicacion.longitud}
                                                        idm={sucursalData.id_sucursal}
                                                    />
                                                    <Row align="right">
                                                        <Col md={12}>
                                                            <Tooltip title='Editar o agregar ubicación'>
                                                                <Button
                                                                    type="primary"
                                                                    icon={<EditFilled />}
                                                                    onClick={showDraweru}
                                                                >
                                                                </Button>
                                                            </Tooltip>
                                                        </Col>
                                                    </Row>
                                                </>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Watermark content={[sucursalData.snombre, 'Sin ubicación']}>
                                                <div style={{ width: '100%', height: '200px', overflow: 'hidden', backgroundColor: '#ffff', borderLeft: '1px solid  #A4A4A4', borderRight: ' 1px solid  #A4A4A4' }} />
                                            </Watermark>
                                            <Row align="right">
                                                <Col md={12}>
                                                    <Tooltip title='Editar o agregar ubicación'>
                                                        <Button
                                                            type="primary"
                                                            icon={<EditFilled />}
                                                            onClick={showDraweru}
                                                        >
                                                        </Button>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        </>
                                    )

                                }
                            >
                                <strong style={{ fontWeight: 'bold', fontSize: '10.5px' }}>Dirección:</strong> {sucursalData.sdireccion}
                                <Row align="right">
                                    <strong style={{ fontWeight: 'bold', fontSize: '10.5px' }}>Estado:</strong>
                                    <Col md={12}>
                                        <Tooltip title={sucursalData.sestado === '1' ? 'Desactivar Sucursal' : 'Activar Sucursal'}>
                                            <Switch
                                                defaultChecked={sucursalData.sestado === '1'}
                                                checked={sucursalData.sestado === '1'}
                                                onChange={(checked) => handleSwitchChange(checked, sucursalData.id_sucursal)}
                                            />
                                        </Tooltip>
                                    </Col>
                                </Row>
                                <Row align="left">
                                    <br />
                                    <Col md={12}>
                                        <strong style={{ fontWeight: 'bold', fontSize: '10.5px' }}>Empleados: </strong>
                                        <Badge count={sucursalData.cantidadempleados} showZero color='#06CE15' />
                                    </Col>
                                </Row>

                            </Card>
                        )}
                    </Col>
                </Col>
                <Drawer
                    title="Editar ubicación de la sucursal"
                    width={720}
                    onClose={onCloseu}
                    open={openu}
                    styles={{
                        body: {
                            paddingBottom: 80,
                        },
                    }}
                >
                    <Table
                        columns={[
                            { title: 'Ubicacion', dataIndex: 'Ubicacion', key: 'Ubicacion' },
                        ]}
                        dataSource={[
                            {
                                title: 'Ubicacion',
                                dataIndex: 'Ubicacion',
                                key: 'Ubicacion',
                                Ubicacion: sucursalData ? (
                                    <MapaActual
                                        latitud={sucursalData.id_ubicacion.latitud}
                                        longitud={sucursalData.id_ubicacion.longitud}
                                        onSaveCoordinates={handleSaveUbicacion}
                                    />
                                ) : (
                                    <div>
                                        <MapaActual
                                            onSaveCoordinates={handleSaveUbicacion}
                                        />
                                        <p>No hay ubicación agregada. Selecciona tu ubicación.</p>
                                    </div>
                                ),
                            },
                        ]}
                        pagination={false}
                        size="middle"
                        bordered
                    />
                </Drawer>
                <Col md={8}>
                    <div style={{ flex: 1, marginRight: '20px', padding: '2px' }}>
                        <Form form={form} name="adminSucursalForm" onFinish={onFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Table columns={columns} dataSource={renderFormItems()} pagination={false} size="middle" bordered />

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" onClick={handleGuardarClick}>
                                    Guardar
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Card
                        hoverable
                        title={'Horario de atención'}
                        style={{
                            width: '100%', border: '1px solid #A4A4A4', marginTop: '5%',
                            margin: '16px',
                            marginLeft: '1px',
                        }}
                        cover={
                            <div >
                                {horarioDetails.length > 0 && horario === 'mostrar' && (
                                    <div className="table-responsive">
                                        <table className="table table-bordered" style={{ border: '1px solid #A4A4A4', marginTop: '5%' }}>
                                            <thead>
                                                <tr>
                                                    <th scope="col">Domingo</th>
                                                    <th scope="col">Lunes</th>
                                                    <th scope="col">Martes</th>
                                                    <th scope="col">Miércoles</th>
                                                    <th scope="col">Jueves</th>
                                                    <th scope="col">Viernes</th>
                                                    <th scope="col">Sábado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"].map((dia, index) => (
                                                        <td key={index} className="text-left">
                                                            {horarioDetails.map((detalle) => {
                                                                if (detalle.dia === dia) {
                                                                    return (
                                                                        <>
                                                                            <Tag color={detalle.hora_inicio ? '#52c41a' : '#f5222d'}>
                                                                                {detalle.hora_inicio ? 'Abrir' : 'Cerrar'}
                                                                            </Tag>
                                                                            <br />
                                                                            <Tooltip title='Hora de apertura'>
                                                                                <label>{detalle.hora_inicio || "00:00"}</label>
                                                                            </Tooltip>
                                                                            <br />
                                                                            <Tag color={detalle.hora_fin ? '#f5222d' : '#52c41a'}>
                                                                                {detalle.hora_fin ? 'Cerrar' : 'Abrir'}
                                                                            </Tag>
                                                                            <br />
                                                                            <Tooltip title='Hora de cierre'>
                                                                                <label>{detalle.hora_fin || "00:00"}</label>
                                                                            </Tooltip>
                                                                            <br />
                                                                        </>

                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>)}
                                {horarioDetails.length == 0 && (
                                    <>

                                        <CrearHorariosSemanales onHorarioCreate={handleHorarioCreate} />
                                    </>
                                )}
                                {horarioDetails.length > 0 && horario === 'editar' && (
                                    <>

                                        <CrearHorariosSemanales detalles={horarioDetails} onHorarioCreate={editHorarioCreate} />
                                    </>
                                )}
                            </div>
                        }
                    >
                        <Row align="right">
                            <Col md={12}>
                                <Button
                                    type="primary"
                                    icon={<EditFilled />}
                                    onClick={(editarSucursal)}
                                >
                                </Button></Col>
                        </Row>

                    </Card>

                </Col>
                <Row>
                    <Col md={12}>
                        <Segmented
                            options={[
                                {
                                    label: (
                                        <Tooltip title="Administradores">
                                            <div style={{ padding: 4 }}>
                                                <Avatar style={{ backgroundColor: '#87d068' }} src={administrador} size="large" />
                                            </div>
                                        </Tooltip>
                                    ),
                                    value: 'Administradores',
                                },
                                {
                                    label: (
                                        <Tooltip title="Motorizados">
                                            <div style={{ padding: 4 }}>
                                                <Avatar style={{ backgroundColor: '#87d068' }} size="large" src={repartidor} />
                                            </div>
                                        </Tooltip>
                                    ),
                                    value: 'Motorizados',
                                },
                                {
                                    label: (
                                        <Tooltip title="Meseros">
                                            <div style={{ padding: 4 }}>
                                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size="large" src={camarero} />
                                            </div>
                                        </Tooltip>
                                    ),
                                    value: 'Meseros',
                                },
                                {
                                    label: (
                                        <Tooltip title="Jefes de cocina">
                                            <div style={{ padding: 4 }}>
                                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size="large" src={cocinero} />                                        </div>
                                        </Tooltip>
                                    ),
                                    value: 'JefesCocina',
                                },
                                {
                                    label: (
                                        <Tooltip title="Agregar empleados">
                                            <div style={{ padding: 4 }}>
                                                <Avatar style={{ backgroundColor: '#ffff' }} icon={<UserOutlined />} size="large" src={anadir} />                                        </div>
                                        </Tooltip>
                                    ),
                                    value: 'agregar',
                                },
                            ]}
                            value={selectedOficio}
                            onChange={handleOficioChange}
                        />
                    </Col>
                </Row>
                <EditarEmpleado idsucur={idsucursalx} oficio={selectedOficio}></EditarEmpleado>
            </Row>
            <Drawer
                title="Crear empleado"
                width={720}
                onClose={onClosee}
                open={opene}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <CrearEmpleadoForm></CrearEmpleadoForm>
            </Drawer>

        </>
    );
};

export default AdminSucursal;
