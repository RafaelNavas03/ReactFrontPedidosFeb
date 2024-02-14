import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Select,
  InputNumber,
  Table,
  message,
  notification,
} from "antd";

const { Option } = Select;

const RealizarPedido = ({ visible, onClose, bodega }) => {
  const [proveedores, setProveedores] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [productos, setProductos] = useState([]);
  const [componentes, setComponentes] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriaId, setCategoriaId] = useState(null);
  const [form] = Form.useForm();
  const [pedidoItems, setPedidoItems] = useState([]);

  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const responseProveedores = await fetch(
          "projectdjangobakfebrero-production.up.railway.app/Proveedores/listar_proveedor/"
        );
        const dataProveedores = await responseProveedores.json();
        setProveedores(dataProveedores.proveedores);
      } catch (error) {
        console.error("Error al obtener la lista de proveedores:", error);
      }
    };

    const obtenerUnidadesMedida = async () => {
      try {
        const responseUnidadesMedida = await fetch(
          "projectdjangobakfebrero-production.up.railway.app/producto/listarum/"
        );
        const dataUnidadesMedida = await responseUnidadesMedida.json();
        setUnidadesMedida(dataUnidadesMedida.unidades_medida);
      } catch (error) {
        console.error(
          "Error al obtener la lista de unidades de medida:",
          error
        );
      }
    };

    const obtenerProductos = async () => {
      try {
        const responseProductos = await fetch(
          "projectdjangobakfebrero-production.up.railway.app/producto/listar/"
        );
        const dataProductos = await responseProductos.json();
        setProductos(dataProductos.productos);
      } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
      }
    };

    const obtenerComponentes = async () => {
      try {
        const responseComponentes = await fetch(
          "projectdjangobakfebrero-production.up.railway.app/producto/listarcomponentes/"
        );
        const dataComponentes = await responseComponentes.json();
        setComponentes(dataComponentes.componentes);
      } catch (error) {
        console.error("Error al obtener la lista de componentes:", error);
      }
    };

    obtenerProveedores();
    obtenerUnidadesMedida();
    obtenerProductos();
    obtenerComponentes();
  }, []);

  const handleTipoSeleccionadoChange = (value) => {
    setTipoSeleccionado(value);
    listarp(value === "producto" ? 1 : 2);
  };

  const listarp = async (id_tipoproducto) => {
    setLoading(true);
    try {
      let url = "projectdjangobakfebrero-production.up.railway.app/producto/listar_categorias/";

      const responseCategorias = await fetch(url);
      const data = await responseCategorias.json();

      if (data && Array.isArray(data.categorias)) {
        const categoriasFiltradas = id_tipoproducto
          ? data.categorias.filter(
              (categoria) =>
                categoria.id_tipoproducto.id_tipoproducto === id_tipoproducto
            )
          : data.categorias;

        setCategorias(data.categorias);
        setCategoriaId(categoriasFiltradas[0]?.id_categoria);
      } else {
        message.error("La respuesta de la API no tiene el formato esperado.");
      }
    } catch (error) {
      message.error("Hubo un error al realizar la solicitud" + error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    if (tipoSeleccionado === "producto") {
      return productos.filter((producto) =>
        categoriaSeleccionada
          ? producto.id_categoria === categoriaSeleccionada
          : true
      );
    } else if (tipoSeleccionado === "componente") {
      return componentes.filter((componente) =>
        categoriaSeleccionada
          ? componente.id_categoria.id_categoria === categoriaSeleccionada
          : true
      );
    }
    return [];
  };

  useEffect(() => {
    setFilteredData(filterData());
  }, [tipoSeleccionado, categoriaSeleccionada, productos, componentes]);

  const columnp = [
    { title: "ID", dataIndex: "id_producto", key: "id" },
    {
      title: "Nombre",
      dataIndex: "nombreproducto",
      key: "nombre",
    },
    { title: "Categoría", dataIndex: "categoria", key: "categoria" },
  ];

  const columnc = [
    { title: "ID", dataIndex: "id_producto", key: "id" },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    { title: "Categoría", dataIndex: "categoria", key: "categoria" },
  ];

  const columnsPedidoItems = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      render: (text, record) => (
        <InputNumber
          min={1}
          defaultValue={1}
          onChange={(value) => handleCantidadChange(record, value)}
        />
      ),
    },
    {
      title: "Costo",
      dataIndex: "costo",
      key: "costo",
      render: (text, record) => (
        <InputNumber
          min={0}
          step={0.01}
          defaultValue={0}
          onChange={(value) => handleCostoChange(record, value)}
        />
      ),
    },
    {
      title: "Unidad de Medida",
      dataIndex: "unidadMedida",
      key: "unidadMedida",
      render: (text, record) => (
        <Select
          style={{ width: "100%" }}
          placeholder="Seleccione una unidad"
          onChange={(value) => handleUnidadMedidaChange(record, value)}
        >
          {unidadesMedida.map((um) => (
            <Option key={um.id_um} value={um.id_um}>
              {um.nombre_um}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      render: (text, record) => (
        <span>
          {tipoSeleccionado === "producto" ? "Producto" : "Componente"}
        </span>
      ),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      render: (text, record) => (
        <Button type="danger" onClick={() => handleEliminarPedidoItem(record)}>
          Eliminar
        </Button>
      ),
    },
  ];

  const handleEliminarPedidoItem = (record) => {
    const newPedidoItems = pedidoItems.filter((item) => item.id !== record.id);
    setPedidoItems(newPedidoItems);
  };

  const handleAgregarPedido = (record) => {
    const exists = pedidoItems.some(
      (item) =>
        item.id === record.id_componente || item.id === record.id_producto
    );

    if (!exists) {
      const nuevoItem = {
        id:
          tipoSeleccionado === "componente"
            ? record.id_componente
            : record.id_producto,
        nombre:
          tipoSeleccionado === "componente"
            ? record.nombre
            : record.nombreproducto,
        cantidad: 1,
        costo: 0, // Valor predeterminado del costo
        tipo: tipoSeleccionado,
      };
      setPedidoItems([...pedidoItems, nuevoItem]);
    } else {
      message.warning("El producto o componente ya ha sido agregado.");
    }
  };

  const handleUnidadMedidaChange = (record, unidadMedida) => {
    const index = pedidoItems.findIndex((item) => item.id === record.id);
    if (index !== -1) {
      const newPedidoItems = [...pedidoItems];
      newPedidoItems[index].unidadMedida = unidadMedida;
      setPedidoItems(newPedidoItems);
    }
  };

  const handleCostoChange = (record, costo) => {
    const index = pedidoItems.findIndex(
      (item) =>
        item.id ===
        (tipoSeleccionado === "componente"
          ? record.id_componente
          : record.id_producto)
    );
    if (index !== -1) {
      const newPedidoItems = [...pedidoItems];
      newPedidoItems[index].costo = costo;
      setPedidoItems(newPedidoItems);
    }
  };
  const handleCantidadChange = (record, cantidad) => {
    console.log("Enviando cantidad: " + cantidad);
    console.log(record);
    console.log(pedidoItems);
    const index = pedidoItems.findIndex((item) => item.id === record.id);
    if (index !== -1) {
      console.log("Index: " + index);
      const newPedidoItems = [...pedidoItems];
      newPedidoItems[index].cantidad = cantidad;
      setPedidoItems(newPedidoItems);
    }
  };

  const handlePedidoSubmit = async (values) => {
    try {
      // Construir el objeto detalles_pedido con los datos necesarios
      const detalles_pedido = pedidoItems.map((item) => {
        if (item.tipo == "componente") {
          return {
            id_producto: "",
            id_componente: item.id,
            cantidad_pedido: item.cantidad,
            costo_unitario: item.costo,
            id_um: item.unidadMedida,
            stock_minimo: 20,
          };
        }
        if (item.tipo == "producto") {
          return {
            id_producto: item.id,
            id_componente: "",
            cantidad_pedido: item.cantidad,
            costo_unitario: item.costo,
            id_um: item.unidadMedida,
            stock_minimo: 20, // Ajusta el valor según tus necesidades
          };
        }
      });
      console.log("Lo que se solicita:");
      console.log(detalles_pedido);
      const formData = new FormData();
      formData.append("id_proveedor", values.id_proveedor);
      formData.append("fecha_pedido", values.fecha_pedido);
      formData.append("fecha_entrega_esperada", values.fecha_entrega_esperada);
      formData.append("observacion_pedido", values.observacion_pedido);
      formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
      console.log("Bodega:");
      console.log(bodega);
      const response = await fetch(
        "projectdjangobakfebrero-production.up.railway.app/Inventario/crearinventario/" +
          bodega.id_bodega +
          "/",
        {
          method: "POST",
          body: formData,
        }
      );

      // Manejar la respuesta de la API
      if (response.ok) {
        notification.success({
          message: "Éxito",
          description: "Inventario registrado exitosamente",
        });
        setPedidoItems([]);
        console.log(data.mensaje); // Imprimir la respuesta en la consola
        onClose(); // Cerrar el modal u realizar otras acciones necesarias
      } else {
        const errorData = await response.json();
        notification.error({
          message: "Éxito",
          description: errorData.error,
        });
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error al enviar el pedido:" + error);
      // Manejar el error, mostrar un mensaje al usuario, etc.
    }
  };

  const onFinish = (values) => {
    handlePedidoSubmit(values);

    onClose();
  };

  return (
    <Modal
      title="Registrar inventario"
      visible={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Enviar Pedido
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Proveedor"
          name="id_proveedor"
          rules={[{ required: true, message: "Seleccione un proveedor" }]}
        >
          <Select placeholder="Seleccione un proveedor">
            {proveedores.map((proveedor) => (
              <Option
                key={proveedor.id_proveedor}
                value={proveedor.id_proveedor}
              >
                {proveedor.nombreproveedor}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Tipo de Pedido" name="tipo_pedido">
          <Select
            placeholder="Seleccione el tipo de pedido"
            onChange={handleTipoSeleccionadoChange}
          >
            <Option value="producto">Producto</Option>
            <Option value="componente">Componente</Option>
          </Select>
        </Form.Item>

        {tipoSeleccionado && (
          <Form.Item label="Categoría" name="categoria_pedido">
            <Select
              placeholder="Seleccione una categoría"
              onChange={(value) => setCategoriaSeleccionada(value)}
            >
              {categorias.map((categoria) => (
                <Option
                  key={categoria.id_categoria}
                  value={categoria.id_categoria}
                >
                  {categoria.catnombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {tipoSeleccionado === "componente" && (
          <Table
            dataSource={filteredData}
            columns={[
              ...columnc,
              {
                title: "Agregar",
                dataIndex: "id_producto",
                key: "agregar",
                render: (text, record) => (
                  <Button
                    type="primary"
                    onClick={() => handleAgregarPedido(record)}
                  >
                    Agregar
                  </Button>
                ),
              },
            ]}
            pagination={{ pageSize: 5 }}
            rowKey="id"
          />
        )}
        {tipoSeleccionado === "producto" && (
          <Table
            dataSource={filteredData}
            columns={[
              ...columnp,
              {
                title: "Agregar",
                dataIndex: "id_producto",
                key: "agregar",
                render: (text, record) => (
                  <Button
                    type="primary"
                    onClick={() => handleAgregarPedido(record)}
                  >
                    Agregar
                  </Button>
                ),
              },
            ]}
            pagination={{ pageSize: 5 }}
            rowKey="id"
          />
        )}
        <div className="table-responsive">
          <Table
            dataSource={pedidoItems}
            columns={columnsPedidoItems}
            pagination={false}
            rowKey="id_producto"
          />
        </div>
      </Form>
    </Modal>
  );
};

export default RealizarPedido;
