import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { Backdrop, Dialog, FormControl, FormLabel } from "@mui/material";
import { styled } from "@mui/system";
import Modal from "@mui/base/Modal";
import Input from "@mui/base/Input";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import ClearIcon from "@mui/icons-material/Clear";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import { useRef } from "react";
import DeleteModal from "./DeleteModal";

const useStyles = makeStyles((theme) => ({
  tabsCustom: {
    "& .css-1qgma8u-MuiButtonBase-root-MuiTableSortLabel-root.Mui-active": {
      color: "#8f19d2",
      fontWeight: "bold",

      "& .css-1azl6jz-MuiTableCell-root": {
        color: "#8f19d2",
        fontWeight: "bold",
      },
    },
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "pg_id",
    numeric: false,
    disablePadding: false,
    label: "Item",
  },
  {
    id: "pg_tarjeta",
    numeric: true,
    disablePadding: false,
    label: "Tarjeta",
  },
  {
    id: "pg_codigo",
    numeric: true,
    disablePadding: false,
    label: "Codigo",
  },
  {
    id: "pg_vencimiento",
    numeric: true,
    disablePadding: false,
    label: "Vencimiento",
  },
  {
    id: "pg_id_cliente",
    numeric: false,
    disablePadding: false,
    label: "Id cliente",
  },
];

const DEFAULT_ORDER = "asc";
const DEFAULT_ORDER_BY = "calories";
const DEFAULT_ROWS_PER_PAGE = 5;

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  const classes = useStyles();

  return (
    <TableHead className={classes.tabsCustom}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="secondary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    selected,
    handleShowEdit,
    handleShowCreate,
    rows,
    handleDelete,
  } = props;

  // const pagosIndex = rows.findIndex((cliente) => cliente.pg_id === selected);
  console.log(selected);
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        ></Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip>
          <IconButton></IconButton>
        </Tooltip>
      )}
      <IconButton
        title="selecciona cliente para editar"
        onClick={() =>
          selected > 0
            ? handleShowEdit(
                rows[rows.findIndex((cliente) => cliente.pg_id === selected[0])]
                  .pg_tarjeta,
                rows[rows.findIndex((cliente) => cliente.pg_id === selected[0])]
                  .pg_codigo,
                rows[rows.findIndex((cliente) => cliente.pg_id === selected[0])]
                  .pg_vencimiento
              )
            : null
        }
      >
        <EditNoteIcon style={{ fontSize: "2rem" }} />
      </IconButton>
      <IconButton title="agregar" onClick={handleShowCreate}>
        <PlaylistAddIcon style={{ fontSize: "2rem" }} />
      </IconButton>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomizedSnackbars({ snack, setSnack }) {
  const [open, setOpen] = React.useState(false);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack(false);
  };

  return (
    <Stack spacing={2}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      <Snackbar
        open={snack}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          width: "100%",
          // display: "flex",
          // position: "relative",
          // alignItems: "flex-start",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="info"
          sx={{ width: "90%", fontSize: "large" }}
        >
          Ingresa todos los campos !
        </Alert>
      </Snackbar>
    </Stack>
  );
}

function CustomizedSnackbarsGuardar({ snackGuardar, setSnackGuardar }) {
  const [open, setOpen] = React.useState(false);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackGuardar(false);
  };

  return (
    <Stack spacing={2}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      <Snackbar
        open={snackGuardar}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          width: "100%",
          // display: "flex",
          // position: "relative",
          // alignItems: "flex-start",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "90%", fontSize: "large" }}
        >
          Pago actualizado !
        </Alert>
      </Snackbar>
    </Stack>
  );
}

function CustomizedSnackbarsAñadir({ snackAñadir, setSnackAñadir }) {
  const [open, setOpen] = React.useState(false);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackAñadir(false);
  };

  return (
    <Stack spacing={2}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      <Snackbar
        open={snackAñadir}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          width: "100%",
          // display: "flex",
          // position: "relative",
          // alignItems: "flex-start",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "90%", fontSize: "large" }}
        >
          Pago agregado!
        </Alert>
      </Snackbar>
    </Stack>
  );
}

