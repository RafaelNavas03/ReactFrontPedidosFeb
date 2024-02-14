import React, { useState, useEffect } from 'react';
import { Form, Card, Input, Pagination, Button, Select, Modal, Tooltip, Badge, Segmented, Avatar, Checkbox, Drawer, Divider, Watermark } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { UploadOutlined, CalendarTwoTone, EditFilled } from '@ant-design/icons';
import imgcombos from './res/imgcombos.png';
import NuevoComboForm from './crearcombo';
import categoriaproducto from './res/categoriaproducto.png';
import EditarCategoriaCombo from './editarcategoriacombo';

const { Meta } = Card;
const { Option } = Select;

const Combos = () => {
    const [openp, setOpenp] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOpcion, setSelectedOpcion] = useState('Combos');
    const [total, setTotal] = useState(0);
    const [combos, setCombos] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingComboId, setEditingComboId] = useState(null);
    const [initialFormValues, setInitialFormValues] = useState(null);
    const [form] = Form.useForm();

    const handleEditClick = (id_combo) => {

        const comboToEdit = combos.find((combo) => combo.id_combo === id_combo.id_combo);
        setEditingComboId(id_combo.id_combo);

        setInitialFormValues(comboToEdit);
        setEditModalVisible(true);
    };

    const handleCancelEdit = () => {
        form.resetFields();
        fetchData(currentPage);
        setOpenp(false);
        setEditingComboId(null);
        setInitialFormValues(null);
        setEditModalVisible(false);
    };

    const Changueopcion = (value) => {
        form.resetFields();
        fetchData(currentPage);
        setSelectedOpcion(value);
    }

    const showDrawerp = () => {
        setOpenp(true);
    };

    const onClosep = () => {
        form.resetFields();
        fetchData(currentPage);
        setOpenp(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        form.resetFields();
        fetchData(currentPage);
    }, []);

    const fetchData = async (page) => {
        try {
            console.log('xxxxxxxxxxxxxxxxxxA');
            const response = await fetch(`https://projectdjangobakfebrero-production.up.railway.app/combos/ver_combos/?page=${page}`);
            const data = await response.json();
            setCombos(data.combos);
            console.log(data.combos);

        } catch (error) {
            console.error('Error fetching data:', error);
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
                                    <Tooltip title="Combos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" src={imgcombos} size="large" />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'Combos',
                            },
                            {
                                label: (
                                    <Tooltip title="Categorías de combos">
                                        <div style={{ padding: 4 }}>
                                            <Avatar shape="square" size="large" src={categoriaproducto} />
                                        </div>
                                    </Tooltip>
                                ),
                                value: 'Categorias',
                            }
                        ]}
                        value={selectedOpcion}
                        onChange={Changueopcion}
                    />
                </Col>
                {selectedOpcion === 'Combos' && (
                    <>
                        <Divider>Control combos</Divider>
                        <Col md={12}>
                            <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawerp}>
                                Crear nuevo combo
                            </Button>
                        </Col>
                        <Col md={12}>
                            <Row>
                                {combos && combos.map((combo) => (
                                    <Col xs={24} sm={6} md={5} lg={3}>
                                        <Card
                                            key={combo.id_combo}
                                            hoverable
                                            style={{
                                                width: '100%', backgroundColor: '#CAF0EF', border: '1px solid #A4A4A4', marginTop: '5%',
                                                height: '92%', margin: '16px', marginLeft: '1px',
                                            }}
                                            cover={
                                                combo.imagen ? (
                                                    <>
                                                        <img alt={combo.nombrecb} src={`data:image/png;base64,${combo.imagen}`} height={'300px'} />
                                                        <Row align="right">
                                                            <Col md={8} />
                                                            <Col md={4}>
                                                                <Row align="right">
                                                                    <Col md={5}>
                                                                        <Tooltip title='Editar combo'>

                                                                        </Tooltip>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row align="right">
                                                            <Col md={8} />
                                                            <Col md={4}>
                                                                <Row align="right">
                                                                    <Col md={5}>
                                                                        <Tooltip title='Editar combo'>
                                                                            <Button
                                                                                icon={<EditFilled />}
                                                                                onClick={() => handleEditClick(combo)}
                                                                            >
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </Col>
                                                                </Row>

                                                            </Col>
                                                        </Row>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Watermark content={[combo.nombrecb, 'Sin imagen']}>
                                                            <div style={{ width: '100%', height: '300px', overflow: 'hidden', backgroundColor: '#ffff', borderLeft: '1px solid  #A4A4A4', borderRight: ' 1px solid  #A4A4A4' }} />
                                                        </Watermark>
                                                        <Row align="right">
                                                            <Col md={8} />
                                                            <Col md={4}>
                                                                <Row align="right">
                                                                    <Col md={5}>
                                                                        <Tooltip title='Editar combo'>

                                                                        </Tooltip>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row align="right">
                                                            <Col md={8} />
                                                            <Col md={4}>
                                                                <Row align="right">
                                                                    <Col md={5}>
                                                                        <Tooltip title='Editar combo'>
                                                                            <Button
                                                                                icon={<EditFilled />}
                                                                                onClick={() => handleEditClick(combo)}
                                                                            >
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </Col>
                                                                </Row>

                                                            </Col>
                                                        </Row>
                                                    </>
                                                )
                                            }
                                        >
                                            <Meta title={combo.nombrecb} description={combo.descripcioncombo} />
                                            <Tooltip title={"Puntos de " + combo.nombrecb}>
                                                <Badge count={combo.puntos} showZero color='#faad14' />
                                            </Tooltip>
                                            <Tooltip title={"Precio de " + combo.nombrecb}>
                                                <Badge count={'$' + combo.preciounitario} showZero color='#06CE15' style={{ margin: '10px' }} />
                                            </Tooltip>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <Pagination current={currentPage} total={total} onChange={handlePageChange} pageSize={8} style={{ marginTop: '16px', textAlign: 'center' }} />
                        </Col>
                    </>)}
                {selectedOpcion === 'Categorias' && (
                    <>
                        <Divider>Control categorías de combo</Divider>
                        <Col md={12}>
                            <EditarCategoriaCombo />
                        </Col>
                    </>)}
            </Row>
            <Drawer
                title="Crear combo"
                width={720}
                onClose={handleCancelEdit}
                open={openp}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                < NuevoComboForm />
            </Drawer>
            <Modal
                title={`Productos de ${initialFormValues ? initialFormValues.nombrecb : ''}`}
                visible={!!editModalVisible}
                onCancel={handleCancelEdit}
                footer={null}
            >
                {initialFormValues && initialFormValues.productos.length > 0 ? (
                    <div>
                        <p>Productos:</p>
                        <ul>
                            {initialFormValues.productos.map((producto) => (
                                <li key={producto.id_producto}>{producto.nombreproducto} Cantidad: {producto.cantidad} </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No hay productos asociados a este combo</p>
                )}
            </Modal>
        </div>
    );
};

export default Combos;