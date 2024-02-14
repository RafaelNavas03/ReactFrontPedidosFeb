import React, {useState,useEffect} from 'react';
import Carousel from 'react-bootstrap/Carousel';
import NavBar from './NavBar';



const Carrusel=() =>{
    const [avisos, setAvisos] = useState([]);

    // Función para obtener los avisos principales de la API
    const fetchAvisosPrincipales = async () => {
      try {
        const response = await fetch('http://projectdjangobakfebrero-production.up.railway.app/avisos/avisos/');
        const data = await response.json();
        setAvisos(data.avisos_principales);
      } catch (error) {
        console.error('Error al obtener los avisos principales', error);
      }
    };
  
    useEffect(() => {
      fetchAvisosPrincipales();
    }, []); // Se ejecutará solo una vez al montar el componente
  
  return (
    <>

    <div style={{ margin: '20px', borderRadius: '15px', overflow: 'hidden' }}>
  
    <Carousel fade>
        {avisos.map((aviso) => (
    <Carousel.Item >
      <img 
      src={`data:image/png;base64, ${aviso.imagen}`}
      alt={aviso.titulo} 
      style={{width: '100%', height: '500px'  }}/>
      <Carousel.Caption>
        <h3>{aviso.titulo}</h3>
        <p>{aviso.descripcion}</p>
      </Carousel.Caption>
    </Carousel.Item>
     ))}
    </Carousel>
  </div>
</>
  );
}

export default Carrusel;
