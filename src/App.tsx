import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Fab,
  Typography,
} from "@mui/material";

import { createUser, getUsers, getUsersCount, updateUser } from "./api/users";
import UsersTable from "./components/UsersTable";
import UserFormDialog from "./components/UserFormDialog";
import type { User, UserFormData } from "./types/user";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;

    getUsersCount()
      .then((count) => {
        if (active) setTotalUsers(count);
      })
      .catch(console.error);

    return () => {
      active = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    let active = true;

    getUsers(page + 1, rowsPerPage)
      .then((data) => {
        if (active) {
          setUsers(data);
          setError(false);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, rowsPerPage, refreshKey]);

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setError(false);
    setPage(newPage);
  };

  const handleRowsPerPageChange = (value: number) => {
    setLoading(true);
    setError(false);
    setRowsPerPage(value);
    setPage(0);
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

      setUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      );
    } else {
      await createUser(data);
      setPage(0);
    }

    setRefreshKey((prev) => prev + 1);
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
                  hobbies: selectedUser.hobbies,
                }
              : undefined
          }
          onClose={handleCloseDialog}
          onSubmit={handleSubmitUser}
        />
      )}
    </Box>
  );
}

export default App;
