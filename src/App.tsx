import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import { getUsers, getUsersCount } from "./api/users";
import UsersTable from "./components/UsersTable";
import type { User } from "./types/user";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    getUsersCount().then(setTotalUsers).catch(console.error);
  }, []);

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
  }, [page, rowsPerPage]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          wb-tech
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">Failed to load users</Alert>
        ) : (
          <UsersTable
            users={users}
            totalUsers={totalUsers}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={(value) => {
              setRowsPerPage(value);
              setPage(0);
            }}
          />
        )}
      </Box>
    </Container>
  );
}

export default App;
