import React, { useState, useEffect } from 'react';
import { Table, List, Space, Image, Button, Form, Input, Upload, Modal, message, Row, Col, Drawer } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CrearCategoriaCombos from './crearcategoriacombos';

const EditarCategoriaCombo = ({ onCancel }) => {
    const [categoriasCombos, setCategoriasCombos] = useState([]);
    const [selectedCategoriaCombo, setSelectedCategoriaCombo] = useState(null);
    const [openc, setOpenc] = useState(false);

    const fetchCategoriasCombos = async () => {
        try {
            const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/combos/listcategoria/');
            const data = await response.json();
            setCategoriasCombos(data.categorias_combos);
        } catch (error) {
            console.error('Error fetching categorias combos:', error);
        }
    };

    const onClosec = () => {
        console.log('Que pasab');
        setOpenc(false);
        fetchCategoriasCombos();
      };

    const showDrawerc = () => {
        console.log('Que pasaa');
        setOpenc(true);
    };
    useEffect(() => {
        fetchCategoriasCombos();
    }, []);

    const handleEdit = (record) => {
        setSelectedCategoriaCombo(record);
    };

    const handleCancelEdit = () => {
        setSelectedCategoriaCombo(null);
    };

    const handleUpdateCategoriaCombo = async (values) => {
        try {
            const formData = new FormData();
            formData.append('catnombre', values.catnombre);

            if (values.descripcion !== null && values.descripcion !== undefined) {
                formData.append('descripcion', values.descripcion);
            }

            if (values.imagen && values.imagen.length > 0 && values.imagen[0]?.originFileObj) {
                formData.append('imagencategoria', values.imagen[0].originFileObj);
            }

            const response = await fetch(
                `https://projectdjangobakfebrero-production.up.railway.app/combos/editarcategoriacombo/${selectedCategoriaCombo.id_catcombo}/`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log('Categoría de combo editada con éxito:', data);
                fetchCategoriasCombos();
                handleCancelEdit();
                message.success('Categoría de combo editada con éxito');
            } else {
                console.error('Error al editar categoría de combo:', data.error);
                message.error(`Error al editar categoría de combo: ${data.error}`);
            }
        } catch (error) {
            console.error('Error en la solicitud de edición:', error);
            message.error('Error en la solicitud de edición');
        }
    };

    const CategoriaComboForm = ({ onFinish, onCancel, initialValues }) => {
        const [form] = Form.useForm();

        return (
            <Form
                form={form}
                name="editarCategoriaComboForm"
                onFinish={(values) => {
                    onFinish(values);
                }}
                initialValues={initialValues}
            >
                <Form.Item
                    label="Nombre"
                    name="catnombre"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingresa el nombre de la categoría de combo',
                        },
                        { max: 300, message: 'El nombre no puede exceder los 300 caracteres' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Descripción"
                    name="descripcion"
                    rules={[{ max: 500, message: 'La descripción no puede exceder los 500 caracteres' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Imagen de la Categoría de Combo"
                    name="imagen"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e && e.fileList}
                >
                    <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                        <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
                    </Upload>
                </Form.Item>
                <Form.Item label="Imagen Actual">
                    {initialValues.imagencategoria && (
                        <Image
                            src={`data:image/png;base64, ${initialValues.imagencategoria}`}
                            alt="Imagen actual de la categoría de combo"
                            width={50}
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Guardar cambios
                    </Button>
                    <Button onClick={onCancel}>Cancelar</Button>
                </Form.Item>
            </Form>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'catnombre',
            key: 'catnombre',
        },
        {
            title: 'Imagen',
            dataIndex: 'imagencategoria',
            key: 'imagencategoria',
            render: (imagencategoria) => (
                <Image src={`data:image/png;base64, ${imagencategoria}`} alt="Imagen" width={50} />
            ),
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Editar
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Row>
                <Col md={12}>
                    <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawerc}>
                        Crear nueva categoria
                    </Button>
                </Col>
            </Row>

            <Table dataSource={categoriasCombos} columns={columns} />
            {selectedCategoriaCombo && (
                <Modal
                    title="Editar Categoría de Combo"
                    visible={!!selectedCategoriaCombo}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <CategoriaComboForm
                        initialValues={selectedCategoriaCombo}
                        onFinish={handleUpdateCategoriaCombo}
                        onCancel={handleCancelEdit}
                    />
                </Modal>
            )}
            <Drawer
                title="Crear categoria"
                width={720}
                onClose={onClosec}
                open={openc}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <CrearCategoriaCombos />
            </Drawer>
        </>
    );
};

export default EditarCategoriaCombo;