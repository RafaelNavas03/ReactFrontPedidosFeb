import React, { useContext, useState, useEffect  } from "react";
import Lottie from 'react-lottie';
import {Card, Form,Modal, Button, Row,ButtonGroup,
  Col, Container} from 'react-bootstrap';
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from "../context/CarritoContext";
import { Radio, InputNumber } from 'antd';
import { notification } from 'antd';
import animationData from '../assets/lottis/B.json'; // Importa el archivo JSON de tu animación


import PayPal from "./Paypal";
import PayPal2 from "./Paypal2";
import Map2 from "./Map2";

const ShoppingCart = () => {
  const [cart, setCart] = useContext(CartContext);
  const [MostrarModal, setMostrarModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  
  const [pagoCompletado, setPagoCompletado] = useState(false); 
  const [modoPago, setModoPago] = useState(null); 
  const [fraccionadoValue, setFraccionadoValue] = useState(0);
  const [mostrarComponente, setMostrarComponente] = useState(false);

  const [modoPedido, setModoPedido] = useState(null); 
  const [showElegirUbicacion, setShowElegirUbicacion] = useState(false);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);

  const lottieOptions = {
    loop: true,
    autoplay: !isAnimationPaused, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const toggleAnimation = () => {
    setIsAnimationPaused(!isAnimationPaused);
  };
  const estiloTexto = {
    marginTop: '200px',
    fontSize: '24px', // Ajusta el tamaño del texto
    textAlign: 'center',
    fontFamily: 'Circular, sans-serif', // Cambia el estilo de letra
    color: 'gray', // Cambia el color del texto
    marginBottom:'270px'
  };
  const [locationData, setLocationData] = useState({
    latitud: 0,
    longitud: 0
  });

  const id_cuenta = localStorage.getItem('id_cuenta');
  useEffect(() => {
    
  
    if (id_cuenta) {
      fetch(`https://projectdjangobakfebrero-production.up.railway.app/Login/obtener_usuario/${id_cuenta}/`)
        .then(response => response.json())
        .then(data => {
          setUserData(data.usuario);
          
          setLocationData({
            latitud1: data.usuario?.ubicacion1?.latitud || 0,
            longitud1: data.usuario?.ubicacion1?.longitud || 0,
            latitud2: data.usuario?.ubicacion2?.latitud || 0,
            longitud2: data.usuario?.ubicacion2?.longitud || 0,
            latitud3: data.usuario?.ubicacion3?.latitud || 0,
            longitud3: data.usuario?.ubicacion3?.longitud || 0,
          });
        })
        .catch(error => console.error('Error al obtener datos del usuario:', error));
    } else {
      console.error('Nombre de usuario no encontrado en localStorage');
    }
  }, []);

  const handleModoPagoChange = (e) => {
    setModoPago(e.target.value);
    setFraccionadoValue(1); // Reiniciar el valor al cambiar la opción de pago

  };
  const handleFraccionadoInputChange = (value) => {
    setFraccionadoValue(value);
  };
  const handleModoPedidoChange = (e) => {
    setModoPedido(e.target.value);
  };
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setShowElegirUbicacion(location === 'Otro');
    let newLocationData = {};
    console.log(`Cambiando a la ubicación: ${location}`);


    switch (location) {
      case 'Casa':
        newLocationData = {
          latitud: locationData.latitud1,
          longitud: locationData.longitud1,
        };
        break;
      case 'Trabajo':
        newLocationData = {
          latitud: locationData.latitud2,
          longitud: locationData.longitud2,
        };
        break;
      case 'Otro':
        newLocationData = {
          latitud: locationData.latitud3,
          longitud: locationData.longitud3,
        };
        break;
      default:
        newLocationData = {
          latitud: 0,
          longitud: 0,
        };
    }
    console.log('Nuevos datos de ubicación:', newLocationData);
    setLocationData((prevLocationData) => ({ ...prevLocationData, ...newLocationData }));
  };
  

  const handleShowCardForm = () => {
    setShowCardForm(true);
  };
  const handleElegirUbicacionClick = () => {

    setShowElegirUbicacion(false);
  };
  const cerrarCardForm = () => {
    setShowCardForm(false);
  };
  const HacerClick = () => {
    if (cart.length > 0) {
      setMostrarModal(true);
    }
  };
  
  const CerrarModal = () => {
    setMostrarModal(false);
    setShowCardForm(false); 

  };
  const quantity = cart.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.quantity * curr.price,
    0
  );
