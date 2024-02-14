import React, { useState,  useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,  faMapMarkerAlt, faEye, faEyeSlash  } from '@fortawesome/free-solid-svg-icons';
import { message } from 'antd';

import Map3 from './Map3';



const EditarUser =()=>{
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [MostrarModal, setMostrarModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(1); // Inicialmente trabajando con la ubicación 1

  const [locationData, setLocationData] = useState({
    latitud1: 0,
    longitud1: 0,
    latitud2: 0,
    longitud2: 0,
    latitud3: 0,
    longitud3: 0,
  });
  

  const handleLocationSelect = (location) => {
    setLocationData((prevLocationData) => ({
      ...prevLocationData,
      [`latitud${currentLocation}`]: location.latitud,
      [`longitud${currentLocation}`]: location.longitud,
    }));
    setMostrarModal(false);
  };
  

const handleSaveLocation = () => {
  if (marker) {
    setLocationData((prevLocationData) => ({
      ...prevLocationData,
      [`latitud${currentLocation}`]: marker.latitude,
      [`longitud${currentLocation}`]: marker.longitude,
    }));
    setCurrentLocation((prevLocation) => (prevLocation % 3) + 1); // Cambiar a la siguiente ubicación (1, 2, 3)
  }
};

  const handleEditClick = () => {
    setIsEditing(true);
  };
 

 

  const HacerClick = (location) => {
    setCurrentLocation(location);
    setMostrarModal(true);
  };

  const CerrarModal = () => {
    setMostrarModal(false);

  };
  
  
  const [userData, setUserData] = useState(null);
  const id_cuenta = localStorage.getItem('id_cuenta');


const ObtenerUsuario = async () => {
  
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
}
  useEffect(()=>{
    ObtenerUsuario()
  },[]);
 
  const handleSaveClick = async(values) => {
    try{
      
      if (!values) {
        console.error("Error: No se han proporcionado valores para la edición.");
        return;
      }
  
      // Desestructurar propiedades de values solo si values está definido
      const { telefono, snombre, capellido, ruc_cedula, razon_social } = values;
  
      const formData = new FormData();
      formData.append('ctelefono',telefono);
      formData.append('snombre', snombre);
      formData.append('capellido', capellido);
      formData.append('ruc_cedula', ruc_cedula);
      formData.append('crazon_social', razon_social);
      const response = await fetch(
        `https://projectdjangobakfebrero-production.up.railway.app/Login/editar_usuario/${id_cuenta}/`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        message.success("Usuario editado con exito");
        setIsEditing(false);
        ObtenerUsuario();
      } else {
        message.error(`Error al editar aviso: ${data.error}`);
      }
      }catch (error) {
        console.error("Error en la solicitud de edición de aviso", error);
        message.error("Error en la solicitud de edición de aviso");

      }
    }
 
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedImage(URL.createObjectURL(file));
      }
    },
  });

