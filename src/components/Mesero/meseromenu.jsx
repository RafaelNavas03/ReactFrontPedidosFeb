import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, Image, Avatar, Card, Badge, Watermark } from "antd";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Dropdown,
  Offcanvas,
} from "react-bootstrap";
import MenuM from "./menu";

const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Meta } = Card;

const MenuMesero = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [sucursalesInfo, setSucursalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const obtenerInformacionEmpresa = async () => {
    try {
      const respuesta = await fetch(
        "https://projectdjangobakfebrero-production.up.railway.app/empresa/infoEmpresa/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      console.log();
      const datos = await respuesta.json();
      console.log(datos.empresa_info);
      setEmpresaInfo(datos.empresa_info);
      setLoading(false);
      fetch("https://projectdjangobakfebrero-production.up.railway.app/sucursal/sucusarleslist/")
        .then((response) => response.json())
        .then((data) => {
          console.log(data.sucursales);
          setSucursalesData(data.sucursales);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al obtener los datos de sucursales:", error);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error al obtener la información de la empresa:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerInformacionEmpresa();
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSubMenuClick = (key) => {
    setSelectedSubMenu(key);
  };

  const handleClearLocalStorage = () => {
    window.location.href = "/";
    localStorage.clear();

    console.log("LocalStorage limpiado.");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://projectdjangobakfebrero-production.up.railway.app/Login/rol/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rol = data.rol;

          if (rol !== "M") {
            window.location.href = "/";
          }
        } else {
          // Manejar errores de la solicitud a la API
          window.location.href = "/";
        }
      } catch (error) {
        // Manejar errores de la solicitud
        console.error("Error en la solicitud:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "#DBE3E3", padding: "0.5%" }}>
        <Navbar
          expand="lg"
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            borderRadius: "10px",
          }}
        >
          <Container fluid>
            <Navbar.Brand href="/homemesero">
              {empresaInfo && empresaInfo.elogo && (
                <img
                  src={`data:image/png;base64,${empresaInfo.elogo}`}
                  width={50}
                  style={{ borderRadius: "50%" }}
                />
              )}
              <strong style={{ fontWeight: "bold", fontSize: "15px" }}>
                {" "}
                CONTROL MESERO
              </strong>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "100px" }}
                navbarScroll
              ></Nav>
              <Form className="d-flex">
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon={<UserOutlined />}
                    />
                    <strong style={{ fontWeight: "bold", fontSize: "10.5px" }}>
                      {" "}
                      Perfil
                    </strong>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      href="#/action-1"
                      onClick={handleClearLocalStorage}
                    >
                      Salir
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Row>
          <Col md={3}>
            {empresaInfo && sucursalesInfo && (
              <Card
                hoverable
                style={{ width: "100%", margin: "16px" }}
                cover={
                  empresaInfo.elogo ? (
                    <Image
                      alt={empresaInfo.enombre}
                      src={`data:image/png;base64,${empresaInfo.elogo}`}
                      style={{ margin: "10%", width: "60%" }}
                    />
                  ) : (
                    <>
                      <Watermark content={[empresaInfo.enombre, "Sin logo"]}>
                        <div
                          style={{
                            width: "100%",
                            height: "200px",
                            overflow: "hidden",
                            backgroundColor: "#ffff",
                          }}
                        />
                      </Watermark>
                    </>
                  )
                }
                className="text-center"
              >
                <div
                  style={{
                    background: "#4CAF50",
                    padding: "5%",
                    borderRadius: "10px",
                  }}
                >
                  <Meta title={empresaInfo.enombre} />
                </div>
                <br />
                <Meta
                  style={{ fontSize: "13px", fontWeight: "bold" }}
                  description={empresaInfo.eslogan}
                />
                <br />
                <p style={{ fontSize: "13px", fontWeight: "bold" }}>
                  Dirección:{" "}
                </p>
                <Meta
                  style={{ fontSize: "13px", fontWeight: "bold" }}
                  description={empresaInfo.direccion}
                />
                <br />
                <p style={{ fontSize: "13px", fontWeight: "bold" }}>
                  Telefono:{" "}
                </p>
                <Meta
                  style={{ fontSize: "13px", fontWeight: "bold" }}
                  description={empresaInfo.etelefono}
                />
                <br />
                <p style={{ fontSize: "13px", fontWeight: "bold" }}>
                  Correo electronico:{" "}
                </p>
                <Meta
                  style={{ fontSize: "13px", fontWeight: "bold" }}
                  description={empresaInfo.correoelectronico}
                />
                <br />
                Sucursales:{" "}
                <Badge count={sucursalesInfo.length} showZero color="#faad14" />
                . Empleados:{" "}
                <Badge count={empresaInfo.empleados} showZero color="#06CE15" />
              </Card>
            )}
          </Col>
          <Col md={9}>
            <Card
              hoverable
              style={{
                height: "96%",
                width: "100%",
                margin: "16px",
                marginLeft: "2px",
                marginBottom: "16px",
                cursor: "default",
              }}
              className="text-center"
            >
              <MenuM />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MenuMesero;