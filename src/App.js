import { useState, useEffect } from "react";
import Bar from "./components/Bar";
import Clientes from "./components/Clientes";
import Empleados from "./components/Empleados";
import Pagos from "./components/Pagos";
import Products from "./components/Products";
import Home from "./components/Home";

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
    image.src = "death star.jpg";
  }, []);

  return (
    <>
      {isLoaded && (
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "auto",
            maxWidth: "100vw",
            maxHeight: "100vh",
            opacity: "40%",
          }}
          src="death star.jpg"
          alt="Background"
        />
      )}
      <App />
    </>
  );
}

export default AppWithBackground;