return(
    <>
 
        <Container>
        
          <Row>
            <Col md={4} style={styles.formularioContainer} >
              <div
                  style={{
                    overflow: 'hidden',
                    borderRadius: '50%',
                    width: '200px',
                    height: '200px',
                    margin: '0 auto',
                    position: 'relative',
                  }}
                  {...getRootProps()}>
          {selectedImage ? (
              <img
                src={selectedImage}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
                
                style={{
                  borderRadius: '50%',
                  transition: 'transform 0.3s ease',
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
              ) : (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',  }}>
                  <FontAwesomeIcon icon={faUser} size="5x"
                   onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                   onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
            <span >Editar foto de perfil</span>
            </div>
                <div style={{ textAlign: 'center',marginTop: '130px',  }} >
                
                <Button variant="primary" type="submit" style={{ width: '150px', borderRadius: '10px', }}
                onClick={handleEditClick}>
                  editar datos
                </Button>
                </div>
                <div style={{ textAlign: 'center',}}>
              <Button variant="secondary" type="button" style={{ width: '150px', borderRadius: '10px', marginTop: '10px' }}>
              Editar contraseña
              </Button>
            </div>
            <Col md={1100} style={{ ...styles.centerContainer, marginTop: '20px',  }}>
              <div style={{ marginTop: '60px' }}></div>
            </Col>
            </Col>
            <Col md={8}>
            <Row>
            <Col md={6} style={{ justifyContent: 'center', marginTop: '30px',
              
              padding: '20px',
                  
              }}>
                
                <h5 style={{ textAlign: 'center',
                  border: '1px solid #fcaf6f',
                  borderRadius: '10px',
                  backgroundColor: '#fcaf6f', // Agregar color de fondo gris
                  padding: '10px' // Añadir relleno para mejorar la apariencia
                  }}>Datos generales</h5>
                
               <Form>
                     <Form.Group>
                   <Row>
                     <Col>
                     <Form.Label>Nombre</Form.Label>
                      <Form.Control value={userData?.nombre_usuario || ''} 
                       readOnly={!isEditing}
                       onChange={(e) => isEditing && setUserData({ ...userData, nombre_usuario: e.target.value })}
                      />
                    </Col>
                    <Col>
                    <Form.Label>Apellido</Form.Label>
                      <Form.Control value={userData?.capellido||''}  
                       readOnly={!isEditing}
                       onChange={(e) => isEditing && setUserData({ ...userData, capellido: e.target.value })}/>
                      </Col>
                  </Row>
                  <Row>
                    <Col>
                    <Form.Label>telefono</Form.Label>
                      <Form.Control  value={userData?.telefono||''}  
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && setUserData({ ...userData, telefono: e.target.value })}/>
                    </Col>
                  </Row>
                    </Form.Group>
                    <Form.Group >
                    <Row>
                   
                    <Form.Label>Direccion 1</Form.Label>
                  
                    <Col lg={10}>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={`Latitud: ${locationData.latitud1}, 
Longitud: ${locationData.longitud1}`}
                      />
             
                    </Col>
                    <Col  lg={1}>
                      <FontAwesomeIcon
                       onClick={() => HacerClick(1)}
                      icon={faMapMarkerAlt} size="2x"/>
                      </Col> 
                    </Row>
                    </Form.Group>
                    {isEditing && (
                        <div className="mt-4">
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault(); // Prevenir la recarga de la página
                            handleSaveClick({
                            telefono: userData.telefono,
                            snombre: userData.snombre,
                            capellido: userData.capellido,
                            ruc_cedula: userData.ruc_cedula,
                            razon_social: userData.razon_social
                          })}}
                        >
                          Guardar Cambios
                        </button>
                            
                      </div>
                      )}
                </Form>
            </Col>
                  {/* Columna de Datos Generales 2 */}
                <Col md={6} style={{  marginTop: '30px', padding: '20px',   }}>
                  <h5 style={{ textAlign: 'center', border: '1px solid #fcaf6f', borderRadius: '10px', backgroundColor: '#fcaf6f', padding: '10px' }}>
                    Datos opcionales</h5>
                  <Form>
                  <Form.Group>
                   <Row>
                     <Col>
                     <Form.Label>Razon social</Form.Label>
                      <Form.Control value={userData?.razon_social||''}
                       readOnly={!isEditing}
                       onChange={(e) => isEditing && setUserData({ ...userData, razon_social: e.target.value })} />
                    </Col>
                    <Col>
                    <Form.Label>Identificacion</Form.Label>
                      <Form.Control   value={userData?.ruc_cedula||''} 
                               readOnly={!isEditing}
                               onChange={(e) => isEditing && setUserData({ ...userData, ruc_cedula: e.target.value })}/>
                      </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group >
                    <Row>
                      <Form.Label>Direccion 2</Form.Label>
                      <Col lg={10}>
                      <Form.Control 
                      as="textarea"
                      rows={3}
                        value={`Latitud: ${locationData.latitud2}, 
Longitud: ${locationData.longitud2}`}
                      />
                      </Col>
                      <Col  lg={1}>
                        <FontAwesomeIcon
                         onClick={() => HacerClick(2)}
                        icon={faMapMarkerAlt} size="2x"/>
                        </Col>
                        <Form.Label>Direccion 3</Form.Label>
                      <Col lg={10}>
                      <Form.Control 
                      as="textarea"
                      rows={3}
                        value={`Latitud: ${locationData.latitud3}, 
Longitud: ${locationData.longitud3}`}
                      />
                      </Col>
                      <Col  lg={1}>
                        <FontAwesomeIcon
                         onClick={() => HacerClick(3)}
                        icon={faMapMarkerAlt} size="2x"/>
                        </Col>  
                      </Row>
                    </Form.Group>
                  </Form>
                </Col>
                <Col  style={{  marginTop: '30px', padding: '20px',   }}>
                  <h5 style={{ textAlign: 'center', border: '1px solid #fcaf6f', borderRadius: '10px', backgroundColor: '#fcaf6f', padding: '10px' }}>Datos generales</h5>
                  <Form>
                  <Form.Group>
                    <Row>
                   
                     <Form.Label>Nombre</Form.Label>
                     <Col lg={11}>
                      <Form.Control  />
                      </Col>
                    <Col>
                      <FontAwesomeIcon
                        onClick={HacerClick}
                        icon={faMapMarkerAlt} size="2x"/>
                    </Col>
                    </Row>    
                    </Form.Group>

                    {/*<Form.Group style={{ marginTop:'10px' }}>
                 <Row>
                    <Col>
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control type='password'  />
                    </Col>
                    <Col>
                    <Form.Label>nueva contraseña</Form.Label>
                    <Form.Control   />
                    </Col>
                  </Row>
                    </Form.Group> */}
                  </Form>
                    </Col>
        </Row>
        </Col>
          </Row>
        </Container>

        {isEditing && (
          <Modal show={MostrarModal} onHide={CerrarModal} size="lg" >
            <Modal.Header closeButton  style={{ borderBottom: 'none' }}>
            </Modal.Header>
            <Modal.Body>
            <Map3
              onLocationSelect={handleLocationSelect}
              onSaveLocation={handleSaveLocation}
            />
            </Modal.Body>
          </Modal>
        )}
        </>
      );
    }
    
    const styles = {
      formularioContainer: {
        border: '1px solid rgba(196, 208, 255, 0.74)',
        borderRadius: '50px',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        backgroundColor:'rgba(196, 208, 255, 0.74)',
        marginTop: '30px', 
      },
      centerContainer: {
        
     
       
      },
      heading: {
        textAlign: 'center',
      },
    };


export default EditarUser;