function CustomizedSnackbarsBorrar({ snackBorrar, setSnackBorrar }) {
  const [open, setOpen] = React.useState(false);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBorrar(false);
  };

  return (
    <Stack spacing={2}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      <Snackbar
        open={snackBorrar}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          width: "100%",
          // display: "flex",
          // position: "relative",
          // alignItems: "flex-start",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "90%", fontSize: "large" }}
        >
          Pago borrado exitosamente!
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default function Pagos() {
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = React.useState(0);
  const [loading, setloading] = React.useState(false);

  //imagenes---------------------------------------
  const fileInputRef = useRef(null);
  // const [images, setimages] = React.useState(null);

  // const handleFileChange = (event) => {
  //   setimages(event.target.files[0]);
  // };

  //-----------------------------------------------
  const [snack, setSnack] = React.useState(false);
  const [snackGuardar, setSnackGuardar] = React.useState(false);
  const [snackAñadir, setSnackAñadir] = React.useState(false);
  const [snackBorrar, setSnackBorrar] = React.useState(false);

  const validar = () => {
    if (
      form.pg_tarjeta.trimStart() === "" ||
      form.pg_codigo.trimStart() === "" ||
      form.pg_vencimiento.trimStart() === ""
    ) {
      console.log("prueba");
      setSnack(true);
    } else if (btn === "añadir") {
      agregarProducto();
    } else if (btn === "guardar") {
      actualizarProducto();
    }
  };

  //modal states and consts----------------------------------------------------------------------

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [btn, setBtn] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({
      pg_tarjeta: "",
      pg_codigo: "",
      pg_vencimiento: "",
    });
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleDelete = () => {
    setOpenModal(true);
  };
  //----------------------------------------------
  const handleShowCreate = () => {
    handleOpen(true);
    setTitle("AGREGAR PAGO");
    setBtn("añadir");
  };
  //-----------------------------------------------
  const handleShowEdit = (pg_tarjeta, pg_codigo, pg_vencimiento) => {
    console.log(selected);
    handleOpen(true);
    setTitle("EDITAR PAGO");
    setForm({
      pg_tarjeta,
      pg_codigo,
      pg_vencimiento,
    });
    setBtn("guardar");
  };

  //modal states and consts----------------------------------------------------------------------

  const [rows, setRows] = React.useState([]);

  const webservices = "http://localhost:3000";

  const [form, setForm] = React.useState({
    pg_tarjeta: "",
    pg_codigo: "",
    pg_vencimiento: "",
  });

  //------------------------------------------------

  React.useEffect(() => {
    getPagos();
  }, []);

  React.useEffect(() => {
    if (loading) {
      getPagos();
      setloading(false);
    }
  }, [loading]);
  //--------------------------------------------------

  React.useEffect(() => {
    let rowsOnMount = stableSort(
      rows,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY)
    );

    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    );

    setVisibleRows(rowsOnMount);
  }, [rows]);

  //----------------------------------------------

  const getPagos = async () => {
    const response = await axios.get(`${webservices}/pagos`);
    setRows(response.data);
    console.log(response.data);
  };
  //-----------------------------------------------

  const borrarProducto = async (arr) => {
    arr.map(async (t, index) => {
      const response = await axios({
        method: "delete",
        url: `${webservices}/pagos/${t}`,
      });

      console.log(response.data);
      if (response && response.data) {
        setloading(true);
        setRows(
          rows.filter((updated) => {
            return updated.pg_id !== response.data.pg_id;
          })
        );
        setSelected([]);
        setOpenModal(false);
        setSnackBorrar(true);
      }
    });
  };

  //------------------------------------------------
  const agregarProducto = async () => {
    const formData = new FormData();

    // Append other form data to the formData object
    formData.append("pg_tarjeta", form.pg_tarjeta);
    formData.append("pg_codigo", form.pg_codigo);
    formData.append("pg_vencimiento", form.pg_vencimiento);

    try {
      const response = await axios.post(`${webservices}/pagos`, formData);
      console.log(response);
      if (response && response.data) {
        setRows(rows.concat(response.data));
        setloading(true);
        handleClose(false);
        setSnackAñadir(true);
        setForm({
          pg_tarjeta: "",
          pg_codigo: "",
          pg_vencimiento: "",
        });
      }
    } catch (error) {
      console.error("Error adding cliente:", error);
    }
  };
  // -------------------------------------------------
  const actualizarProducto = async () => {
    const formData = new FormData();

    // Append other form data to the formData object
    formData.append("pg_tarjeta", form.pg_tarjeta);
    formData.append("pg_codigo", form.pg_codigo);
    formData.append("pg_vencimiento", form.pg_vencimiento);

    try {
      const response = await axios.put(
        `${webservices}/pagos/${selected}`,
        formData
      );
      if (response && response.data) {
        setloading(true);
        setRows(rows.fill(response.data, form.pg_id - 1, form.pg_id));
        handleClose(false);
        setSnackGuardar(true);
        setForm({
          pg_tarjeta: "",
          pg_codigo: "",
          pg_vencimiento: "",
        });
      }
    } catch (error) {
      console.error("Error updating cliente:", error);
    }
  };
  // ------------------------------------------------

  const handleRequestSort = React.useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === "asc";
      const toggledOrder = isAsc ? "desc" : "asc";
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(
        rows,
        getComparator(toggledOrder, newOrderBy)
      );
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );

      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage, rows]
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.pg_id);
      setSelected(newSelected);
      console.log(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, pg_id) => {
    const selectedIndex = selected.indexOf(pg_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, pg_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    console.log(newSelected);
    setSelected(newSelected);
  };

  const handleChangePage = React.useCallback(
    (event, newPage) => {
      setPage(newPage);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage
      );

      setVisibleRows(updatedRows);

      // Avoid a layout jump when reaching the last page with empty rows.
      const numEmptyRows =
        newPage > 0
          ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length)
          : 0;

      const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
      setPaddingHeight(newPaddingHeight);
    },
    [order, orderBy, dense, rowsPerPage, rows]
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage
      );

      setVisibleRows(updatedRows);

      // There is no layout jump to handle on the first page.
      setPaddingHeight(0);
    },
    [order, orderBy, rows]
  );

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (pg_id) => selected.indexOf(pg_id) !== -1;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* {snack === true && ( */}
        <CustomizedSnackbars snack={snack} setSnack={setSnack} />
        <CustomizedSnackbarsGuardar
          snackGuardar={snackGuardar}
          setSnackGuardar={setSnackGuardar}
        />
        <CustomizedSnackbarsAñadir
          snackAñadir={snackAñadir}
          setSnackAñadir={setSnackAñadir}
        />
        <CustomizedSnackbarsBorrar
          snackBorrar={snackBorrar}
          setSnackBorrar={setSnackBorrar}
        />
        <StyledModal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          slots={{ backdrop: StyledBackdrop }}
        >
          <Box sx={style}>
            <h2 id="unstyled-modal-title">
              {title}
              <IconButton
                color="info"
                style={{ marginLeft: 110 }}
                onClick={handleClose}
              >
                <ClearIcon />
              </IconButton>
            </h2>
            <p id="unstyled-modal-description">Tarjeta</p>
            <CustomInput
              aria-label="Demo input"
              placeholder="Type something…"
              value={form.pg_tarjeta}
              onChange={(e) => setForm({ ...form, pg_tarjeta: e.target.value })}
            />
            <p id="unstyled-modal-description">Codigo</p>
            <CustomInput
              aria-label="Demo input"
              placeholder="Type something…"
              value={form.pg_codigo}
              onChange={(e) => setForm({ ...form, pg_codigo: e.target.value })}
            />
            <p id="unstyled-modal-description">Vencimiento</p>
            <CustomInput
              aria-label="Demo input"
              placeholder="Type something…"
              value={form.pg_vencimiento}
              onChange={(e) =>
                setForm({ ...form, pg_vencimiento: e.target.value })
              }
            />
            <p id="unstyled-modal-description">Id cliente</p>
            <CustomInput
              aria-label="Demo input"
              placeholder="Type something…"
              value={form.pg_id_cliente}
              onChange={(e) =>
                setForm({ ...form, pg_id_cliente: e.target.value })
              }
            />

            <div style={{ paddingTop: 30, marginLeft: 75 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<ClearIcon />}
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={<SendIcon />}
                  onClick={validar}
                >
                  {btn}
                </Button>
              </Stack>
            </div>
          </Box>
        </StyledModal>
        {openModal && (
          <DeleteModal
            handleCloseModal={handleCloseModal}
            borrarProducto={borrarProducto}
            selected={selected}
          />
        )}
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          rows={rows}
          handleShowEdit={handleShowEdit}
          handleShowCreate={handleShowCreate}
          handleDelete={handleDelete}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows
                ? visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.pg_id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.pg_id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.pg_id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.pg_id}
                        </TableCell>
                        <TableCell align="right">{row.pg_tarjeta}</TableCell>
                        <TableCell align="right">{row.pg_codigo}</TableCell>
                        <TableCell align="right">
                          {row.pg_vencimiento}
                        </TableCell>
                        <TableCell align="center">
                          {row.pg_id_cliente}
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
              {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}

//style modal-----------------------------------------------------------------------------------
Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = (theme) => ({
  width: 400,
  bgcolor: theme.palette.mode === "dark" ? "#0A1929" : "white",
  border: "2px solid currentColor",
  padding: "16px 32px 24px 32px",
});
//style modal-----------------------------------------------------------------------------------

//style input-----------------------------------------------------------------------------------

const CustomInput = React.forwardRef(function CustomInput(props, ref) {
  return <Input slots={{ input: StyledInputElement }} {...props} ref={ref} />;
});

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};

const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};

const StyledInputElement = styled("input")(
  ({ theme }) => `
  width: 370px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === "dark" ? grey[900] : grey[50]
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[500] : blue[200]
    };
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);
//style input-----------------------------------------------------------------------------------
