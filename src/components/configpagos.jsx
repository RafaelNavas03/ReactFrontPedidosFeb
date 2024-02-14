import React, { useState, useEffect } from "react";
import { Modal, Button, Select, InputNumber, message } from "antd";

const { Option } = Select;


const ConfigPagos = ({ onSave }) => {
  const [data, setData] = useState([
    { tipoEmpleado: "JefeCocina", periodoPago: "S", cantidadPago: 0, valore: 'X' },
    { tipoEmpleado: "Mesero", periodoPago: "S", cantidadPago: 0, valore: 'M' },
    { tipoEmpleado: "Motorizado", periodoPago: "S", cantidadPago: 0, valore: 'D' },
  ]);

  const [selectedPeriods, setSelectedPeriods] = useState({
    JefeCocina: "S",
    Mesero: "S",
    Motorizado: "S",
  });

  const apiUrl = "projectdjangobakfebrero-production.up.railway.app/pagos/creartipop/";

  const handleSave = async (index) => {
    try {
      const formData = new FormData();
      formData.append('rol', data[index].valore);
      formData.append('tipo_pago', data[index].periodoPago);
      formData.append('cantidad', data[index].cantidadPago);

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        message.success(result.mensaje);
        onSave();
      } else {
        message.error("Error al guardar");
      }
    } catch (error) {
      console.error("Error al procesar la solicitud", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("projectdjangobakfebrero-production.up.railway.app/pagos/tipodepagos/");
        if (response.ok) {
          const result = await response.json();
          updateData(result.tipopagos);
        } else {
          console.error("Error al cargar los datos");
        }
      } catch (error) {
        console.error("Error al procesar la solicitud", error);
      }
    };

    fetchData();
  }, []);

  const updateData = (tipopagos) => {
    const newData = [...data];
    const newSelectedPeriods = { ...selectedPeriods };

    tipopagos.forEach((item) => {
      switch (item.rol) {
        case "X":
          newData[0].periodoPago = item.tipo_pago;
          newData[0].cantidadPago = parseFloat(item.cantidad);
          newSelectedPeriods.JefeCocina = item.tipo_pago;
          break;
        case "M":
          newData[1].periodoPago = item.tipo_pago;
          newData[1].cantidadPago = parseFloat(item.cantidad);
          newSelectedPeriods.Mesero = item.tipo_pago;
          break;
        case "D":
          newData[2].periodoPago = item.tipo_pago;
          newData[2].cantidadPago = parseFloat(item.cantidad);
          newSelectedPeriods.Motorizado = item.tipo_pago;
          break;
        default:
          break;
      }
    });

    setData(newData);
    setSelectedPeriods(newSelectedPeriods);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Tipo de empleado</th>
            <th>Periodo de pago</th>
            <th>Cantidad de pago</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.tipoEmpleado}</td>
              <td>
                <Select
                  value={selectedPeriods[item.tipoEmpleado]}
                  onChange={(value) => {
                    const newData = [...data];
                    newData[index].periodoPago = value;
                    setData(newData);
                    setSelectedPeriods(prevSelectedPeriods => ({
                      ...prevSelectedPeriods,
                      [item.tipoEmpleado]: value,
                    }));
                  }}
                >
                  <Option value="H">Pago por horas</Option>
                  <Option value="S">Pago semanal</Option>
                  <Option value="M">Pago mensual</Option>
                  <Option value="T">Pago trimestral</Option>
                </Select>
              </td>
              <td>
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  value={item.cantidadPago}
                  onChange={(value) => setData((prevData) => {
                    const newData = [...prevData];
                    newData[index].cantidadPago = value;
                    return newData;
                  })}
                />
              </td>
              <td>
                <Button type="primary" onClick={() => handleSave(index)}>
                  Guardar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        type="primary"
      >
        Iniciar pagos
      </Button>
    </>
  );
};

export default ConfigPagos;