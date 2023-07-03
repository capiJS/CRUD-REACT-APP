import React, { useState, useEffect } from "react";
import Bar from "./components/Bar";
import Clientes from "./components/Clientes";
import Empleados from "./components/Empleados";
import Pagos from "./components/Pagos";
import Products from "./components/Products";
import Home from "./components/Home";
import "./App.css";

function App() {
  const [value, setValue] = useState(false);

  function handleValueChange(newValue) {
    setValue(newValue);
  }

  return (
    <>
      <h2
        style={{
          display: "flex",
          position: "relative",
          justifyContent: "center",
          margin: "1rem",
          color: "rgb(0 101 149)",
        }}
      >
        CRUD REACT APP
      </h2>
      <Bar onValueChange={handleValueChange} />
      {value === "Home" && <Home />}
      {value === "ThreePicon" && <Clientes />}
      {value === "Diversity3" && <Empleados />}
      {value === "Payment" && <Pagos />}
      {value === "Storage" && <Products />}
    </>
  );
}

function AppWithBackground() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setIsLoaded(true);
    };
    image.src = process.env.PUBLIC_URL + "/react.png";
  }, []);

  const images = Array.from({ length: 18 }); // Generar un arreglo de 18 elementos

  return (
    <>
      {isLoaded && (
        <div className="app-background" style={{ backgroundColor: "#f1f1f1" }}>
          <div className="animation-container">
            {images.map((_, index) => (
              <div
                key={index}
                className="animation-box"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  backgroundImage: `url(${process.env.PUBLIC_URL}/react.png)`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
      <App />
    </>
  );
}

export default AppWithBackground;
