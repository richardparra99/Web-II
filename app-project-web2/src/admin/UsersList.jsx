import { useEffect, useState } from "react";
import {
    Container,
    Table,
    Spinner,
    Badge,
    Button,
    Form,
    Modal,
} from "react-bootstrap";
import Header from "../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import {
    getUsers,
    updateUserRoles,
    createUser,
    updateUser,
    changeUserPassword,
    deleteUser,
} from "../../services/UserService";

const ALL_ROLES = ["ADMIN", "ORGANIZER", "PARTICIPANT", "VALIDATOR"];

const UsersList = () => {
    const { isAdmin } = useAuthentication(true); // requiere login
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [savingId, setSavingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // ---------- MODAL: NUEVO USUARIO ----------
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const [newFullName, setNewFullName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRoles, setNewRoles] = useState(["PARTICIPANT"]); // por defecto

    // ---------- MODAL: EDITAR USUARIO ----------
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [editFullName, setEditFullName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRoles, setEditRoles] = useState([]);
    const [editing, setEditing] = useState(false);

    // ---------- MODAL: CAMBIAR CONTRASEÑA ----------
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordUser, setPasswordUser] = useState(null);
    const [passwordValue, setPasswordValue] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await getUsers();
                setUsers(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, []);

    if (!isAdmin) {
        return (
            <>
                <Header />
                <Container className="main-page mt-3">
                    <p>No tienes permisos para ver esta página.</p>
                </Container>
            </>
        );
    }

    // ---------- ROLES EN LA TABLA ----------
    const toggleRole = (userId, role) => {
        setUsers((prev) =>
            prev.map((u) => {
                if (u.id !== userId) return u;
                const roles = u.roles || [];
                const hasRole = roles.includes(role);
                return {
                    ...u,
                    roles: hasRole
                        ? roles.filter((r) => r !== role)
                        : [...roles, role],
                };
            }),
        );
    };

    const handleSaveRoles = async (user) => {
        try {
            setSavingId(user.id);
            const roles = user.roles || [];
            const updated = await updateUserRoles(user.id, roles);
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? updated : u)),
            );
            alert("Roles actualizados correctamente");
        } catch (e) {
            console.error(e);
        } finally {
            setSavingId(null);
        }
    };

    // ---------- MODAL: NUEVO USUARIO ----------
    const toggleNewRole = (role) => {
        setNewRoles((prev) => {
            const hasRole = prev.includes(role);
            if (hasRole) {
                const next = prev.filter((r) => r !== role);
                return next.length > 0 ? next : ["PARTICIPANT"];
            }
            return [...prev, role];
        });
    };

    const resetCreateForm = () => {
        setNewFullName("");
        setNewEmail("");
        setNewPassword("");
        setNewRoles(["PARTICIPANT"]);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        if (!newFullName.trim() || !newEmail.trim() || !newPassword.trim()) {
            alert("Nombre, email y contraseña son obligatorios.");
            return;
        }
        if (newPassword.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            setCreating(true);
            const created = await createUser({
                fullName: newFullName.trim(),
                email: newEmail.trim(),
                password: newPassword,
                roles: newRoles,
            });

            setUsers((prev) => [...prev, created]);
            resetCreateForm();
            setShowCreateModal(false);
            alert("Usuario creado correctamente");
        } catch (e) {
            console.error(e);
        } finally {
            setCreating(false);
        }
    };

    // ---------- EDITAR DATOS (abre modal) ----------
    const handleEditUser = (user) => {
        setEditUser(user);
        setEditFullName(user.fullName || "");
        setEditEmail(user.email || "");
        setEditRoles(user.roles && user.roles.length > 0 ? user.roles : ["PARTICIPANT"]);
        setShowEditModal(true);
    };

    const toggleEditRole = (role) => {
        setEditRoles((prev) => {
            const hasRole = prev.includes(role);
            if (hasRole) {
                const next = prev.filter((r) => r !== role);
                return next.length > 0 ? next : ["PARTICIPANT"];
            }
            return [...prev, role];
        });
    };

    const resetEditForm = () => {
        setEditUser(null);
        setEditFullName("");
        setEditEmail("");
        setEditRoles([]);
    };

    const handleSubmitEditUser = async (e) => {
        e.preventDefault();
        if (!editUser) return;

        if (!editFullName.trim() || !editEmail.trim()) {
            alert("Nombre y email son obligatorios.");
            return;
        }

        try {
            setEditing(true);
            const updated = await updateUser(editUser.id, {
                fullName: editFullName.trim(),
                email: editEmail.trim(),
                roles: editRoles,
            });

            setUsers((prev) =>
                prev.map((u) => (u.id === editUser.id ? updated : u)),
            );
            alert("Usuario actualizado correctamente");
            setShowEditModal(false);
            resetEditForm();
        } catch (err) {
            console.error(err);
        } finally {
            setEditing(false);
        }
    };

    // ---------- CAMBIAR CONTRASEÑA (abre modal) ----------
    const handleChangePassword = (user) => {
        setPasswordUser(user);
        setPasswordValue("");
        setShowPasswordModal(true);
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        if (!passwordUser) return;

        const pwd = passwordValue.trim();
        if (pwd.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            setChangingPassword(true);
            await changeUserPassword(passwordUser.id, pwd);
            alert("Contraseña actualizada correctamente");
            setShowPasswordModal(false);
            setPasswordUser(null);
            setPasswordValue("");
        } catch (err) {
            console.error(err);
        } finally {
            setChangingPassword(false);
        }
    };

    // ---------- ELIMINAR USUARIO ----------
    const handleDeleteUser = async (user) => {
        const ok = window.confirm(
            `¿Seguro que deseas eliminar al usuario "${user.fullName || user.email}"?`,
        );
        if (!ok) return;

        try {
            setDeletingId(user.id);
            await deleteUser(user.id);
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
            alert("Usuario eliminado correctamente");
        } catch (e) {
            console.error(e);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Header />
            <Container className="main-page mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="mb-0">Administración de usuarios</h1>
                    <Button
                        variant="success"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Nuevo usuario
                    </Button>
                </div>

                {/* Tabla de usuarios */}
                {loading ? (
                    <div className="text-center mt-4">
                        <Spinner animation="border" />{" "}
                        <span className="ms-2">Cargando usuarios...</span>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre completo</th>
                                    <th>Email</th>
                                    <th>Roles actuales</th>
                                    <th>Editar roles</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, idx) => (
                                    <tr key={u.id}>
                                        <td>{idx + 1}</td>
                                        <td>{u.fullName}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            {(u.roles || []).map((r) => (
                                                <Badge
                                                    key={r}
                                                    bg="secondary"
                                                    className="me-1"
                                                >
                                                    {r}
                                                </Badge>
                                            ))}
                                            {(!u.roles ||
                                                u.roles.length === 0) && (
                                                    <span className="text-muted">
                                                        Sin roles
                                                    </span>
                                                )}
                                        </td>
                                        <td>
                                            {ALL_ROLES.map((role) => (
                                                <div
                                                    key={role}
                                                    className="form-check"
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`u${u.id}-${role}`}
                                                        checked={
                                                            u.roles?.includes(
                                                                role,
                                                            ) || false
                                                        }
                                                        onChange={() =>
                                                            toggleRole(
                                                                u.id,
                                                                role,
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`u${u.id}-${role}`}
                                                    >
                                                        {role}
                                                    </label>
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    disabled={savingId === u.id}
                                                    onClick={() =>
                                                        handleSaveRoles(u)
                                                    }
                                                >
                                                    {savingId === u.id
                                                        ? "Guardando..."
                                                        : "Guardar roles"}
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    disabled={savingId === u.id}
                                                    onClick={() =>
                                                        handleEditUser(u)
                                                    }
                                                >
                                                    Editar datos
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline-warning"
                                                    disabled={savingId === u.id}
                                                    onClick={() =>
                                                        handleChangePassword(u)
                                                    }
                                                >
                                                    Cambiar contraseña
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    disabled={
                                                        deletingId === u.id
                                                    }
                                                    onClick={() =>
                                                        handleDeleteUser(u)
                                                    }
                                                >
                                                    {deletingId === u.id
                                                        ? "Eliminando..."
                                                        : "Eliminar"}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Container>

            {/* Modal de creación de usuario */}
            <Modal
                show={showCreateModal}
                onHide={() => {
                    setShowCreateModal(false);
                    resetCreateForm();
                }}
            >
                <Form onSubmit={handleCreateUser}>
                    <Modal.Header closeButton>
                        <Modal.Title>Crear nuevo usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2" controlId="newFullName">
                            <Form.Label>Nombre completo</Form.Label>
                            <Form.Control
                                type="text"
                                value={newFullName}
                                onChange={(e) =>
                                    setNewFullName(e.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="newEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newEmail}
                                onChange={(e) =>
                                    setNewEmail(e.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>Contraseña inicial</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                required
                                minLength={6}
                            />
                            <Form.Text muted>
                                Mínimo 6 caracteres.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Roles</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                                {ALL_ROLES.map((role) => (
                                    <Form.Check
                                        key={role}
                                        type="checkbox"
                                        id={`new-${role}`}
                                        label={role}
                                        checked={newRoles.includes(role)}
                                        onChange={() => toggleNewRole(role)}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowCreateModal(false);
                                resetCreateForm();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="success"
                            type="submit"
                            disabled={creating}
                        >
                            {creating ? "Creando..." : "Crear usuario"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal de edición de usuario */}
            <Modal
                show={showEditModal}
                onHide={() => {
                    setShowEditModal(false);
                    resetEditForm();
                }}
            >
                <Form onSubmit={handleSubmitEditUser}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Editar usuario
                            {editUser ? ` (${editUser.email})` : ""}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2" controlId="editFullName">
                            <Form.Label>Nombre completo</Form.Label>
                            <Form.Control
                                type="text"
                                value={editFullName}
                                onChange={(e) =>
                                    setEditFullName(e.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="editEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={editEmail}
                                onChange={(e) =>
                                    setEditEmail(e.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Roles</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                                {ALL_ROLES.map((role) => (
                                    <Form.Check
                                        key={role}
                                        type="checkbox"
                                        id={`edit-${role}`}
                                        label={role}
                                        checked={editRoles.includes(role)}
                                        onChange={() => toggleEditRole(role)}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowEditModal(false);
                                resetEditForm();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={editing}
                        >
                            {editing ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal de cambio de contraseña */}
            <Modal
                show={showPasswordModal}
                onHide={() => {
                    setShowPasswordModal(false);
                    setPasswordUser(null);
                    setPasswordValue("");
                }}
                centered
            >
                <Form onSubmit={handleSubmitPassword}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Cambiar contraseña
                            {passwordUser ? ` (${passwordUser.email})` : ""}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="passwordValue">
                            <Form.Label>Nueva contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={passwordValue}
                                onChange={(e) =>
                                    setPasswordValue(e.target.value)
                                }
                                required
                                minLength={6}
                            />
                            <Form.Text muted>
                                Debe tener al menos 6 caracteres.
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowPasswordModal(false);
                                setPasswordUser(null);
                                setPasswordValue("");
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="warning"
                            type="submit"
                            disabled={changingPassword}
                        >
                            {changingPassword
                                ? "Guardando..."
                                : "Guardar contraseña"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default UsersList;
