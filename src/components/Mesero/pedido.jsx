import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Avatar,
  Select,
  Pagination,
  Input,
  notification,
} from "antd";
import { ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const RealizarPedidoMesa = ({ visible, onClose, idMesa }) => {
  const [form] = Form.useForm();
  const [resetForm, setResetForm] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cantidadProductos, setCantidadProductos] = useState({});
  const [cantidadCombos, setCantidadCombos] = useState({});
  const [precioUnitario, setPrecioUnitario] = useState({});
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [currentComboPage, setCurrentComboPage] = useState(1);
  const productPageSize = 3;
  const comboPageSize = 3;

  useEffect(() => {
    fetch("https://projectdjangobakfebrero-production.up.railway.app/cliente/ver_clientes/")
      .then((response) => response.json())
      .then((data) => setClientes(data.clientes))
      .catch((error) => console.error("Error fetching clientes:", error));

    fetch("https://projectdjangobakfebrero-production.up.railway.app/producto/listar/")
      .then((response) => response.json())
      .then((data) => setProductos(data.productos))
      .catch((error) => console.error("Error fetching productos:", error));

    fetch("https://projectdjangobakfebrero-production.up.railway.app/combos/ver_combos/")
      .then((response) => response.json())
      .then((data) => setCombos(data.combos))
      .catch((error) => console.error("Error fetching combos:", error));
  }, []);

  useEffect(() => {
    if (resetForm) {
      form.resetFields();
      setResetForm(false);

      // Restablecer valores específicos
      setClienteSeleccionado(null);
      setCantidadProductos({});
      setCantidadCombos({});
      setPrecioUnitario({});
    }
  }, [resetForm]);

  const totalPedido =
  Object.keys(cantidadProductos).reduce((total, idProducto) => {
    const cantidad = cantidadProductos[idProducto];
    const precioUnitarioProducto = precioUnitario[idProducto] || 0;
    console.log(`Producto ${idProducto}: cantidad = ${cantidad}, precio unitario = ${precioUnitarioProducto}`);
    return total + cantidad * precioUnitarioProducto;
  }, 0) +
  Object.keys(cantidadCombos).reduce((total, idCombo) => {
    const cantidad = cantidadCombos[idCombo];
    const combo = combos.find((c) => c.id_combo === parseInt(idCombo));
    if (combo) {
      console.log(`Combo ${idCombo}: cantidad = ${cantidad}, precio unitario = ${combo.preciounitario}`);
      return total + cantidad * combo.preciounitario;
    }
    return total;
  }, 0);

console.log(`Total pedido: ${totalPedido}`);


  const columnsProductos = [
    {
      title: "Nombre",
      dataIndex: "nombreproducto",
      key: "nombreproducto",
    },
    {
      title: "Precio",
      dataIndex: "preciounitario",
      key: "preciounitario",
    },
    {
      title: "Puntos",
      dataIndex: "puntosp",
      key: "puntosp",
    },
    {
      title: "Imagen",
      dataIndex: "imagenp",
      key: "imagenp",
      render: (text) => (
        <Avatar
          src={`data:image/jpeg;base64,${text}`}
          size={64}
          shape="square"
        />
      ),
    },
    {
      title: "Cantidad",
      dataIndex: "id_producto",
      key: "cantidad",
      render: (idProducto) => (
        <Input
          type="number"
          min={0}
          value={cantidadProductos[idProducto] || 0}
          onChange={(e) => handleCantidadChange(idProducto, e.target.value)}
        />
      ),
    },
  ];

  const columnsCombos = [
    // Columnas para la tabla de combos
    {
      title: "Nombre",
      dataIndex: "nombrecb",
      key: "nombrecb",
    },
    {
      title: "Precio",
      dataIndex: "preciounitario",
      key: "preciounitario",
    },
    {
      title: "Imagen",
      dataIndex: "imagen",
      key: "imagen",
      render: (text) => (
        <Avatar
          src={`data:image/jpeg;base64,${text}`}
          size={64}
          shape="square"
        />
      ),
    },
    {
      title: "Cantidad",
      dataIndex: "id_combo",
      key: "cantidad",
      render: (idCombo) => (
        <Input
          type="number"
          min={0}
          value={cantidadCombos[idCombo] || 0}
          onChange={(e) => handleCantidadChangeCombo(idCombo, e.target.value)}
        />
      ),
    },
  ];

  const handleCantidadChangeCombo = (idCombo, cantidad) => {
    setCantidadCombos((prevCantidadCombos) => ({
      ...prevCantidadCombos,
      [idCombo]: cantidad,
    }));

    const combo = combos.find((c) => c.id_combo === parseInt(idCombo));
    if (combo) {
      setPrecioUnitario((prevPrecioUnitario) => ({
        ...prevPrecioUnitario,
        [idCombo]: combo.preciounitario,
      }));
    }
  };

  const handleCantidadChange = (idProducto, cantidad) => {
    setCantidadProductos((prevCantidadProductos) => ({
      ...prevCantidadProductos,
      [idProducto]: cantidad,
    }));

    const producto = productos.find(
      (p) => p.id_producto === parseInt(idProducto)
    );
    if (producto) {
      setPrecioUnitario((prevPrecioUnitario) => ({
        ...prevPrecioUnitario,
        [idProducto]: producto.preciounitario,
      }));
    }
  };

  const handleSelectCliente = (cliente) => {
    if (
      clienteSeleccionado &&
      clienteSeleccionado.id_cliente === cliente.id_cliente
    ) {
      setClienteSeleccionado(null);
    } else {
      setClienteSeleccionado(cliente);
      console.log("Cliente seleccionado:", cliente.id_cliente);
      form.setFieldsValue({ id_cliente: cliente.id_cliente });
    }
  };

  const handlePedidoSubmit = async (values) => {
    try {
      // Validar que al menos un producto o combo tenga una cantidad mayor que cero
      const hasNonZeroQuantity =
        Object.values(cantidadProductos).some((cantidad) => cantidad > 0) ||
        Object.values(cantidadCombos).some((cantidad) => cantidad > 0);

      if (!hasNonZeroQuantity) {
        notification.error({
          message: "Error",
          description: "Debe agregar al menos un producto o combo al pedido.",
        });
        return;
      }
      const detalles_pedido = {
        detalles_pedido: [
          ...Object.keys(cantidadProductos).map((idProducto) => ({
            id_producto: parseInt(idProducto),
            cantidad: cantidadProductos[idProducto],
            precio_unitario: precioUnitario[idProducto] || 0,
            impuesto: 2.5,
            descuento: 0.5,
          })),
          ...Object.keys(cantidadCombos).map((idCombo) => ({
            id_combo: parseInt(idCombo),
            cantidad: cantidadCombos[idCombo],
            precio_unitario: combos.find(
              (c) => c.id_combo === parseInt(idCombo)
            ).preciounitario,
            impuesto: 2.5,
            descuento: 0.5,
          })),
        ],
      };

      const totalPedido =
        Object.keys(cantidadProductos).reduce((total, idProducto) => {
          const cantidad = cantidadProductos[idProducto];
          const precioUnitarioProducto = precioUnitario[idProducto] || 0;
          return total + cantidad * precioUnitarioProducto;
        }, 0) +
        Object.keys(cantidadCombos).reduce((total, idCombo) => {
          const cantidad = cantidadCombos[idCombo];
          const combo = combos.find((c) => c.id_combo === parseInt(idCombo));
          if (combo) {
            return total + cantidad * combo.preciounitario;
          }
          return total;
        }, 0);

      const formData = new FormData();
      formData.append("id_mesa", idMesa);
      formData.append("id_cliente", values.id_cliente);
      formData.append("tipo_de_pedido", "L");
      formData.append("metodo_de_pago", values.metodo_de_pago);
      formData.append("puntos", 3);
      formData.append("fecha_pedido", dayjs().format());
      formData.append("fecha_entrega", "2024-01-30 20:00:00");
      formData.append("estado_del_pedido", "O");
      formData.append("observacion_del_cliente", "Nada");
      formData.append("total_pedido", totalPedido);

      const detallesPedidoString = JSON.stringify(detalles_pedido);
      formData.append("detalles_pedido", detallesPedidoString);

      const response = await fetch(
        "https://projectdjangobakfebrero-production.up.railway.app/Mesero/tomar_pedido/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        notification.success({
          message: "Éxito",
          description: "Pedido realizado exitosamente",
        });

        console.log(data.mensaje);
        // Limpiar todo el formulario
        form.resetFields();

        // Restablecer valores específicos
        setClienteSeleccionado(null);
        setCantidadProductos({});
        setCantidadCombos({});
        setPrecioUnitario({});

        onClose();
      } else {
        const errorData = await response.json();
        notification.error({
          message: "Error",
          description: errorData.error,
        });
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error al enviar el pedido:" + error);
    }
  };

  const onFinish = (values) => {
    handlePedidoSubmit(values);

    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="Realizar Pedido"
      onCancel={onClose}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={async () => {
            await form.submit();
            setResetForm(true);
          }}
        >
          <ShoppingOutlined /> Realizar Pedido
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item label="Cliente" name="id_cliente">
          <Select
            placeholder="Selecciona un cliente"
            style={{ width: "100%" }}
            onChange={(value, option) => handleSelectCliente(option.data)}
            value={
              clienteSeleccionado ? clienteSeleccionado.id_cliente : undefined
            }
          >
            {clientes.map((cliente) => (
              <Option
                key={cliente.id_cliente}
                value={cliente.id_cliente}
                data={cliente}
              >
                {`${cliente.snombre} ${cliente.capellido}`}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Método de pago" name="metodo_de_pago">
          <Select
            placeholder="Selecciona el método de pago"
            style={{ width: "100%" }}
          >
            <Option value="E">En efectivo</Option>
            <Option value="T">Transferencia</Option>
            <Option value="X">Tarjeta</Option>
            <Option value="F">Fraccionado</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Fecha de pedido"
          name="fecha_pedido"
          initialValue={dayjs().format("YYYY-MM-DD HH:mm:ss")}
        >
          <Input readOnly />
        </Form.Item>
        <h3>Productos</h3> {/* Nuevo título para la sección de productos */}
        <Table
          dataSource={productos.slice(
            (currentProductPage - 1) * productPageSize,
            currentProductPage * productPageSize
          )}
          columns={columnsProductos}
          rowKey="id_producto"
          pagination={{
            current: currentProductPage,
            pageSize: productPageSize,
            total: productos.length,
            onChange: (page) => setCurrentProductPage(page),
          }}
        />
        <h3>Combos</h3> {/* Nuevo título para la sección de combos */}
        <Table
          dataSource={combos.slice(
            (currentComboPage - 1) * comboPageSize,
            currentComboPage * comboPageSize
          )}
          columns={columnsCombos}
          rowKey="id_combo"
          pagination={{
            current: currentComboPage,
            pageSize: comboPageSize,
            total: combos.length,
            onChange: (page) => setCurrentComboPage(page),
          }}
        />
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <strong>Total del Pedido: ${totalPedido.toFixed(2)}</strong>
        </div>
      </Form>
    </Modal>
  );
};
export default RealizarPedidoMesa;
