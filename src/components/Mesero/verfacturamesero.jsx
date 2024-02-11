import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { jsPDF } from "jspdf";

const VerFacturaMesero = ({ facturaData }) => {
  const [productos, setProductos] = useState([]);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [logoEmpresa, setLogoEmpresa] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchEmpresaInfo();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/producto/listar/");
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de productos.");
      }
      const data = await response.json();
      setProductos(data.productos);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  };

  const fetchEmpresaInfo = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/empresa/infoEmpresa/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensaje: "Datos de la empresa",
        }),
      });
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

  const generarFacturaPDF = () => {
    const doc = new jsPDF();

    // Definir el ancho de cada columna
    const columnWidths = [80, 30, 30, 30, 30];

    // Agregar el nombre de la empresa y su logo al PDF
    if (empresaInfo && empresaInfo.enombre && logoEmpresa) {
      doc.addImage(logoEmpresa, "JPEG", 10, 10, 30, 30); // Agregar el logo
      doc.text(empresaInfo.enombre, 70, 30);
    }

    // Agregar "Fecha de Emisión" en negrita
    doc.setFont("helvetica", "bold");
    doc.text(`Fecha de Emisión: ${facturaData.fecha_emision}`, 10, 70);

    // Definir la posición inicial para agregar contenido
    let yPos = 80;

    // Agregar los encabezados de la tabla al PDF
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
    yPos += 10; // Incrementar la posición para la siguiente fila

    // Agregar los datos de la factura al PDF
    facturaData.detalles_factura.forEach((detalle) => {
      const producto = productos.find(
        (producto) => producto.id_producto === detalle.id_producto_id
      );
      if (producto) {
        // Ajustar el tamaño del texto para la descripción del producto
        const descripcion =
          producto.nombreproducto.length > 30
            ? producto.nombreproducto.substring(0, 30) + "..."
            : producto.nombreproducto;
        const fila = [
          descripcion,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.descuento,
          detalle.valor,
        ];
        fila.forEach((item, index) => {
          doc.setFont("helvetica", "normal");
          if (index === 0 && producto.nombreproducto.length > 30) {
            doc.setFontSize(8); // Reducir el tamaño de la letra si la descripción es grande
          } else {
            doc.setFontSize(12); // Restaurar el tamaño de la letra para las demás celdas
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
        yPos += 10; // Incrementar la posición para la siguiente fila
      }
    });

    // Agregar "Total"
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${facturaData.total}`, 10, yPos + 10);

    doc.save("factura.pdf");
  };

  // Definir las columnas de la tabla aquí
  const columns = [
    {
      title: "Productos",
      dataIndex: "id_producto_id",
      key: "id_producto_id",
      render: (id_producto_id) => {
        const producto = productos.find(
          (producto) => producto.id_producto === id_producto_id
        );
        return producto ? producto.nombreproducto : id_producto_id;
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

  return (
    <div>
      <h3>Fecha de Emisión: {facturaData.fecha_emision}</h3>
      <h3>Total: {facturaData.total}</h3>
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