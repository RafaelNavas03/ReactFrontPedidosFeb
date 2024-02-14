import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, message } from "antd";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("projectdjangobakfebrero-production.up.railway.app/Login/rol/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"), // Obtener el token almacenado
          }),
        });
console.log(response);
        if (response.ok) {
          const data = await response.json();
          const rol = data.rol;

          // Puedes realizar acciones con el rol recibido si es necesario

          // Ejemplo de redirección basada en el rol
          if (rol === "S") {
            console.log("Aqui se llego");
            window.location.href = "/home";
          }
        } else {
          // Manejar errores de la solicitud a la API
          console.log("error");
        }
      } catch (error) {
        // Manejar errores de la solicitud
        console.error("Error en la solicitud:", error);
      }
    };

    // Llamar a la función fetchData al cargar el componente
    fetchData();
  }, []);
  const onFinish = async (values) => {
    try {
      const response = await fetch(
        "projectdjangobakfebrero-production.up.railway.app/Login/iniciar_sesion/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombreusuario: values.username,
            contrasenia: values.password,
          }),
        }
      );

      const data = await response.json();
      console.log(data); // Verifica si el token está presente en la respuesta

      if (response.ok) {
        const { token, nombreusuario, id_cuenta } = data;
        console.log("Token almacenado:", token);
        console.log("Nombre de usuario almacenado:", nombreusuario);
        console.log("ID de cuenta almacenado:", id_cuenta);


        localStorage.setItem("token", token);
        localStorage.setItem("username", nombreusuario);
        localStorage.setItem("id_cuenta", id_cuenta);
        setTimeout(() => {
          localStorage.removeItem("token");
          console.log("Token eliminado después de 24 horas.");
        }, 24 * 60 * 60 * 1000);
        onLogin(data);

        // Después de que el usuario ha iniciado sesión, realiza la redirección
        const rolResponse = await fetch("projectdjangobakfebrero-production.up.railway.app/Login/rol/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token, // Utiliza el token recién obtenido
          }),
        });

        if (rolResponse.ok) {
          const rolData = await rolResponse.json();
          const rol = rolData.rol;

          if (rol === "S") {
            console.log("Redirigiendo a /home");
            window.location.href = "/home";
          } else if (rol === "M") {
            console.log("Redirigiendo a /homemesero");
            navigate("/homemesero"); // Utiliza navigate para redirigir a la ruta deseada
          } else if (rol === "X") {
            console.log("Redirigiendo a /cocina");
            navigate("/cocina"); // Utiliza navigate para redirigir a la ruta deseada
          }
        } else {
          console.log("Error al obtener el rol");
        }
      } else {
        // Manejar errores de inicio de sesión
        console.error("Error en inicio de sesión:", data.mensaje);
        message.error(data.mensaje);
      }
    } catch (error) {
      console.error("Error en la solicitud de inicio de sesión:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const navigate = useNavigate();

  const RedirigirRegistro = () => {
    navigate("/Registro");
  };
  return (
    <Form
      name="loginForm"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="max-w-md mx-auto bg-white rounded-lg"
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          textAlign: "center",
          color: "#333",
        }}
      >
        Inicio de Sesión
      </h2>

      <Form.Item
        label="Usuario"
        name="username"
        rules={[{ required: true, message: "Por favor, ingresa tu usuario" }]}
      >
        <Input style={{ width: "100%", height: "40px" }} />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="password"
        rules={[
          { required: true, message: "Por favor, ingresa tu contraseña" },
        ]}
      >
        <Input.Password style={{ width: "100%", height: "40px" }} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%", background: "#1890ff" }}
        >
          Iniciar sesión
        </Button>
      </Form.Item>

      <Form.Item>
        <Button
          type="default"
          htmlType="button"
          style={{ width: "100%", background: "#f0f0f0" }}
          onClick={RedirigirRegistro}
        >
          Registrarse
        </Button>
      </Form.Item>

      <Alert
        message="¿No tienes cuenta? Regístrate para disfrutar de más funciones."
        type="info"
        showIcon
        style={{ marginTop: "1rem" }}
      />
    </Form>
  );
};

export default LoginForm;
