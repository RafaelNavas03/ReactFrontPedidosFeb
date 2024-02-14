import React, { useState, useEffect } from "react";
import { Modal, Table, Row, Col, Tooltip, Pagination, Button } from "antd";
import {
  SmileOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  TableOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import RealizarPedidoMesa from "./pedido";

const RealizarPedidoMesero = () => {
  const [mesas, setMesas] = useState([]);
  const [selectedOpcion, setSelectedOpcion] = useState("Mesas");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [MesaEnv, setMesaEnv] = useState("");

  useEffect(() => {
    fetch("projectdjangobakfebrero-production.up.railway.app/Mesas/ver_mesas/")
      .then((response) => response.json())
      .then((data) => {
        const filteredMesas = data.mesas.filter(
          (mesa) =>
            mesa.estado === "U" || mesa.estado === "A" || mesa.estado === "R"
        );
        setMesas(filteredMesas);
        setTotal(filteredMesas.length);
      })
      .catch((error) => console.error("Error al obtener las mesas:", error));
  }, []);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTomarPedido = (mesaId) => {
    console.log(`Tomar pedido para la mesa con ID ${mesaId}`);
    setMesaEnv(mesaId);
    setModalVisible(true);
  };

  const renderEstadoIcon = (estado) => {
    switch (estado) {
      case "D":
        return <SmileOutlined style={{ color: "green" }} />;
      case "R":
        return <ClockCircleOutlined style={{ color: "orange" }} />;
      case "U":
        return <UserOutlined style={{ color: "blue" }} />;
      case "A":
        return <CheckCircleOutlined style={{ color: "cyan" }} />;
      default:
        return <TableOutlined style={{ color: "gray" }} />;
    }
  };

  const renderEstadoText = (estado) => {
    switch (estado) {
      case "D":
        return "Disponible";
      case "R":
        return "Reservada";
      case "U":
        return "En uso";
      case "A":
        return "Atendida";
      default:
        return "";
    }
  };

  const transparentButtonStyle = {
    background: "transparent",
    border: "none",
    color: "#1890ff",
    transition: "box-shadow 0.3s ease-out",
  };

  const columns = [
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado, record) => (
        <Tooltip title={renderEstadoText(estado)}>
          {renderEstadoIcon(estado)} {renderEstadoText(estado)}
        </Tooltip>
      ),
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      render: (observacion, record) => (
        <>
          <Tooltip title="Mesa">
            <TableOutlined style={{ color: "gray", marginRight: 8 }} />
          </Tooltip>
          {observacion}
        </>
      ),
    },
    {
      title: "Max Personas",
      dataIndex: "max_personas",
      key: "max_personas",
    },
    {
      title: "Tomar Pedido",
      dataIndex: "id_mesa",
      key: "tomarPedido",
      render: (mesaId) => (
        <Button
          style={transparentButtonStyle}
          icon={<ShoppingOutlined />}
          onClick={() => handleTomarPedido(mesaId)}
        >
          Tomar Pedido
        </Button>
      ),
    },
  ];

  return (
    <div>
      {selectedOpcion === "Mesas" && (
        <Row justify="center">
          <Col span={20}>
            <Table dataSource={mesas} columns={columns} rowKey="id_mesa" />
            <Pagination
              current={currentPage}
              total={total}
              onChange={handlePageChange}
              pageSize={8}
              style={{ marginTop: "16px", textAlign: "center" }}
            />
          </Col>
        </Row>
      )}
      <RealizarPedidoMesa
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        idMesa={MesaEnv}
      />
    </div>
  );
};

export default RealizarPedidoMesero;
