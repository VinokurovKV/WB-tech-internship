import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";

import type { User } from "../types/user";

interface UsersTableProps {
  users: User[];
  totalUsers: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
}

export default function UsersTable({
  users,
  totalUsers,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: UsersTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First name</TableCell>
            <TableCell>Last name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone number</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Gender</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell>{user.gender}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalUsers}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) =>
          onRowsPerPageChange(Number(event.target.value))
        }
      />
    </TableContainer>
  );
}
