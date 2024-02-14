import React, { useState, useEffect } from 'react';
import { Form, Card, Input, Pagination, Button, Select, Modal, Upload, Tooltip, Badge, Tag, Segmented, Avatar, Checkbox, Popover, notification, Drawer, Divider, Watermark, message } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { UploadOutlined, CalendarTwoTone, EditFilled, EyeOutlined } from '@ant-design/icons';
import imgproductos from './res/imgproductos.png';
import categoriaproducto from './res/categoriaproducto.png';
import tipoproducto from './res/tipoproducto.png'
import um from './res/um.png'
import CrearProducto from './CrearProducto';
import EditarTipoProducto from './editartipoproducto'
import EditarCategoria from './editarcategoria';
import EditarUnidadesMedida from './editarunidadmedida';
import CrearHorariosSemanales from './crearhorarioS';
import articulo from './res/articulos.png'
import EditarComponenteForm from './EditarComponente'
import ListProductos from '../Clientes/ListaProductos';

const { Meta } = Card;
const { Option } = Select;

const EditarProducto = () => {
    const [productos, setProductos] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [umList, setUmList] = useState([]);
    const [categoriaList, setCategoriaList] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState(null);
    const [form] = Form.useForm();
    const [openp, setOpenp] = useState(false);
    const [selectedOpcion, setSelectedOpcion] = useState('Productos');
    const [openH, setOpenH] = useState(false);
    const [SucursalesData, setSucursalesData] = useState(null);
    const [optionSucursales, setOptions] = useState([]);
    const [optionSucursales2, setOptions2] = useState([]);
    const [selectedSucursal, setSucursal] = useState([null]);
    const [selectedProducto, setProducto] = useState([null]);
    const [horarioDetails, setHorarioDetails] = useState([]);
    useEffect(() => {
        fetchSucursal();
    }, []);

    const handleProductoChange = (value) => {

        setSucursal(value);
        setHorarioDetails("");
        if (selectedProducto.horarios.length > 0) {
            const selectedHorario = selectedProducto.horarios.find(horario => horario.id_sucursal === value);
            if (selectedHorario) {
                fetchHorarioDetails(selectedHorario.id_horarios);
            }
        }
    };


    const fetchSucursal = () => {
        setSucursalesData([]);
        const url = `https://projectdjangobakfebrero-production.up.railway.app/sucursal/sucusarleslist/`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setSucursalesData(data.sucursales);

            })
            .catch((error) => {
                console.error('Error al obtener los datos de sucursales:', error);
            });
    };

    const editHorarioCreate = async (jsonHorario) => {
        try {
            if (selectedProducto.horarios.length > 0) {
                const selectedHorario = selectedProducto.horarios.find(horario => horario.id_sucursal === selectedSucursal);
                if (selectedHorario) {
                    const formDataObject = new FormData();
                    formDataObject.append('detalle', JSON.stringify(jsonHorario));

                    const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/horarios/edit/' + selectedHorario.id_horarios, {
                        method: 'POST',
                        body: formDataObject,
                    });

                    const responseData = await response.json();

                    if (responseData.mensaje) {
                        notification.success({
                            message: 'Éxito',
                            description: 'Horario editado exitosamente',
                        });
                    } else {
                        notification.error({
                            message: 'Error',
                            description: 'Error al editar el horario: ' + responseData.error,
                        });
                    }
                }

            }

        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error al editar el horario' + error,
            });
        }
    };

    const handleHorarioCreate = async (jsonHorario) => {
        try {
            const formDataObject = new FormData();
            formDataObject.append('nombreh', 'horarioProducto' + selectedProducto.id_producto);
            formDataObject.append('detalle', JSON.stringify(jsonHorario));
            formDataObject.append('idsucursal', selectedSucursal);
            formDataObject.append('idproducto', selectedProducto.id_producto);
            const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/horarios/CrearHorarioProducto/', {
                method: 'POST',
                body: formDataObject,
            });

            const responseData = await response.json();

            if (response.ok) {
                notification.success({
                    message: 'Éxito',
                    description: 'Horario creado exitosamente',
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Error al crear el horario: ' + responseData.error,
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error al validar el formulario' + error,
            });
        }
    };

    const onCloseH = () => {
        setOpenH(false)
        setSucursal('');
    }

    const viewadminH = (productId) => {
        setProducto(productId);
        console.log(productId.horarios)
        if (SucursalesData && SucursalesData.length > 0) {
            const firstFiveSucursales = SucursalesData.slice(0, 5);
            const options = firstFiveSucursales.map((sucursal) => sucursal.snombre);
            setOptions(options);
            const allSucursalesOptions = SucursalesData.map((sucursal) => ({
                value: sucursal.id_sucursal,
                label: sucursal.snombre,
            }));
            setOptions2(allSucursalesOptions);

        }
        setOpenH(true);
    }

    const HorarioCreate = async (jsonHorario) => {
        try {
            const formDataObject = new FormData();
            formDataObject.append('detalle', JSON.stringify(jsonHorario));
            formDataObject.append('id_sucursal', selectedSucursal);


            const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/editarproducto/' + productId + '/', {
                method: 'POST',
                body: formDataObject,
            });

            const responseData = await response.json();

            if (responseData.mensaje) {
                notification.success({
                    message: 'Éxito',
                    description: 'Horario editado exitosamente',
                });
                fetchproducto(currentPage);
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

    const Changueopcion = (value) => {
        setSelectedOpcion(value);
    }

    const showDrawerp = () => {
        setOpenp(true);
    };

    const onClosep = () => {
        setOpenp(false);
        fetchproducto(currentPage);
    };

    const fetchproducto = async (page) => {
        try {
            const response = await fetch(`https://projectdjangobakfebrero-production.up.railway.app/producto/listar/?page=${page}`);
            const data = await response.json();
            setProductos(data.productos);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        form.resetFields();
        fetchproducto(currentPage);
    }, []);

    useEffect(() => {
        const fetchUmList = async () => {
            try {
                const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listarum/');
                const data = await response.json();
                setUmList(data.unidades_medida);
            } catch (error) {
                console.error('Error fetching UM data:', error);
            }
        };

        const fetchCategoriaList = async () => {
            try {
                const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listar_categorias/');
                const data = await response.json();
                setCategoriaList(data.categorias);
            } catch (error) {
                console.error('Error fetching category data:', error);
            }
        };

        fetchUmList();
        fetchCategoriaList();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchproducto(page); // Llama a la función fetchproducto con la nueva página
    };

    const handleEditClick = (productId) => {
        console.log('Sucede');
        const productoToEdit = productos.find((producto) => producto.id_producto === productId.id_producto);
        setEditingProductId(productId.id_producto);
        setInitialFormValues(productoToEdit);
        setEditModalVisible(true);
        fetchproducto(currentPage);
    };

    const handleCancelEdit = () => {

        setEditingProductId(null);
        setInitialFormValues(null);
        setEditModalVisible(false);
        fetchproducto(currentPage);
    };

    const validateImageFormat = (_, fileList) => {
        const isValidFormat = fileList.every(file => file.type.startsWith('image/'));
        if (!isValidFormat) {
            return Promise.reject('Solo se permiten archivos de imagen');
        }
        return Promise.resolve();
    };


    const fetchHorarioDetails = async (idHorario) => {
        try {
            console.log(idHorario);
            const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/horarios/get/' + idHorario);
            const data = await response.json();

            if (data.detalles) {
                setHorarioDetails(data.detalles);
            }
        } catch (error) {
            notification.warning({
                message: 'No hay horario',
                description: 'No haz creado un horario de atención para tu sucursal',
            });
        }
    };

    const handleSaveEdit = async (productId, formValues) => {
        try {
            const formData = new FormData();
            Object.entries(formValues).forEach(([key, value]) => {
                if (key === 'iva' || key === 'ice' || key === 'irbpnr') {
                    value = value ? '1' : '0';
                }
                formData.append(key, value);
            });

            const imagenpInput = formValues['imagenp'];
            if (imagenpInput && imagenpInput[0] && imagenpInput[0].originFileObj) {
                formData.append('imagenp', imagenpInput[0].originFileObj);
            }

            const response = await fetch(`https://projectdjangobakfebrero-production.up.railway.app/producto/editarproducto/${productId}/`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setEditingProductId(null);
                setInitialFormValues(null);
                setEditModalVisible(false);
            } else {
                console.error('Error updating product:', response.status, response.statusText);
                const responseData = await response.json();
                console.error('Server response:', responseData);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };


    const getCategoriaNombre = (idCategoria) => {
        const categoria = categoriaList.find((categoria) => categoria.id_categoria === idCategoria);
        return categoria ? categoria.catnombre : '';
    };

    const showModalContent = (producto) => {
        return (
            <Form form={form} onFinish={(values) => handleSaveEdit(producto.id_producto, values)}>
                <Form.Item label="Nombre del Producto" name="nombreproducto" initialValue={producto.nombreproducto}>
                    <Input />
                </Form.Item>
                <Form.Item label="Descripción del Producto" name="descripcionproducto" initialValue={producto.descripcionproducto}>
                    <Input />
                </Form.Item>
                <Form.Item label="Unidad de Medida" name="id_um" initialValue={producto.id_um}>
                    <Select>
                        {umList.map((um) => (
                            <Option key={um.id_um} value={um.id_um}>
                                {um.nombre_um}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Categoría" name="id_categoria" initialValue={producto.id_categoria}>
                    <Select>
                        {categoriaList.map((categoria) => (
                            <Option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.catnombre}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="IVA" name="iva" valuePropName="checked" initialValue={producto.iva === '1'}>
                    <Checkbox />
                </Form.Item>
                <Form.Item label="ICE" name="ice" valuePropName="checked" initialValue={producto.ice === '1'}>
                    <Checkbox />
                </Form.Item>
                <Form.Item label="IRBPNR" name="irbpnr" valuePropName="checked" initialValue={producto.irbpnr === '1'}>
                    <Checkbox />
                </Form.Item>

                <Form.Item label="Puntos" name="puntosp" initialValue={producto.puntosp}>
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Imagen del Producto"
                    name="imagenp"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e && e.fileList}
                >
                    <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                        <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Guardar
                    </Button>
                    <Button onClick={handleCancelEdit}>Cancelar</Button>
                </Form.Item>
            </Form>
        );
    };
    return (
        <div>
            <Row>
                <Col md={12}>
                    <Segmented
                        options={[
                            {
                                label: (
                                    <Tooltip title="Productos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={imgproductos} size="large" />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'Productos',
                            },
                            {
                                label: (
                                    <Tooltip title="Categorías">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" size="large" src={categoriaproducto} />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'Categorias',
                            }
                            ,
                            {
                                label: (
                                    <Tooltip title="Tipos de productos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" size="large" src={tipoproducto} />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'tipoproducto',
                            }
                            ,
                            {
                                label: (
                                    <Tooltip title="Unidad de medida">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" size="large" src={um} />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'um',
                            }
                            ,
                            {
                                label: (
                                    <Tooltip title="Artículos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" size="large" src={articulo} />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'articulo',
                            }
                        ]}
                        value={selectedOpcion}
                        onChange={Changueopcion}
                    />
                </Col>
                {selectedOpcion === 'Productos' && (
                    <>
                        <Divider>Control productos</Divider>
                        <Col md={12}>
                            <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawerp}>
                                Crear nuevo producto
                            </Button>
                        </Col>
                        <Col md={12}>
                            <Row>

                                {productos.map((producto) => (
                                    <Col xs={24} sm={6} md={5} lg={3}>
                                        <Card
                                            key={producto.id_producto}
                                            hoverable
                                            style={{
                                                width: '100%', backgroundColor: '#CAF0EF', border: '1px solid #A4A4A4', marginTop: '5%',
                                                height: '92%', margin: '16px', marginLeft: '1px',
                                            }}
                                            cover={
                                                producto.imagenp ? (
                                                    <>
                                                        <img alt={producto.nombreproducto} src={`data:image/png;base64,${producto.imagenp}`} height={'300px'} />
                                                        <Row align="right">
                                                            <Col md={8} />
                                                            <Col md={4}>
                                                                <Row align="right">
                                                                    <Col md={5}>
                                                                        <Tooltip title='Editar producto'>
                                                                            <Button
                                                                                icon={<EditFilled />}
                                                                                onClick={() => handleEditClick(producto)}
                                                                            >
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </Col>
                                                                    <Col md={1}>
                                                                        <Tooltip title='Horarios de atención'>
                                                                            <Button
                                                                                icon={<CalendarTwoTone />}
                                                                                onClick={() => viewadminH(producto)}
                                                                            >
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <Tooltip
                                                                            title='Ver componente'
                                                                            overlayStyle={{ width: 300 }}
                                                                        >
                                                                            {producto.detalle && (
                                                                                <Popover title={<Tag color="#000000">Ensamble de componente:</Tag>} trigger="click"
                                                                                    content={
                                                                                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                                                            <p>Generado por ensamble: {producto.detalle.padrecant}</p>
                                                                                            <hr />
                                                                                            {producto.detalle.detalle.map((detalleItem, index) => (
                                                                                                <div key={index}>
                                                                                                    <Tag color="#55971A">{detalleItem.id_componentehijo.nombre}</Tag>
                                                                                                    <p>Cantidad: {detalleItem.cantidadhijo}</p>
                                                                                                    <p>Unidad de Medida: {detalleItem.um.nombre}</p>
                                                                                                    <hr />
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    }>
                                                                                    <Button icon={<EyeOutlined />} />
                                                                                </Popover>
                                                                            )}

                                                                        </Tooltip>
                                                                    </Col >
                                                                </Row>

                                                            </Col>
                                                        </Row>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Watermark content={[producto.nombreproducto, 'Sin imagen']}>
                                                            <div style={{ width: '100%', height: '300px', overflow: 'hidden', backgroundColor: '#ffff', borderLeft: '1px solid  #A4A4A4', borderRight: ' 1px solid  #A4A4A4' }} />
                                                        </Watermark>
                                                        <Row align="right">
                                                            <Col md={8} />
                                                            <Col md={4}>
                                                                <Row align="right">
                                                                    <Col md={5}>
                                                                        <Tooltip title='Editar producto'>
                                                                            <Button
                                                                                icon={<EditFilled />}
                                                                                onClick={() => handleEditClick(producto)}
                                                                            >
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </Col>
                                                                    <Col md={1}>
                                                                        <Tooltip title='Horarios de atención'>
                                                                            <Button
                                                                                icon={<CalendarTwoTone />}
                                                                                onClick={() => viewadminH(producto)}
                                                                            >
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <Tooltip
                                                                            title='Ver componente'
                                                                            overlayStyle={{ width: 300 }}
                                                                        >
                                                                            {producto.detalle && (
                                                                                <Popover title={<Tag color="#000000">Ensamble de componente:</Tag>} trigger="click"
                                                                                    content={
                                                                                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                                                            <p>Generado por ensamble: {producto.detalle.padrecant}</p>
                                                                                            <hr />
                                                                                            {producto.detalle.detalle.map((detalleItem, index) => (
                                                                                                <div key={index}>
                                                                                                    <Tag color="#55971A">{detalleItem.id_componentehijo.nombre}</Tag>
                                                                                                    <p>Cantidad: {detalleItem.cantidadhijo}</p>
                                                                                                    <p>Unidad de Medida: {detalleItem.um.nombre}</p>
                                                                                                    <hr />
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    }>
                                                                                    <Button icon={<EyeOutlined />} />
                                                                                </Popover>
                                                                            )}

                                                                        </Tooltip>
                                                                    </Col >
                                                                </Row>

                                                            </Col>
                                                        </Row>
                                                    </>
                                                )


                                            }

                                        >
                                            <Meta title={producto.nombreproducto} description={producto.descripcionproducto} />
                                            <Tooltip title={"Puntos de " + producto.nombreproducto}>
                                                <Badge count={producto.puntosp} showZero color='#faad14' />
                                            </Tooltip>
                                            <Tooltip title={"Precio de " + producto.nombreproducto}>
                                                <Badge count={'$' + producto.preciounitario} showZero color='#06CE15' style={{ margin: '10px' }} />
                                            </Tooltip>
                                            <Tooltip title={"Categoría de " + producto.nombreproducto}>
                                                <Badge count={getCategoriaNombre(producto.id_categoria)} showZero color='#CE6F04' />
                                            </Tooltip>
                                        </Card>
                                    </Col>
                                ))}

                            </Row>
                            <Pagination current={currentPage} total={20} onChange={handlePageChange} pageSize={10} style={{ marginTop: '16px', textAlign: 'center' }} />
                        </Col>
                    </>)}
                {selectedOpcion === 'Categorias' && (
                    <>
                        <Divider>Control categorías</Divider>
                        <Col md={12}>
                            <EditarCategoria />
                        </Col>
                    </>)}
                {selectedOpcion === 'tipoproducto' && (
                    <>
                        <Divider>Control tipo de productos</Divider>
                        <Col md={12}>
                            <EditarTipoProducto />
                        </Col>
                    </>)}
                {selectedOpcion === 'um' && (
                    <>
                        <Divider>Control unidad de medida</Divider>
                        <Col md={12}>
                            <EditarUnidadesMedida />
                        </Col>
                    </>)}
                {selectedOpcion === 'articulo' && (
                    <>
                        <Divider>Control de artículos</Divider>
                        <EditarComponenteForm />
                    </>)}
            </Row>
            <Modal
                title="Editar Producto"
                visible={editModalVisible}
                onCancel={handleCancelEdit}
                footer={null}
            >
                {editingProductId !== null && initialFormValues
                    ? showModalContent(initialFormValues)
                    : null}
            </Modal>
            <Drawer
                title="Crear producto"
                width={720}
                onClose={onClosep}
                open={openp}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <CrearProducto />
            </Drawer>
            <Drawer
                title="Horarios de producto"
                width={800}
                onClose={onCloseH}
                open={openH}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >

                <Row>
                    <Col md={6}>
                        <Segmented options={optionSucursales2}
                            value={selectedSucursal}
                            onChange={handleProductoChange}
                        />
                    </Col>
                </Row>
                {selectedSucursal != '' && horarioDetails != '' && (
                    <>
                        <CrearHorariosSemanales detalles={horarioDetails} onHorarioCreate={editHorarioCreate} />
                    </>
                )}
                {selectedSucursal != '' && horarioDetails == '' && (
                    <>
                        <CrearHorariosSemanales onHorarioCreate={handleHorarioCreate} />
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default EditarProducto;