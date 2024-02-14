import React, { useEffect, useState } from 'react';
import { Transfer, message, Table, Input, Form, InputNumber, Button, Select, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const TransferContainer = ({ onValor, previouslySelectedItems }) => {
    const [loading, setLoading] = useState(false);
    const [componenteslist, setComponentes] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const onChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
        const items = componenteslistWithKeyTitle.filter(item => nextTargetKeys.includes(item.key));
        setSelectedItems(items);
        generateJson(items);

    };

    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

    };

    const onScroll = (direction, e) => {

    };
    useEffect(() => {
        SelectListForTransfer();
        SelectListForTable();
    }, [])

    useEffect(() => {
        const fetchComponentes = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listarcomponentes/');
                if (response.ok) {
                    const data = await response.json();
                    const componentesWithDefaultCosto = data.componentes.map((componente) => ({
                        ...componente,
                        costo: componente.costo !== null ? componente.costo : '0.00',
                    }));
                    setComponentes(componentesWithDefaultCosto);

                    if (targetKeys.length > 0) {
                        const items = componentesWithDefaultCosto.filter(item => targetKeys.includes(item.key));
                        const selectedItems = items.map(item => item.key);
                        setSelectedKeys(selectedItems);
                    }

                } else {
                    const errorData = await response.json();
                }
            } catch (error) {
                console.error('Error al cargar los componentes:', error);
                message.error('Hubo un error al cargar los componentes');
            } finally {
                setLoading(false);
            }
        };

        fetchComponentes();
    }, [targetKeys]);

    //Registra los items en el tranfer
    const SelectListForTransfer = () => {
        if (previouslySelectedItems && previouslySelectedItems.detalle.length > 0) {
            const initialTargetKeys = previouslySelectedItems.detalle.map(item => item.id_componentehijo.id.toString());
            setTargetKeys(initialTargetKeys);
        }
    }

    //Registra los items en la tabla
    const SelectListForTable = () => {
        if (previouslySelectedItems && previouslySelectedItems.detalle.length > 0) {
            const initialItems = previouslySelectedItems.detalle.map(item => ({
                key: item.id_componentehijo.id.toString(),
                title: item.id_componentehijo.nombre,
                quantity: item.cantidadhijo,
            }));
            setSelectedItems(initialItems);
            generateJson(initialItems);
        }
    }

    const handleQuantityChange = (key, quantity) => {
        const updatedItems = selectedItems.map(item =>
            item.key === key ? { ...item, quantity } : item
        );
        setSelectedItems(updatedItems);
        generateJson(updatedItems);
    };

    const generateJson = (items) => {
        const jsonData = items.map(item => ({
            id: item.key,
            cantidad: item.quantity || 1,
        }));
        const jsonString = JSON.stringify(jsonData, null, 2);
        if (typeof onValor === 'function') {
            onValor(jsonString);
        }
    };
    console.log(componenteslist);

    const componenteslistWithKeyTitle = componenteslist.map((componente) => ({
        key: componente.id_componente.toString(),
        title: componente.nombre + ' [' + componente.nombre_um + ']',
        id_um: componente.id_um,
    }));

    return (
        <div className='table-responsive'>
            <Row>
                <Col md={24}>
                    <Transfer
                        dataSource={componenteslist.map((componente) => ({
                            key: componente.id_componente.toString(),
                            title: componente.nombre,
                        }))}
                        showSearch
                        targetKeys={targetKeys}
                        selectedKeys={selectedKeys}
                        onChange={onChange}
                        onSelectChange={onSelectChange}
                        onScroll={onScroll}
                        render={(item) => item.title}
                        oneWay
                        loading={loading}
                        style={{ marginBottom: 16 }}
                    />
                </Col>
                <Col md={24}>
                    <div style={{ border: '1px solid #A4A4A4', margin: '2%', padding: '2%', height: '100%' }}>
                        <h6>Artículos seleccionados</h6>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedItems.map(item => (
                                    <tr key={item.key}>
                                        <td>-</td>
                                        <td>{item.title}</td>
                                        <td>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    className="form-control"
                                                    name={`cantidad_${item.key}`}
                                                    value={item.quantity || 1}
                                                    onChange={(e) => handleQuantityChange(item.key, e.target.value)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row >
        </div>
    );
};

export default TransferContainer;
