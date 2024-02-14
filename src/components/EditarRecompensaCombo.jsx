import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Drawer, Form, Input, Button, Col, Row, Divider } from 'antd';
import CrearRecompensaComboForm from './CrearRecompensaCombo';

const EditarRecompensaComboForm = () => {
  const [recompensasCombos, setRecompensasCombos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [crearVisible, setCrearVisible] = useState(false);
  const [editedRecompensaCombo, setEditedRecompensaCombo] = useState(null);
  const [form] = Form.useForm();
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    const fetchRecompensasCombos = async () => {
      try {
        const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/Recompensas/lista_recompensas_combo/');
        if (!response.ok) {
          throw new Error('Error fetching recompensas de combo');
        }
        const data = await response.json();
        setRecompensasCombos(data.recompensas_combos || []);
      } catch (error) {
        console.error('Error fetching recompensas de combo:', error);
      }
    };

    fetchRecompensasCombos();
  }, []);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await fetch('https://projectdjangobakfebrero-production.up.railway.app/combos/ver_combos/');
        if (!response.ok) {
          throw new Error('Error fetching combos');
        }
        const data = await response.json();
        setCombos(data.combos || []);
      } catch (error) {
        console.error('Error fetching combos:', error);
      }
    };

    fetchCombos();
  }, []);

  const showDrawer = (recompensaCombo) => {
    setEditedRecompensaCombo(recompensaCombo);
    form.setFieldsValue({
      puntos_recompensa_combo: recompensaCombo.puntos_recompensa_combo,
      sestado: recompensaCombo.sestado === '1',
    });
    setVisible(true);
  };

  const onClose = () => {
    setEditedRecompensaCombo(null);
    setVisible(false);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('puntos_recompensa_combo', form.getFieldValue('puntos_recompensa_combo'));
      formData.append('sestado', form.getFieldValue('sestado') ? '1' : '0');

      const response = await fetch(`https://projectdjangobakfebrero-production.up.railway.app/Recompensas/editar_recompensa_combo/${editedRecompensaCombo.id_recompensa_combo}/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error updating recompensa de combo');
      }
      form.resetFields();
      setVisible(false);
    } catch (error) {
      console.error('Error updating recompensa de combo:', error);
    }
  };

  const renderRecompensaCard = (recompensaCombo, combo) => (
    <Col xs={24} sm={12} md={8} lg={8} key={recompensaCombo.id_recompensa_combo}>
      <Card
        title={`${combo.nombrecb}`}
        style={{ marginBottom: '16px' }}
        onClick={() => showDrawer(recompensaCombo)}
      >
        <img
          src={`data:image/png;base64,${combo.imagen}`}
          alt={combo.nombrecb}
          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
        />
        <p>Puntos de recompensa: {recompensaCombo.puntos_recompensa_combo}</p>
        <p>Estado: {recompensaCombo.sestado === '1' ? 'Activo' : 'Inactivo'}</p>
      </Card>
    </Col>
  );

  const showCrearRecompensaDrawer = () => {
    setCrearVisible(true);
  };

  const onCloseCrearRecompensaDrawer = () => {
    setCrearVisible(false);
  };

  return (
    <div>
      <Divider>Recompensas de Combos</Divider>
      
      <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showCrearRecompensaDrawer}>
        Crear promoción de combo
      </Button>
      
      <Col md={500}>
        <Row gutter={[12, 12]}>
          {recompensasCombos.map((recompensaCombo) => {
            const combo = combos.find((c) => c.id_combo === recompensaCombo.id_combo);
            return combo ? renderRecompensaCard(recompensaCombo, combo) : null;
          })}
        </Row>
        {/* Agrega aquí la lógica de la paginación */}
      </Col>

      <Drawer
        title="Editar Recompensa de Combo"
        width={360}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item label="Puntos" name="puntos_recompensa_combo">
            <Input />
          </Form.Item>
          <Form.Item label="Estado" name="sestado" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Button key="submit" type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form>
      </Drawer>

      <Drawer
        title="Crear Recompensa de Combo"
        width={360}
        onClose={onCloseCrearRecompensaDrawer}
        visible={crearVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CrearRecompensaComboForm/>
      </Drawer>
    </div>
  );
};

export default EditarRecompensaComboForm;
