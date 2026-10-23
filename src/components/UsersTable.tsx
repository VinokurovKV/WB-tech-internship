import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import type { User } from "../types/user";

interface UsersTableProps {
  users: User[];
  totalUsers: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  onEditUser: (user: User) => void;
}

const genderLabels: Record<string, string> = {
  Male: "Мужской",
  Female: "Женский",
  Other: "Другой",
};

const avatarColors = ["#A76AF2", "#F47CB8", "#BA83F5", "#ED77B1"];

export default function UsersTable({
  users,
  totalUsers,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEditUser,
}: UsersTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: "hidden",
        borderRadius: 3,
        border: "1px solid #EEE6F5",
        boxShadow: "0 4px 24px rgba(60,20,100,0.04)",
      }}
    >
      <TableContainer
        sx={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Table
          sx={{
            minWidth: 950,
            "& .MuiTableCell-root": {
              borderColor: "#EEE6F5",
              whiteSpace: "nowrap",
              py: 1.6,
              px: 2,
              fontSize: 13,
              color: "#34264F",
            },
            "& .MuiTableCell-head": {
              color: "#5E477C",
              fontWeight: 700,
              bgcolor: "#F8F2FF",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ pl: "48px" }}>Имя</Box>
              </TableCell>
              <TableCell>Фамилия</TableCell>
              <TableCell>Электронная почта</TableCell>
              <TableCell>Номер телефона</TableCell>
              <TableCell>Возраст</TableCell>
              <TableCell>Пол</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow
                  key={user.id}
                  sx={{
                    transition: "background-color 0.15s",
                    "&:hover": { bgcolor: "#FCF9FF" },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: avatarColors[index % avatarColors.length],
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {`${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase()}
                      </Avatar>
                      {user.firstName}
                    </Box>
                  </TableCell>

                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.age}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={genderLabels[user.gender] ?? user.gender}
                      sx={{
                        bgcolor:
                          user.gender === "Female" ? "#FFE4F1" : "#EDE5FF",
                        color: user.gender === "Female" ? "#D82F91" : "#6633BE",
                        fontWeight: 500,
                        borderRadius: 1.5,
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      aria-label={`Редактировать ${user.firstName} ${user.lastName}`}
                      onClick={() => onEditUser(user)}
                      sx={{
                        color: "#7C3AC6",
                        "&:hover": {
                          bgcolor: "#F2E7FF",
                        },
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
        labelRowsPerPage={isMobile ? "Строк:" : "Строк на странице:"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} из ${count}`
        }
        getItemAriaLabel={(type) => {
          switch (type) {
            case "first":
              return "Первая страница";
            case "last":
              return "Последняя страница";
            case "next":
              return "Следующая страница";
            case "previous":
              return "Предыдущая страница";
          }
        }}
        sx={{
          borderTop: "1px solid #EEE6F5",
          color: "#66547E",

          "& .MuiTablePagination-toolbar": {
            flexWrap: "nowrap",
            justifyContent: "flex-end",
            minHeight: 64,
            px: { xs: 0.5, sm: 2 },
            gap: { xs: 0, sm: 1 },
          },

          "& .MuiTablePagination-selectLabel": {
            fontSize: { xs: 10, sm: 14 },
            whiteSpace: "nowrap",
          },

          "& .MuiTablePagination-input": {
            flexShrink: 0,
            mx: { xs: 0, sm: 1 },
          },

          "& .MuiTablePagination-select": {
            fontSize: { xs: 12, sm: 14 },
            pl: { xs: 0.5, sm: 1 },
          },

          "& .MuiTablePagination-displayedRows": {
            fontSize: { xs: 10, sm: 14 },
            whiteSpace: "nowrap",
            flexShrink: 0,
          },

          "& .MuiTablePagination-actions": {
            display: "flex",
            flexShrink: 0,
            ml: { xs: 0, sm: 1 },
          },

          "& .MuiIconButton-root": {
            color: "#8122C8",
            p: { xs: 0.5, sm: 1 },

            "&.Mui-disabled": {
              color: "#CFC6D9",
            },
          },
        }}
      />
    </Paper>
  );
}
