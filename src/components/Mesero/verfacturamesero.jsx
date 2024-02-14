import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { jsPDF } from "jspdf";
import diseño from "./res/diseño.png";

const VerFacturaMesero = ({ facturaData }) => {
  const [productos, setProductos] = useState([]);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [logoEmpresa, setLogoEmpresa] = useState(null);
  const [combos, setCombos] = useState([]);
  const [clienteData, setClienteData] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchEmpresaInfo();
    fetchCombos();
    fetchClienteData();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch("projectdjangobakfebrero-production.up.railway.app/producto/listar/");
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de productos.");
      }
      const data = await response.json();
      setProductos(data.productos);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  };

  const fetchCombos = async () => {
    try {
      const response = await fetch("projectdjangobakfebrero-production.up.railway.app/combos/ver_combos/");
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de combos.");
      }
      const data = await response.json();
      setCombos(data.combos);
    } catch (error) {
      console.error("Error al obtener la lista de combos:", error);
    }
  };

  const fetchEmpresaInfo = async () => {
    try {
      const response = await fetch(
        "projectdjangobakfebrero-production.up.railway.app/empresa/infoEmpresa/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mensaje: "Datos de la empresa",
          }),
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener la información de la empresa.");
      }
      const data = await response.json();
      setEmpresaInfo(data.empresa_info);
      if (data.empresa_info && data.empresa_info.elogo) {
        setLogoEmpresa(`data:image/png;base64,${data.empresa_info.elogo}`);
      }
    } catch (error) {
      console.error("Error al obtener la información de la empresa:", error);
    }
  };

  const fetchClienteData = async () => {
    try {
      const response = await fetch(
        "projectdjangobakfebrero-production.up.railway.app/cliente/ver_clientes/"
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de clientes.");
      }
      const data = await response.json();
      const cliente = data.clientes.find(
        (cliente) => cliente.id_cliente === facturaData.id_cliente
      );
      if (cliente) {
        setClienteData(cliente);
      }
    } catch (error) {
      console.error("Error al obtener la lista de clientes:", error);
    }
  };

  const generarFacturaPDF = () => {
    const doc = new jsPDF();
    const fontSize = 12; // Establece el tamaño de fuente deseado

    // Establece el tamaño de fuente para todo el documento
    doc.setFontSize(fontSize);
    doc.addImage(
      diseño,
      "PNG",
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight()
    );

    const columnWidths = [80, 30, 30, 30, 30];
    if (empresaInfo && empresaInfo.enombre && logoEmpresa) {
      const logoWidth = 30; // Ancho del logo
      const logoHeight = 30; // Alto del logo
      const logoPositionX = 10; // Posición X del logo
      const logoPositionY = 4; // Posición Y del logo
      doc.addImage(
        logoEmpresa,
        "JPEG",
        logoPositionX,
        logoPositionY,
        logoWidth,
        logoHeight
      );
      // Establece la posición del texto del nombre de la empresa al lado del logo
      const nombreEmpresaX = logoPositionX + logoWidth + 2; // Ajusta la distancia del texto al logo
      const nombreEmpresaY = logoPositionY + logoHeight / 3; // Centra verticalmente el texto con respecto al logo
      doc.setFont("helvetica", "bold"); // Establece el texto en negrita
      doc.setFontSize(16); // Tamaño de fuente más grande para el nombre de la empresa
      doc.text(empresaInfo.enombre, nombreEmpresaX, nombreEmpresaY);

      // Calcular la altura del texto del nombre de la empresa
      const nombreEmpresaHeight = fontSize / 2; // Suponiendo que la mitad del tamaño de la fuente es la altura del texto

      // Ajustar la posición de la dirección para que esté alineada verticalmente con el nombre de la empresa
      const direccionEmpresaX = nombreEmpresaX; // Misma posición X que el nombre de la empresa
      const direccionEmpresaY = nombreEmpresaY + nombreEmpresaHeight; // Alineado verticalmente con el nombre de la empresa
      doc.setFont("helvetica", "normal"); // Establece el texto en normal
      doc.setFontSize(12); // Tamaño de fuente más pequeño para la dirección
      doc.text(empresaInfo.direccion, direccionEmpresaX, direccionEmpresaY);

      // Ajustar la posición del número de teléfono debajo de la dirección
      const telefonoEmpresaX = direccionEmpresaX; // Misma posición X que la dirección
      const telefonoEmpresaY = direccionEmpresaY + fontSize / 2; // Alineado verticalmente debajo de la dirección
      doc.setFont("helvetica", "normal"); // Establece el texto en normal
      doc.text(
        `Teléfono: ${empresaInfo.etelefono}`,
        telefonoEmpresaX,
        telefonoEmpresaY
      );

      // Agregar una línea divisoria debajo del número de teléfono
      const lineY = telefonoEmpresaY + 5; // Ajusta la posición de la línea debajo del texto del teléfono
      doc.setLineWidth(0.5); // Establece el ancho de la línea
      doc.line(telefonoEmpresaX, lineY, telefonoEmpresaX + 50, lineY); // Dibuja la línea
      doc.setFontSize(12); // Restaura el tamaño de fuente

      // Agregar el nombre del cliente debajo del logo de la empresa
      if (clienteData) {
        const clienteNombreY = lineY + 10; // Ajustar la posición verticalmente debajo de la línea
        doc.setFont("helvetica", "bold"); // Establece el texto en negrita
        doc.text(
          `Cliente: ${clienteData.crazon_social}`,
          logoPositionX,
          clienteNombreY
        );
      }
    }
    doc.setFont("helvetica", "bold");
    doc.text(`Fecha de Emisión: ${facturaData.fecha_emision}`, 10, 70);
    let yPos = 80;
    const headers = [
      "Descripción",
      "Cantidad",
      "P.Unitario",
      "Descuento",
      "Valor",
    ];
    headers.forEach((header, index) => {
      doc.setFont("helvetica", "bold");
      doc.text(
        header,
        10 +
          columnWidths.slice(0, index).reduce((acc, width) => acc + width, 0),
        yPos
      );
    });
    yPos += 10;
    facturaData.detalles_factura.forEach((detalle) => {
      const producto = productos.find(
        (producto) => producto.id_producto === detalle.id_producto_id
      );
      const combo = combos.find(
        (combo) => combo.id_combo === detalle.id_combo_id
      );
      if (producto || combo) {
        const descripcion =
          producto?.nombreproducto ||
          combo?.nombrecb ||
          "Descripción no disponible";
        const fila = [
          descripcion.length > 30
            ? descripcion.substring(0, 30) + "..."
            : descripcion,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.descuento,
          detalle.valor,
        ];
        fila.forEach((item, index) => {
          doc.setFont("helvetica", "normal");
          if (index === 0 && descripcion.length > 30) {
            doc.setFontSize(8);
          } else {
            doc.setFontSize(fontSize); // Establece el mismo tamaño de fuente
          }
          doc.text(
            item.toString(),
            10 +
              columnWidths
                .slice(0, index)
                .reduce((acc, width) => acc + width, 0),
            yPos
          );
        });
        yPos += 10;
      }
    });
    doc.setFont("helvetica", "bold");
    // Después de agregar el texto del total
    doc.text(`Total: ${facturaData.total}`, 10, yPos + 10);
    // Agregar el tipo de pedido y el método de pago debajo del total
    doc.text(
      `Tipo de Pedido: ${obtenerTipoDePedido(facturaData.tipo_de_pedido)}`,
      10,
      yPos + 20
    );
    doc.text(
      `Método de Pago: ${obtenerMetodoDePago(facturaData.metodo_de_pago)}`,
      10,
      yPos + 30
    );

    doc.save("factura.pdf");
  };

  const columns = [
    {
      title: "Descripción",
      dataIndex: "id_producto_id",
      key: "descripcion",
      render: (id_producto_id, record) => {
        const producto = productos.find(
          (producto) => producto.id_producto === id_producto_id
        );
        if (producto) {
          return producto.nombreproducto;
        } else {
          const combo = combos.find(
            (combo) => combo.id_combo === record.id_combo_id
          );
          return combo ? combo.nombrecb : "Descripción no disponible";
        }
      },
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Precio Unitario",
      dataIndex: "precio_unitario",
      key: "precio_unitario",
    },
    {
      title: "Descuento",
      dataIndex: "descuento",
      key: "descuento",
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },
  ];

  const obtenerTipoDePedido = (inicial) => {
    switch (inicial) {
      case "D":
        return "A domicilio";
      case "R":
        return "A retirar";
      case "L":
        return "En local";
      default:
        return "";
    }
  };

  const obtenerMetodoDePago = (inicial) => {
    switch (inicial) {
      case "E":
        return "En efectivo";
      case "T":
        return "Transferencia";
      case "X":
        return "Tarjeta";
      case "F":
        return "Fraccionado";
      default:
        return "";
    }
  };

  // Dentro del componente
  return (
    <div>
      <h3>Fecha de Emisión: {facturaData.fecha_emision}</h3>
      {clienteData && <h3>Cliente: {clienteData.crazon_social}</h3>}
      <h3>Total: {facturaData.total}</h3>
      <h3>Tipo de Pedido: {obtenerTipoDePedido(facturaData.tipo_de_pedido)}</h3>
      <h3>Método de Pago: {obtenerMetodoDePago(facturaData.metodo_de_pago)}</h3>
      <Button type="primary" onClick={generarFacturaPDF}>
        Generar Factura
      </Button>
      <Table
        dataSource={facturaData.detalles_factura}
        columns={columns}
        rowKey="id_detallefactura"
      />
    </div>
  );
};

export default VerFacturaMesero;
