import { useLayoutEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Fab,
  Snackbar,
  Typography,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";

import { createUser, updateUser } from "./api/users";
import UsersTable from "./components/UsersTable";
import UserFormDialog from "./components/UserFormDialog";
import type { User, UserFormData } from "./types/user";

const rowsPerPageOptions = [10, 25, 50];

function getPositiveInteger(value: string | null, fallback: number) {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

interface AppProps {
  allUsers: User[];
  setAllUsers: Dispatch<SetStateAction<User[]>>;
  loading: boolean;
  error: boolean;
  getScrollPosition: () => number;
  onScrollPositionChange: (position: number) => void;
}

interface Notification {
  severity: "success" | "error";
  message: string;
}

function App({
  allUsers,
  setAllUsers,
  loading,
  error,
  getScrollPosition,
  onScrollPositionChange,
}: AppProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedRowsPerPage = getPositiveInteger(
    searchParams.get("rowsPerPage"),
    10,
  );
  const rowsPerPage = rowsPerPageOptions.includes(requestedRowsPerPage)
    ? requestedRowsPerPage
    : 10;
  const page = getPositiveInteger(searchParams.get("page"), 1) - 1;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  const users = allUsers.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const totalUsers = allUsers.length;

  useLayoutEffect(() => {
    window.scrollTo(0, getScrollPosition());
  }, [getScrollPosition]);

  const handleOpenUser = (user: User) => {
    onScrollPositionChange(window.scrollY);
    navigate(`/users/${user.id}`, {
      state: {
        user,
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((params) => {
      const nextParams = new URLSearchParams(params);

      if (newPage === 0) nextParams.delete("page");
      else nextParams.set("page", String(newPage + 1));

      return nextParams;
    });
  };

  const handleRowsPerPageChange = (value: number) => {
    setSearchParams((params) => {
      const nextParams = new URLSearchParams(params);

      nextParams.delete("page");
      if (value === 10) nextParams.delete("rowsPerPage");
      else nextParams.set("rowsPerPage", String(value));

      return nextParams;
    });
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSubmitUser = async (data: UserFormData) => {
    if (selectedUser) {
      const updatedUser = await updateUser(selectedUser.id, data);

      setAllUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      );
    } else {
      const createdUser = await createUser(data);

      setAllUsers((prev) => [...prev, createdUser]);
      handlePageChange(0);
    }

    setNotification({
      severity: "success",
      message: "Пользователь успешно сохранён",
    });
  };

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "#F9F6FF" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(115deg, #4D18A8 0%, #8120D0 52%, #F03AA8 100%)",
          px: { xs: 3, md: 5 },
          pt: 6,
          pb: { xs: 7, md: 20 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 450,
            height: 450,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.08)",
            top: -320,
            left: "35%",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #B72AE8, #F547B5)",
            top: 100,
            right: "15%",
            pointerEvents: "none",
            opacity: 0.55,
          }}
        />

        <Container maxWidth={false} sx={{ px: { xs: 0, md: 2 } }}>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 34, md: 48 },
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#FFFFFF",
                  lineHeight: 1.15,
                }}
              >
                WB-tech
              </Typography>

              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: { xs: 14, md: 17 },
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Управление пользователями
              </Typography>
            </Box>

            <Fab
              aria-label="Добавить пользователя"
              onClick={handleAddUser}
              sx={{
                display: { xs: "flex", sm: "none" },
                flexShrink: 0,
                width: 56,
                height: 56,
                bgcolor: "#FFFFFF",
                color: "#8C20CF",
                "&:hover": { bgcolor: "#F6E9FF" },
              }}
            >
              <AddIcon fontSize="large" />
            </Fab>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                bgcolor: "#FFFFFF",
                color: "#6820B9",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 6px 20px rgba(45,0,90,0.15)",
                "&:hover": { bgcolor: "#F6E9FF" },
              }}
            >
              Добавить пользователя
            </Button>
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          mt: { xs: -3, md: -15 },
          px: { xs: 0, sm: 3, md: 5 },
          pb: 5,
        }}
      >
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: { xs: "28px 28px 0 0", sm: 4 },
            px: { xs: 1.5, sm: 2.5, md: 3 },
            pt: { xs: 3, md: 4 },
            pb: 4,
            minHeight: { xs: "75dvh", md: 550 },
            boxShadow: {
              xs: "none",
              sm: "0 16px 50px rgba(74,27,128,0.08)",
            },
          }}
        >
          {loading ? (
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                bgcolor: "#F9F6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1300,
              }}
            >
              <CircularProgress size={48} sx={{ color: "#8120D0" }} />
            </Box>
          ) : error ? (
            <Alert severity="error">Не удалось загрузить пользователей</Alert>
          ) : (
            <UsersTable
              users={users}
              totalUsers={totalUsers}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onEditUser={handleEditUser}
              onOpenUser={handleOpenUser}
            />
          )}
        </Box>
      </Container>

      {dialogOpen && (
        <UserFormDialog
          open={dialogOpen}
          initialValues={
            selectedUser
              ? {
                  firstName: selectedUser.firstName,
                  lastName: selectedUser.lastName,
                  email: selectedUser.email,
                  phoneNumber: selectedUser.phoneNumber,
                  age: selectedUser.age,
                  gender: selectedUser.gender,
                  nationality: selectedUser.nationality,
                  city: selectedUser.city,
                }
              : undefined
          }
          onClose={handleCloseDialog}
          onSubmit={handleSubmitUser}
          onSubmitError={() =>
            setNotification({
              severity: "error",
              message: "Не удалось сохранить пользователя",
            })
          }
        />
      )}

      <Snackbar
        open={notification !== null}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={(_, reason) => {
          if (reason !== "clickaway") setNotification(null);
        }}
      >
        <Alert
          severity={notification?.severity ?? "success"}
          variant="filled"
          onClose={() => setNotification(null)}
          sx={{ width: "100%" }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
