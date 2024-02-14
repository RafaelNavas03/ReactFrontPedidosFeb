import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';

const EditarCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [editingCliente, setEditingCliente] = useState(null);
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({
        razonsocial: '',
        snombre: '',
        capellido: '',
        ruc_cedula: '',
        ccorreo_electronico: '',
        ubicacion: '',
        ctelefono: '',
        tipocliente: '',
        cpuntos: '',
    });
    const tipoClienteOptions = [
        { value: '04', label: 'RUC' },
        { value: '05', label: 'CÉDULA' },
        { value: '06', label: 'PASAPORTE' },
        { value: '07', label: 'VENTA A CONSUMIDOR FINAL*' },
        { value: '08', label: 'IDENTIFICACIÓN DELEXTERIOR*' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/cliente/ver_clientes/');
                const data = await response.json();

                setClientes(data.clientes);

                const tipoClienteOptions = data.clientes.map(cliente => ({
                    value: cliente.tipocliente,
                    label: getTipoClienteLabel(cliente.tipocliente),
                }));
                setTipoClienteOptions(tipoClienteOptions);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        {
            title: ' ',
            dataIndex: 'id_cliente',
            key: 'id_cliente',
        },
        {
            title: 'Razón Social',
            dataIndex: 'crazon_social',
            key: 'crazon_social',
        },
        {
            title: 'Nombre',
            dataIndex: 'snombre',
            key: 'snombre',
        },
        {
            title: 'Apellido',
            dataIndex: 'capellido',
            key: 'capellido',
        },
        {
            title: 'RUC/Cédula',
            dataIndex: 'ruc_cedula',
            key: 'ruc_cedula',
        },
        {
            title: 'Correo Electrónico',
            dataIndex: 'ccorreo_electronico',
            key: 'ccorreo_electronico',
        },
        {
            title: 'Ubicación',
            dataIndex: 'ubicacion',
            key: 'ubicacion',
        },
        {
            title: 'Teléfono',
            dataIndex: 'ctelefono',
            key: 'ctelefono',
        },
        {
            title: 'Tipo de Cliente',
            dataIndex: 'tipocliente',
            key: 'tipocliente',
            render: (value) => getTipoClienteLabel(value),
        },
        {
            title: 'Puntos',
            dataIndex: 'cpuntos',
            key: 'cpuntos',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <Button type="primary" onClick={() => handleEdit(record)}>
                    Editar
                </Button>
            ),
        },
    ];

    const getTipoClienteLabel = (tipoCliente) => {
        switch (tipoCliente) {
            case '04':
                return 'RUC';
            case '05':
                return 'Cédula';
            case '06':
                return 'Pasaporte';
            case '07':
                return 'Idt. del exterior';
            default:
                return tipoCliente;
        }
    };
 
    const handleCancel = () => {
        setEditingCliente(null);
        setVisible(false);
    };


    const handleInputChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });

        setEditingCliente({
            ...editingCliente,
            [key]: value,
        });
    };

    const handleEdit = (cliente) => {
        console.log('Aqui'+cliente.id_cliente);
        setEditingCliente(cliente);
        setFormData({
            razonsocial: cliente.crazon_social,
            snombre: cliente.snombre,
            capellido: cliente.capellido,
            ruc_cedula: cliente.ruc_cedula,
            ccorreo_electronico: cliente.ccorreo_electronico,
            ubicacion: cliente.ubicacion,
            ctelefono: cliente.ctelefono,
            tipocliente: cliente.tipocliente,
            cpuntos: cliente.cpuntos,
        });
        setVisible(true);
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            if (editingCliente.crazon_social !== null && editingCliente.crazon_social !== undefined) {
                formData.append('razonsocial', editingCliente.crazon_social);
            }
    
            if (editingCliente.snombre !== null && editingCliente.snombre !== undefined) {
                formData.append('snombre', editingCliente.snombre);
            }
    
            if (editingCliente.capellido !== null && editingCliente.capellido !== undefined) {
                formData.append('capellido', editingCliente.capellido);
            }
    
            if (editingCliente.ruc_cedula !== null && editingCliente.ruc_cedula !== undefined) {
                formData.append('ruc_cedula', editingCliente.ruc_cedula);
            }
    
            if (editingCliente.ccorreo_electronico !== null && editingCliente.ccorreo_electronico !== undefined) {
                formData.append('ccorreo_electronico', editingCliente.ccorreo_electronico);
            }
    
            if (editingCliente.ubicacion !== null && editingCliente.ubicacion !== undefined) {
                formData.append('ubicacion', editingCliente.ubicacion);
            }
    
            if (editingCliente.ctelefono !== null && editingCliente.ctelefono !== undefined) {
                formData.append('ctelefono', editingCliente.ctelefono);
            }
    
            if (editingCliente.tipocliente !== null && editingCliente.tipocliente !== undefined) {
                formData.append('tipocliente', editingCliente.tipocliente);
            }
    
            if (editingCliente.cpuntos !== null && editingCliente.cpuntos !== undefined) {
                formData.append('cpuntos', editingCliente.cpuntos);
            }
    
    
            const response = await fetch(`https://projectdjangobakfebrero-production.up.railway.app/cliente/actualizar_cliente/${editingCliente.id_cliente}/`, {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                message.success('Datos del cliente actualizados correctamente');
                const updatedClientes = clientes.map((cliente) =>
                    cliente.id_cliente === editingCliente.id_cliente ? { ...cliente, ...editingCliente } : cliente
                );
                setClientes(updatedClientes);
                // Cerrar el modal de edición
                handleCancel();
            } else {
                console.error('Error al actualizar el cliente');
            }
        } catch (error) {
            console.error('Error en la solicitud de actualización:', error);
            setErrorMessage('Error en la solicitud de actualización');
        }
    };
    

    return (
        <div>
            <Table dataSource={clientes} columns={columns} />

            <Modal
                title="Editar Cliente"
                visible={visible}
                onOk={handleSave}
                onCancel={handleCancel}
            >
                <Form>

                    <Form.Item label="Razón Social">
                        <Input
                            value={editingCliente ? editingCliente.crazon_social : ''}
                            onChange={(e) => handleInputChange('crazon_social', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Nombre">
                        <Input
                            value={editingCliente ? editingCliente.snombre : ''}
                            onChange={(e) => handleInputChange('snombre', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Apellido">
                        <Input
                            value={editingCliente ? editingCliente.capellido : ''}
                            onChange={(e) => handleInputChange('capellido', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="RUC/Cédula">
                        <Input
                            value={editingCliente ? editingCliente.ruc_cedula : ''}
                            onChange={(e) => handleInputChange('ruc_cedula', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Correo electronico">
                        <Input
                            value={editingCliente ? editingCliente.ccorreo_electronico : ''}
                            onChange={(e) => handleInputChange('ccorreo_electronico', e.target.value)}
                        />
                    </Form.Item>
                    
                    <Form.Item label="Tipo de Cliente">
                        <Select
                            value={editingCliente ? editingCliente.tipocliente : undefined}
                            onChange={(value) => handleInputChange('tipocliente', value)}
                        >
                            {tipoClienteOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Ubicación">
                        <Input
                            value={editingCliente ? editingCliente.ubicacion : ''}
                            onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Puntos:">
                        <Input
                            value={editingCliente ? editingCliente.cpuntos : ''}
                            onChange={(e) => handleInputChange('cpuntos', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Telefono ">
                        <Input
                            value={editingCliente ? editingCliente.ctelefono : ''}
                            onChange={(e) => handleInputChange('ctelefono', e.target.value)}
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};

export default EditarCliente;