import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import Swal from 'sweetalert2'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import toastr from '../../../../assets/includes/Toastr'

import { BsTrash3 } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import { VscMail } from "react-icons/vsc";
import { PiPasswordThin, PiUserPlusLight } from "react-icons/pi";
import { IoPhonePortraitOutline } from "react-icons/io5";
import SendIcon from '@mui/icons-material/Send';
import { useUserContext } from "../../../../context/UserContext";
import { getLocalStorage, setLocalStorage } from "../../../../assets/includes/localStorage";

function UserList() {

    const { usuarios, roles, getUsers, errorsUser, responseMessageUser, registrarUsuario, getUsuario } = useUserContext();

    const [showPasswordInput, setShowPasswordInput] = useState(false);

    //  !Logica guardar usuarios
    const [usuarioEdit, setUsuarioEdit] = useState({})

    const [id, setId] = useState('')
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [correo, setCorreo] = useState('')
    const [celular, setCelular] = useState('')
    const [password, setPassword] = useState('')
    const [estado, setEstado] = useState('')
    const [RolId, setRolId] = useState('')
    const [fechaNacimiento, setFechaNacimiento] = useState('')

    const handleChange = (event) => {
        setRolId(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const datosUsuario = {
            id: parseInt(id),
            nombre, apellido, correo, celular, password, estado, RolId, fechaNacimiento
        }
        registrarUsuario(datosUsuario)
    }

    const resetForm = () => {
        setId('');
        setNombre('');
        setApellido('');
        setCorreo('');
        setCelular('');
        setPassword('');
        setEstado('');
        setRolId('');
        setFechaNacimiento('');

    }

    useEffect(() => {
        if (errorsUser.length != 0) {
            errorsUser.map(error => {
                return toastr.error(error)
            })
        }
    }, [errorsUser]);

    useEffect(() => {
        if (responseMessageUser.length != 0) {
            responseMessageUser.map(msg => {
                toastr.success(msg)
            })
            getUsers()
            resetForm();
        }

    }, [responseMessageUser]);

    const navegarAUsuario = (usuarioId) => {
        setLocalStorage('UsuarioIdEdit', usuarioId)
    }


    const columns = [
        {
            field: "actions",
            headerName: "Acciones",
            width: 150,
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "center",
                    }}>
                    <Tooltip title="Editar">
                        <Button>
                            <FiEdit2
                                onClick={() => {
                                    handleOpenEdit()
                                    navegarAUsuario(params.row.id)
                                }}
                                style={{
                                    textAlign: "center",
                                    fontSize: "20px",
                                    borderRadius: "5px",
                                    color: "#000",
                                }}

                            />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <Button>
                            <BsTrash3
                                onClick={showSwal}
                                style={{
                                    textAlign: "center",
                                    fontSize: "20px",
                                    borderRadius: "5px",
                                    color: "#000",
                                }}
                            />
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
        { field: "id", headerName: "ID", width: 100 },
        {
            field: "nombre",
            headerName: "Nombres",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "apellido",
            headerName: "Apellido",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "correo",
            headerName: "Correo",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "celular",
            headerName: "Número de Celular",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "estado",
            headerName: "Estado",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "RolId",
            headerName: "Rol ID",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "fechaNacimiento",
            headerName: "Fecha de Nacimiento",
            width: 200,
            headerAlign: "center",
            align: "center",
            cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY"),
        },
        {
            field: "createdAt",
            headerName: "Fecha de Creación",
            width: 200,
            headerAlign: "center",
            align: "center",
            cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY"),
        }
    ];

    useEffect(() => {
        getUsers();
    }, []);

    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const [openNew, setOpenNew] = useState(false);
    const handleOpenNew = () => setOpenNew(true);
    const handleCloseNew = () => setOpenNew(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        alignItems: 'center',
    };

    const showSwal = () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger me-4"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "¿Seguro que quieres borrarlo?",
            text: "No lo podras revertir",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, deseo borrarlo",
            cancelButtonText: "No, cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire({
                    title: "Borrado!",
                    text: "Tu archivo se ha borrado.",
                    icon: "success"
                });
            } else if (

                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelado",
                    text: "Acción cancelada",
                    icon: "error"
                });
            }
        });
    }

    const buscarUsuario = async () => {
        const idUsuario = parseInt(getLocalStorage('UsuarioIdEdit'));
        const usuario = await getUsuario(idUsuario);
        if (!usuario.ok || !idUsuario) {
            setOpenEdit(false)
        } else {
            setUsuarioEdit(usuario.data)
        }
    }

    useEffect(() => {
        if (openEdit) {
            buscarUsuario()
        }
    }, [openEdit])

    return (
        <>
            <div style={{ height: 500, width: "100%", marginTop: '-100px' }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    style={{ textAlign: 'center', marginBottom: '30px', }}
                >
                    <Button
                        variant="contained"
                        color="success"
                        endIcon={<SendIcon />}
                        onClick={handleOpenNew}
                    >
                        Añadir
                    </Button>
                </Grid>
                <DataGrid
                    rows={usuarios}
                    columns={columns}
                    pageSize={5}
                    pageSizeOptions={[5, 10, 25, 100]}
                    disablePageSizeSelector
                    editMode='row'
                    hideFooterSelectedRowCount
                    ignoreDiacritic
                    disableDensitySelector
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: "id", sort: "asc" }],
                        },
                    }}
                    scrollbarSize={10}
                    scrollbarColor="#000"
                    scrollbarTrackColor="#ccc"
                    scrollbarThumbColor="#ff0000"
                    style={{ color: "var(--black)", border: "1px solid var(--black)" }}
                    sx={{
                        "..MuiDataGrid": {
                            borderRadius: 0
                        },
                        ".MuiDataGrid-toolbarContainer": {
                            background: "var(--black-background)",
                            color: "var(--white)",
                        },
                        ".MuiInputBase-root": {
                            color: "var(--white)",
                        },
                        ".MuiDataGrid-columnHeader": {
                            background: "var(--black-background)",
                            color: "var(--white)",
                            borderRadius: 0
                        },
                        ".MuiToolbar-root": {
                            background: "var(--black-background)",
                            color: "var(--white)",
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center'
                        },
                        '.MuiTablePagination-actions': {
                            color: "var(--white)",
                        },
                        '.MuiTablePagination-selectLabel': {
                            color: "var(--white)",
                            marginTop: '14px',
                            textAlign: 'center'
                        },
                        '.MuiTablePagination-displayedRows': {
                            color: "var(--white)",
                            marginTop: '14px',
                        },
                        '.MuiDataGrid-footerContainer': {
                            background: "var(--black-background)",
                            color: "var(--white)",
                            textAlign: 'center'
                        },
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "var(--hover)",
                            color: "#000",
                            fontWeight: "500",
                            transition: "all 0.3s ease-in-out",
                        },
                    }}
                />
            </div>
            <div>
                {/* //! Modal Crear */}
                <Modal
                    open={openNew}
                    onClose={handleCloseNew}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}
                        component="form"
                        id="crearUsuario"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <h1 style={{ textAlign: 'center' }}>Crea un nuevo Usuario</h1>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    id="Id"
                                    label="Identificación"
                                    variant="standard"
                                    type="number"
                                    maxLength="20"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel id="fechaNacimiento">Fecha Nacimiento</InputLabel>
                                <TextField
                                    id="fechaNacimiento"
                                    variant="standard"
                                    value={fechaNacimiento}
                                    type="date"
                                    onChange={(e) => setFechaNacimiento(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl variant="standard" sx={{ width: '100%' }}>
                                    <InputLabel id="rol">Rol</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={RolId}
                                        onChange={(e) => setRolId(e.target.value)}
                                        label="Rol"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            roles.map((rol, i) => {
                                                const disabled = rol.rolKey === 'WM'
                                                return (
                                                    <MenuItem key={i} value={rol.id} disabled={disabled}>{rol.rol}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl variant="standard" sx={{ width: '100%' }}>
                                    <InputLabel id="estado">Estado</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                        label="Estado"
                                    >
                                        <MenuItem value={false}>Inactivo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="nombre"
                                    label="Nombre"
                                    variant="standard"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="apellido"
                                    label="Apellido"
                                    variant="standard"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="correo"
                                    label="Correo"
                                    variant="standard"
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="celular"
                                    label="Celular"
                                    variant="standard"
                                    type="number"
                                    value={celular}
                                    onChange={(e) => setCelular(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="standard" sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: '20px' }}>
                                    <TextField
                                        id="password"
                                        label="Contraseña"
                                        variant="standard"
                                        type="password"
                                        value={password}
                                        fullWidth
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="success" type="submit" fullWidth>
                                    Guardar
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>
            {/* //! Modal Editar */}
            <div>
                <Modal
                    open={openEdit}
                    onClose={handleCloseEdit}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}
                        component="form"
                        noValidate
                        autoComplete="off"
                    >
                        <h1 style={{ textAlign: 'center' }} >Actualiza tus datos</h1>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-evenly"
                            alignItems="center"
                        >
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 210 }}>
                                <InputLabel id="RolId">Rol</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    onChange={handleChange}
                                    label="RolId"
                                    name="RolId"
                                >
                                    {
                                        usuarioEdit && (

                                            roles.filter(rol => rol.id === usuarioEdit.RolId).map((rol, i) => {
                                                return (
                                                    <MenuItem value={rol.id} key={i}><em><b>{rol.rol} por Defecto</b></em> </MenuItem>
                                                )
                                            })
                                        )
                                    }
                                    {
                                        usuarioEdit && (
                                            roles.map((rol, i) => {
                                                const disabled = rol.rolKey === 'WM'
                                                const hidden = usuarioEdit.RolId === rol.id
                                                return (
                                                    <MenuItem key={i} value={rol.id} hidden={hidden} disabled={disabled}>{rol.rol}</MenuItem>
                                                )
                                            })
                                        )
                                    }
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 210 }}>
                                <InputLabel id="estado">estado</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    onChange={handleChange}
                                    name="estado"
                                >
                                    {<MenuItem value={usuarioEdit.estado}><em><b>{usuarioEdit.estado ? 'Activo' : 'Inactivo'} por Defecto</b></em> </MenuItem>}
                                    {<MenuItem value={!usuarioEdit.estado}>{!usuarioEdit.estado ? 'Activo' : 'Inactivo'}</MenuItem>}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard">
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', }}>
                                    <PiUserPlusLight
                                        sx={{ color: 'action.active', mr: 1, fontSize: '40px' }}
                                        style={{ marginBottom: '10', marginRight: '10' }}
                                    />
                                    <TextField id="nombre" value={usuarioEdit.nombre} name="nombre" label="Nombre" variant="standard" />
                                </Box>
                            </FormControl>
                            <FormControl variant="standard">
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', }}>
                                    <PiUserPlusLight
                                        sx={{ color: 'action.active', mr: 1, fontSize: '40px' }}
                                        style={{ marginBottom: '10', marginRight: '10' }}
                                    />
                                    <TextField id="apellido" value={usuarioEdit.apellido} name="apellido" label="Apellido" variant="standard" />
                                </Box>
                            </FormControl>
                            <FormControl variant="standard">
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', }}>
                                    <VscMail
                                        sx={{ color: 'action.active', mr: 1, fontSize: '40px' }}
                                        style={{ marginBottom: '10', marginRight: '10' }}
                                    />
                                    <TextField id="correo" value={usuarioEdit.correo} name="correo" label="Correo" variant="standard" />
                                </Box>
                            </FormControl>
                            <FormControl variant="standard">
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', }}>
                                    <IoPhonePortraitOutline
                                        sx={{ color: 'action.active', mr: 1, fontSize: '40px' }}
                                        style={{ marginBottom: '10', marginRight: '10' }}
                                    />
                                    <TextField id="celular" value={usuarioEdit.celular} name="celular" label="Celular" variant="standard" />
                                </Box>
                            </FormControl>

                            {/* //! Esconder Cambiar contraseña */}

                            <Grid
                                container
                                direction="column"
                                justifyContent="space-evenly"
                                alignItems="center"
                            >
                                <FormControlLabel
                                    style={{ textAlign: 'center', marginTop: '20px' }}
                                    control={<Checkbox checked={showPasswordInput} onChange={() => setShowPasswordInput(!showPasswordInput)} />}
                                    label="Cambiar Contraseña"
                                />
                                {showPasswordInput && (
                                    <FormControl variant="standard">
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', }} style={{ marginBottom: '20px' }}>
                                            <PiPasswordThin
                                                sx={{ color: 'action.active', mr: 1, fontSize: '40px' }}
                                                style={{ marginBottom: '10', marginRight: '10' }}
                                            />
                                            <TextField
                                                id="password"
                                                label="Contraseña"
                                                variant="standard"
                                                type="password" />

                                            <PiPasswordThin
                                                sx={{ color: 'action.active', mr: 1, fontSize: '40px' }}
                                                style={{ marginBottom: '10', marginRight: '10' }}
                                            />
                                            <TextField
                                                id="password_valid"
                                                label="Repetir Contraseña"
                                                variant="standard"
                                                type="password" />
                                        </Box>
                                    </FormControl>
                                )}
                            </Grid>
                            <Button
                                variant="contained"
                                color="success"
                                style={{ marginTop: '20px' }}
                                fullWidth
                            >
                                Guardar
                            </Button>
                        </Grid>
                    </Box>
                </Modal>
            </div>
        </>
    );
}

export default UserList;
