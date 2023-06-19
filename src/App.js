import { useState } from "react";
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
          color: "GrayText",
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

export default App;