const PagarPorEfectivo =()=>{
  if (id_cuenta) {
    const detalles_pedido = cart.map(item => ({
      id_producto: item.id,
      cantidad_pedido: item.quantity,
      costo_unitario: item.price,
    }));


    // Construye el cuerpo de la solicitud con los datos necesarios
    const formData = new FormData();
  
    formData.append('precio', totalPrice);
    formData.append('tipo_de_pedido', modoPedido);
    formData.append('metodo_de_pago', 'E'); // Asumo que 'E' es el método de pago en efectivo
    formData.append('puntos', 0); // Ajusta según sea necesario
    formData.append('estado_del_pedido', 'O'); // Ajusta según sea necesario
    formData.append('impuesto', 0);
    formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
    // Realiza la solicitud POST al backend
    fetch(`projectdjangobakfebrero-production.up.railway.app/cliente/realizar_pedido/${id_cuenta}/`, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(responseData => {
      // Maneja la respuesta del backend según sea necesario
      if (responseData.success) {
        console.log('Respuesta del servidor:', responseData);
        console.log('Pedido realizado con éxito.');
        notification.success({
          message: 'Pedido Exitoso',
          description: '¡El pedido se ha completado con éxito!',
        });
      } else {
        console.error('Error al realizar el pedido:', responseData.message);
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
    })
    .finally(() => {
      setCart([]);
      setMostrarModal(false);
    });
  } else {
    console.error('ID de cuenta no encontrado en localStorage');
  }
 
    
};





  const CerrarModalDespuesDePago = () => {
    if (id_cuenta) {
      const detalles_pedido = cart.map(item => ({
        id_producto: item.id,
        cantidad_pedido: item.quantity,
        costo_unitario: item.price,
      }));
  
  
      // Construye el cuerpo de la solicitud con los datos necesarios
      const formData = new FormData();
    
      formData.append('precio', totalPrice);
      formData.append('tipo_de_pedido', modoPedido);
      formData.append('metodo_de_pago', 'E'); // Asumo que 'E' es el método de pago en efectivo
      formData.append('puntos', 0); // Ajusta según sea necesario
      formData.append('estado_del_pedido', 'O'); // Ajusta según sea necesario
      formData.append('impuesto', 0);
      formData.append("detalles_pedido", JSON.stringify({ detalles_pedido }));
      // Realiza la solicitud POST al backend
      fetch(`projectdjangobakfebrero-production.up.railway.app/cliente/realizar_pedido/${id_cuenta}/`, {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(responseData => {
        // Maneja la respuesta del backend según sea necesario
        if (responseData.success) {
          console.log('Respuesta del servidor:', responseData);
          console.log('Pedido realizado con éxito.');
          notification.success({
            message: 'Pedido Exitoso',
            description: '¡El pedido se ha completado con éxito!',
          });
        } else {
          console.error('Error al realizar el pedido:', responseData.message);
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
      })
      .finally(() => {
        setCart([]);
        setMostrarModal(false);
      });
    } else {
      console.error('ID de cuenta no encontrado en localStorage');
    }
    }

    const PagarPorFraccionado = () => {
      setMostrarComponente(!mostrarComponente);
      console.log('Pagar por fraccionado con valor:', fraccionadoValue);
    };
  
  return (
    <>
      <div  >
        <div>
         
         
          {cart.length > 0 ? (
          <>
           <Container>
<Row>
           <Col md={9} style={{ border: '1px solid rgba(0, 0, 0, 0.74)',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
           
            marginLeft: 0,  // Agrega esta línea para establecer el margen izquierdo a 0
            paddingLeft: 0 
            }}>
           <h5 style={{ marginTop: '10px', fontSize: '18px', marginBottom:'30px', marginLeft:'10px' }}>Productos en el carrito: {quantity}</h5>
              <ul>
                {cart.map((item) => (
                  <div key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px', fontSize: '18px', 
                  marginTop:'10px'}}>
                    <img
                      src={`data:image/png;base64,${item.image}`} 
                      alt={`Imagen de ${item.Name}`}
                      style={{ width: '50px', height: '50px', marginRight: '10px' }}
                    />
                    {item.Name} - Cantidad: {item.quantity} - Precio: ${item.price}
                  </div>
                ))}
              </ul>
              </Col>
       
         <Col >
          <Row>
            <Col>
         <div style={{ marginTop: '10px', fontSize: '18px' }}>Total: ${totalPrice}</div>
         </Col>
          </Row>
          <Row>
            <Col style={{marginTop:'400px'}}>
              <div style={{ marginTop: '10px', fontSize: '18px' }}>Total: ${totalPrice}</div>
                <div className="d-grid gap-2" >
                  <Button 
                  onClick={HacerClick}
                  size="lg"
                  style={{
                    backgroundColor: '#131212',
                    borderRadius: '8px',
                    padding: '15px 30px',
                    fontSize: '16px',
                    color: '#fff',
                    border: '1px solid #131212',
                    transition: 'background-color 0.3s',  // Agrega una transición para suavizar el cambio de color
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#333'}  // Cambia el color al pasar el ratón
                  onMouseOut={(e) => e.target.style.backgroundColor = '#000'}  // Restaura el color original al salir del ratón
                >Hacer pedido</Button>
          
            </div>
            </Col>
            </Row>
            </Col>
         
        </Row>
            </Container>
            </>
             ) : (
              <div style={estiloTexto}>
                    No hay productos en el carrito.
                    <br/>
                    <div onClick={toggleAnimation}>
                      <Lottie options={lottieOptions} height={100} width={100}  />
                    </div>

              </div>
            )}
        </div>
      </div>

    <Modal show={MostrarModal} onHide={CerrarModal} size="lg" >
      <Modal.Header closeButton  style={{ borderBottom: 'none' }}>
      </Modal.Header>
      <Row>
        <Col>
          <h5>Hola ✌🏻</h5>
          <span>Revisa tu dirección y forma de pago antes de comprar.</span>
          <div style={{ marginTop: '10px', fontSize: '18px' }}>Seleccione como quiere recibir/retirar su pedido:</div>
          <Radio.Group onChange={handleModoPedidoChange} value={modoPedido}>
            <Col style={{marginLeft:'10px'}}>
              <Row>
                <Radio value="D">Domicilio</Radio>
                <Radio value="R">Retirar</Radio>
                <Radio value="L">Local</Radio>
              </Row>
            </Col>
          </Radio.Group>
          {modoPedido === 'D' && (
          <>
            <ButtonGroup style={{marginLeft:'10px',marginTop: '10px',width:'100%', 
            marginBottom:'10px' }}>
              <Button variant="outline-warning" 
              onClick={() => handleLocationChange('Casa')}
              style={{color:'rgb(255, 121, 32)'}}>Casa</Button>
              <Button variant="outline-warning" 
              onClick={() => handleLocationChange('Trabajo')}
              style={{color:'rgb(255, 121, 32)'}}>Trabajo</Button>
              <Button variant="outline-warning" 
              onClick={() => handleLocationChange('Otro')}
              style={{color:'rgb(255, 121, 32)'}}>Otro</Button>
          </ButtonGroup>
              <h5>Coordenadas de {selectedLocation}:</h5>
              {locationData.latitud !== undefined && locationData.longitud !== undefined ? (
                `Latitud: ${locationData.latitud}, Longitud: ${locationData.longitud}`
              ) : (
                'Coordenadas no disponibles'
              )}
          </>
          )}
            <Modal show={showElegirUbicacion} onHide={() => setShowElegirUbicacion(false)} size="mg">
              <Modal.Header closeButton style={{ borderBottom: 'none' }} />
              <Modal.Body>
                <Map2 onLocationSelect={handleLocationChange} />
              </Modal.Body>
            </Modal>
          <div style={{ marginTop: '10px', fontSize: '18px' }}>Seleccione modo de pago:</div>
          <Radio.Group onChange={handleModoPagoChange} value={modoPago}>
            <Col style={{marginLeft:'10px'}}>
              <Row>
                <Radio value="T">Transferencia/Tarjeta</Radio>
                {modoPago === 'T' && (
                    <div style={{ marginLeft: '10px', marginTop: '10px' }}>
                      <PayPal onSuccess={CerrarModalDespuesDePago} />
                    </div>
                  )}
                <Radio value="E">Efectivo</Radio>
                <Radio value="F">Fraccionado
                {modoPago === 'F' && (
              <>
                <InputNumber
                  min={0}
                  value={fraccionadoValue}
                  onChange={handleFraccionadoInputChange}
                  style={{ marginLeft: '10px' }}
                />
                <Button
                  style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}
                  onClick={PagarPorFraccionado}
                >
                  Pagar: ${fraccionadoValue.toFixed(2)}
                </Button>
              </>
            )}
                </Radio>
                {mostrarComponente && modoPago === 'F' && (
                    <div style={{ marginLeft: '10px', marginTop: '10px' }}>
                      <PayPal2 onSuccess={CerrarModalDespuesDePago} amount={fraccionadoValue}/>
                    </div>
                  )}
                <Button style={{ marginLeft: '10px', marginTop: '10px', marginBottom:'10px' }} 
                  disabled={modoPago !== 'E'}
                  onClick={PagarPorEfectivo}>
                  Pagar: ${totalPrice}
                </Button>
              </Row>
            </Col>
          </Radio.Group>
          
        </Col>
        <Col>
        <div>
        <ul>
            {cart.map((item) => (
                  <li key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px', fontSize: '18px', 
                  marginTop:'10px'}}>
                    <img
                      src={`data:image/png;base64,${item.image}`} 
                      alt={`Imagen de ${item.Name}`}
                      style={{ width: '50px', height: '50px', marginRight: '10px' }}
                    />
                    {item.Name} - Cantidad: {item.quantity} - Precio: ${item.price}
                  </li>
                ))}
              </ul>
        </div>
        </Col>
      </Row>
 

    </Modal>
      
    </>
  );
};

export default ShoppingCart;
