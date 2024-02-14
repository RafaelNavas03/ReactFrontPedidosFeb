import {Card, Modal, Button} from 'react-bootstrap';
import React, { useState, useEffect, useContext  } from 'react';
import NavBar from './NavBar';
import Item from './item2';
import { CartContext } from "../context/CarritoContext";




const ListProductos =()=>{

    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    
    const [selectedProduct, setSelectedProduct] = useState(null);




    useEffect(() => {
        // Realizar la solicitud a la API al montar el componente
        fetch('https://projectdjangobakfebrero-production.up.railway.app/producto/listar/')
          .then(response => response.json())
          .then(data => setProducts(data.productos))
          .catch(error => console.error('Error fetching products:', error));
      }, []);

      const handleCardClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
      };

      const [cart, setCart] = useContext(CartContext);

  const addToCart = (productId) => {
  setCart((currItems) => {
    const isItemFound = currItems.find((item) => item.id === productId);

    if (isItemFound) {
      return currItems.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
    } else {
      return [
        ...currItems,
        {
          id: productId,
          quantity: 1,
          Name: selectedProduct.nombreproducto,
          image: selectedProduct.imagenp,
          price: parseFloat(selectedProduct.preciounitario),
        },
      ];
    }
  });
};


  const removeItem = (productId) => {
    setCart((currItems) => {
      const updatedCart = currItems.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: Math.max(item.quantity - 1, 0) };
        } else {
          return item;
        }
      });

      return updatedCart.filter((item) => item.quantity > 0);
    });
  };

  const getQuantityById = (productId) => {
    return cart.find((item) => item.id === productId)?.quantity || 0;
  };

  const quantityPerItem = getQuantityById();

    return(
        <>
        <div style={{ marginTop: '30px', marginLeft: '50px', display:'flex' }}>
          {products.map((product, index) => (
            <Card
              key={product.id}
              style={{ width: '18rem', cursor: 'pointer', marginRight: index < products.length - 1 ? '20px' : '0' }}
              onClick={() => handleCardClick(product)}
            >
              <Card.Img
                variant="top"
                src={`data:image/png;base64,${product.imagenp}`}
                alt={`Imagen de ${product.nombreproducto}`}
                style={{ width: '100%', height: '270px' }}
              />
              <Card.Body>
                <Card.Title>{product.nombreproducto}</Card.Title>
                <Card.Text>{product.descripcionproducto}</Card.Text>
                <Card.Text>{`$${product.preciounitario}`}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
  
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header style={{ borderBottom: 'none' }} closeButton>
            <Modal.Title >{selectedProduct && selectedProduct.nombreproducto}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProduct && (
              <>
                <img
                  src={`data:image/png;base64,${selectedProduct.imagenp}`}
                  alt={`Imagen de ${selectedProduct.nombreproducto}`}
                  style={{ width: '100%', height: '340px' }}
                />
                <p>{selectedProduct.descripcionproducto}</p>
                <p>{`$${selectedProduct.preciounitario}`}</p>


                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {selectedProduct && (
                      <>
                        {getQuantityById(selectedProduct.id_producto) > 0 && (
                        <div style={{ padding: '4px', backgroundColor: '#686868', color: '#fff', borderRadius: '50px' }}>
                          {getQuantityById(selectedProduct.id_producto)}
                        </div>
                       )}

                        {getQuantityById(selectedProduct.id_producto) === 0 ? (
                          <Button style={{ border: 'none' }} onClick={() => addToCart(selectedProduct.id_producto)}>
                            + Añadir al carrito
                          </Button>
                        ) : (
                          <Button
                            style={{ marginLeft: '10px', backgroundColor: '#004e0e', color: '#fff', border: 'none' }}
                            onClick={() => addToCart(selectedProduct.id_producto)}
                          >
                            + Añadir más
                          </Button>
                        )}

                        {getQuantityById(selectedProduct.id_producto) > 0 && (
                          <Button
                            style={{ marginLeft: '10px', backgroundColor: '#e20000', color: '#fff', border: 'none' }}
                            onClick={() => removeItem(selectedProduct.id_producto)}
                          >
                            - Quitar
                          </Button>
                        )}
                      </>
                    )}
                  </div>
              </>
            )}
                 
          </Modal.Body>
        </Modal>


      </>
    )
}




export default ListProductos;
