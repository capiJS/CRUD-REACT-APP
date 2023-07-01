import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import ThreePIcon from "@mui/icons-material/ThreeP";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PaymentIcon from "@mui/icons-material/Payment";
import StorageIcon from "@mui/icons-material/Storage";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  tabsCustom: {
    "& .css-1bjk3jo-MuiButtonBase-root-MuiBottomNavigationAction-root.Mui-selected .css-i4bv87-MuiSvgIcon-root   ":
      {
        color: "#000",
        fontSize: "2rem",
      },
    "& .css-imwso6-MuiBottomNavigationAction-label.Mui-selected": {
      color: "#000",
      fontSize: "1rem",
    },
  },
}));

export default function Bar(props) {
  const [value, setValue] = React.useState("");

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.onValueChange(newValue);
  };

  return (
    <BottomNavigation
      sx={{ width: 500 }}
      value={value}
      onChange={handleChange}
      className={classes.tabsCustom}
    >
      <BottomNavigationAction label="Home" value="Home" icon={<HomeIcon />} />

      <BottomNavigationAction
        label="Clientes"
        value="ThreePicon"
        icon={<ThreePIcon />}
      />
      <BottomNavigationAction
        label="Empleados"
        value="Diversity3"
        icon={<Diversity3Icon />}
      />
      <BottomNavigationAction
        label="Pagos"
        value="Payment"
        icon={<PaymentIcon />}
      />
      <BottomNavigationAction
        label="Productos"
        value="Storage"
        icon={<StorageIcon />}
      />
    </BottomNavigation>
  );
}
