import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, Divider, Select, Input, Form, Button } from 'antd';

const ConfigUM = () => {
  const [conversiones, setConversiones] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [selectedUnidadPadre, setSelectedUnidadPadre] = useState(null);
  const [cantidadConversion, setCantidadConversion] = useState(0.000001);
  const [selectedUnidadHijo, setSelectedUnidadHijo] = useState(null);

  useEffect(() => {
    

    const obtenerUnidadesMedida = async () => {
      try {
        const respuestaUnidadesMedida = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listarum/');
        if (!respuestaUnidadesMedida.ok) {
          throw new Error('Error al obtener las unidades de medida');
        }
        const datosUnidadesMedida = await respuestaUnidadesMedida.json();
        setUnidadesMedida(datosUnidadesMedida.unidades_medida);
      } catch (error) {
        console.error(error);
        message.error('Error al obtener las unidades de medida');
      }
    };

    obtenerConversiones();
    obtenerUnidadesMedida();
  }, []);
  const obtenerConversiones = async () => {
    try {
      const respuestaConversiones = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/conversionesum/');
      if (!respuestaConversiones.ok) {
        console.error(respuestaConversiones.error);
      }
      const datosConversiones = await respuestaConversiones.json();
      setConversiones(datosConversiones.conversiones);
    } catch (error) {
      console.error(error);
      message.error('Error al obtener las conversiones');
    }
  };

  const handleUnidadPadreChange = (value) => {
    setSelectedUnidadPadre(value);
  };

  const handleCantidadConversionChange = (value) => {
    setCantidadConversion(value);
  };

  const handleUnidadHijoChange = (value) => {
    setSelectedUnidadHijo(value);
  };

  const handleSubmit = async () => {
    // Validar que las unidades seleccionadas no sean iguales
    if (selectedUnidadPadre === selectedUnidadHijo) {
      message.error('Las unidades de medida no pueden ser iguales.');
      return;
    }

    // Enviar datos a la API
    try {
      const formData = new FormData();
      console.log('Padre:');
      console.log(selectedUnidadPadre);
      console.log('Hijo:');
      console.log(selectedUnidadHijo);
      formData.append('idump', selectedUnidadPadre);
      formData.append('idumc', selectedUnidadHijo);
      formData.append('cantidadconversion', cantidadConversion);

      const respuestaConfiguracion = await fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/configurarensamble/', {
        method: 'POST',
        body: formData,
      });

      if (!respuestaConfiguracion.ok) {
        message.error('Error al configurar la conversión'+respuestaConfiguracion.error);
      }else{
        message.success('Conversión configurada con éxito');
      }
      setSelectedUnidadPadre(null);
      setCantidadConversion(0.000001);
      setSelectedUnidadHijo(null);
      obtenerConversiones();
      
    } catch (error) {
      console.error(error);
      message.error('Algo salió mal');
    }
  };

  return (
    <>
      {conversiones.map((conversion) => (
        <Row key={conversion.id_conversion}>
          <Col span={8} align="center">
            <table className="table" border={'1px'}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>1</td>
                </tr>
                <tr>
                  <td>{conversion.unidad_padre.nombre_um}</td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col span={8} align="center">
            <table className="table">
              <tbody>
                <td align="center" style={{ fontWeight: 'bold' }}>
                  =
                </td>
              </tbody>
            </table>
          </Col>
          <Col span={8} align="center">
            <table className="table" border={'1px'}>
              <tbody>
                <tr>
                  <td>{conversion.cantidad_conversion}</td>
                </tr>
                <tr>
                  <td>{conversion.unidad_hijo.nombre_um}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      ))}
      <Divider>Crear o editar conversión</Divider>
      <Form>
        <Row>
          <Col span={8} align="center">
            <table className="table" border={'1px'}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>1</td>
                </tr>
                <tr>
                  <td>
                    <Select
                      style={{ width: 120 }}
                      options={unidadesMedida.map((um) => ({
                        value: um.id_um.toString(),
                        label: um.nombre_um,
                      }))}
                      onChange={handleUnidadPadreChange}
                      value={selectedUnidadPadre}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col span={8} align="center">
            <table className="table">
              <tbody>
                <td align="center" style={{ fontWeight: 'bold' }}>
                  =
                </td>
              </tbody>
            </table>
          </Col>
          <Col span={8} align="center">
            <table className="table" border={'1px'}>
              <tbody>
                <tr>
                  <td>
                    <Input
                      type="number"
                      step={0.000001}
                      defaultValue={0.000001}
                      min={0.000001}
                      lang="en-US"
                      onChange={(e) => handleCantidadConversionChange(e.target.value)}
                      value={cantidadConversion}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Select
                      style={{ width: 120 }}
                      options={unidadesMedida.map((um) => ({
                        value: um.id_um.toString(),
                        label: um.nombre_um,
                      }))}
                      onChange={handleUnidadHijoChange}
                      value={selectedUnidadHijo}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: '16px' }}>
          <Col>
            <Button type="primary" onClick={handleSubmit}>
              Configurar Conversión
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ConfigUM;
