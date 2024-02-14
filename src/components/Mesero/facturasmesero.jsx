import React, { useState, useEffect } from "react";
import { Table, Row, Col, Tooltip, Pagination, Modal, Button } from "antd";
import imgmesas from "./res/imgmesas.png";
import VerFacturaMesero from "./verfacturamesero";

const FacturasMesero = () => {
  const { Column } = Table;
  const [mesas, setMesas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mesaPedidos, setMesaPedidos] = useState([]);
  const [facturaData, setFacturaData] = useState(null);
  const [modalFacturaVisible, setModalFacturaVisible] = useState(false);

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    try {
      const response = await fetch("projectdjangobakfebrero-production.up.railway.app/Mesas/ver_mesas/");
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de mesas.");
      }
      const data = await response.json();
      setMesas(data.mesas);
    } catch (error) {
      console.error("Error al obtener las mesas:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleMesaClick = async (idMesa) => {
    try {
      const response = await fetch(
        `projectdjangobakfebrero-production.up.railway.app/Mesero/mesero/mesa/${idMesa}/pedidos/`
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener los pedidos de la mesa.");
      }
      const data = await response.json();
      setMesaPedidos(data.pedidos_del_mesero);
      setSelectedMesa(idMesa);
      setModalVisible(true);
    } catch (error) {
      console.error("Error al obtener los pedidos de la mesa:", error);
    }
  };

  const handleVerFacturaClick = async (idPedido) => {
    try {
      const response = await fetch(
        `projectdjangobakfebrero-production.up.railway.app/Mesero/ver_factura/${idPedido}/`
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener la factura del pedido.");
      }
      const data = await response.json();
      setFacturaData(data);
      setModalFacturaVisible(true);
    } catch (error) {
      console.error("Error al obtener la factura del pedido:", error);
    }
  };

  const columns = [
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      render: (observacion, record) => (
        <>
          <Tooltip title="Mesa">
            <img
              src={imgmesas}
              alt="Mesas"
              style={{ width: 20, marginRight: 8 }}
            />
          </Tooltip>
          <a onClick={() => handleMesaClick(record.id_mesa)}>{observacion}</a>
        </>
      ),
    },
  ];

  return (
    <div>
      <Row justify="center">
        <Col span={20}>
          <Table dataSource={mesas} columns={columns} rowKey="id_mesa" />
          <Pagination
            current={currentPage}
            total={mesas.length}
            onChange={handlePageChange}
            pageSize={8}
            style={{ marginTop: "16px", textAlign: "center" }}
          />
        </Col>
      </Row>
      <Modal
        title={`Pedidos de la mesa ${selectedMesa}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Table dataSource={mesaPedidos} rowKey="id_pedido">
          <Column title="ID del Pedido" dataIndex="id_pedido" key="id_pedido" />
          <Column
            title="Fecha del Pedido"
            dataIndex="fecha_pedido"
            key="fecha_pedido"
          />
          <Column
            title="Acciones"
            key="acciones"
            render={(text, record) => (
              <Button onClick={() => handleVerFacturaClick(record.id_pedido)}>
                Ver Factura
              </Button>
            )}
          />
        </Table>
      </Modal>
      <Modal
        title={`Factura del pedido`}
        visible={modalFacturaVisible}
        onCancel={() => setModalFacturaVisible(false)}
        footer={null}
      >
        {facturaData && <VerFacturaMesero facturaData={facturaData} />}
      </Modal>
    </div>
  );
};

export default FacturasMesero;
