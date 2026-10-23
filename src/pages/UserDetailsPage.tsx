import { useEffect, useLayoutEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";

import { getUserById } from "../api/users";
import type { User } from "../types/user";

const genderLabels: Record<string, string> = {
  Male: "Мужской",
  Female: "Женский",
  Other: "Другой",
};

function formatAge(age: number) {
  const lastTwoDigits = Math.abs(age) % 100;
  const lastDigit = lastTwoDigits % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${age} лет`;
  if (lastDigit === 1) return `${age} год`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${age} года`;

  return `${age} лет`;
}

interface DetailRowProps {
  label: string;
  value: string | number | undefined;
}

interface UserDetailsLocationState {
  user?: User;
}

interface UserLoadResult {
  id: string;
  user: User | null;
  error: boolean;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Box
      sx={{
        py: { xs: 1.5, md: 1 },
        borderBottom: {
          xs: "1px solid #EEE6F5",
          md: "none",
        },
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Typography
        sx={{
          color: "#796A8F",
          fontSize: { xs: 12, md: 13 },
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "#29164F",
          fontSize: { xs: 14, md: 16 },
          fontWeight: 500,
          overflowWrap: "anywhere",
        }}
      >
        {value === "" || value === undefined || value === null ? "—" : value}
      </Typography>
    </Box>
  );
}

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as UserDetailsLocationState | null;
  const stateUser = locationState?.user;
  const routeUser = stateUser?.id === id ? stateUser : null;

  const [loadResult, setLoadResult] = useState<UserLoadResult | null>(null);
  const currentLoadResult = loadResult?.id === id ? loadResult : null;
  const user = routeUser ?? currentLoadResult?.user ?? null;
  const loading = Boolean(id && !routeUser && !currentLoadResult);
  const error = !id || currentLoadResult?.error === true;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!id || routeUser) return;

    let active = true;

    getUserById(id)
      .then((data) => {
        if (active) {
          setLoadResult({ id, user: data, error: false });
        }
      })
      .catch(() => {
        if (active) {
          setLoadResult({ id, user: null, error: true });
        }
      });

    return () => {
      active = false;
    };
  }, [id, routeUser]);

  const handleBack = () => {
    if (stateUser) {
      navigate(-1);
      return;
    }

    navigate("/", { replace: true });
  };

  const initials = user
    ? `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase()
    : "";

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "#F8F5FF" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 84, md: 230 },
          background:
            "linear-gradient(115deg, #4D18A8 0%, #8120D0 52%, #F03AA8 100%)",
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
            top: { xs: -100, md: 70 },
            right: { xs: -100, md: "15%" },
            pointerEvents: "none",
            opacity: 0.55,
          }}
        />

        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            position: "relative",
            height: 84,
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <IconButton
            aria-label="Вернуться к списку"
            onClick={handleBack}
            sx={{
              position: "absolute",
              left: 16,
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.15)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: 25,
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            WB-tech
          </Typography>
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            display: { xs: "none", md: "block" },
            position: "relative",
            pt: 5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton
              aria-label="Вернуться к списку"
              onClick={handleBack}
              sx={{
                color: "#FFFFFF",
                bgcolor: "rgba(255,255,255,0.12)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Box>
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: 40,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.15,
                }}
              >
                WB-tech
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 15,
                  mt: 0.5,
                }}
              >
                Профиль пользователя
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {loading ? (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#F8F5FF",
            zIndex: 1300,
          }}
        >
          <CircularProgress sx={{ color: "#8120D0" }} />
        </Box>
      ) : error || !user ? (
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Alert severity="error">
            Не удалось загрузить информацию о пользователе
          </Alert>
        </Container>
      ) : (
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            mt: { xs: 0, md: -9 },
            px: { xs: 2, md: 3 },
            pb: 6,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 4 },
              mt: { xs: 3, md: 0 },
              mb: { xs: 2, md: 3 },
              borderRadius: { xs: 3, md: 4 },
              border: "1px solid #EEE6F5",
              boxShadow: "0 8px 32px rgba(60,20,100,0.06)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 2, md: 3 },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 72, md: 96 },
                  height: { xs: 72, md: 96 },
                  bgcolor: "#EEE0FF",
                  color: "#8120D0",
                  fontWeight: 700,
                  fontSize: { xs: 26, md: 34 },
                }}
              >
                {initials}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 19, md: 30 },
                    fontWeight: 700,
                    color: "#29164F",
                    overflowWrap: "anywhere",
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>

                <Typography
                  sx={{
                    color: "#796A8F",
                    fontSize: { xs: 13, md: 14 },
                    mt: 0.5,
                  }}
                >
                  ID: {user.id}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 4 },
              borderRadius: { xs: 3, md: 4 },
              border: "1px solid #EEE6F5",
              boxShadow: "0 8px 32px rgba(60,20,100,0.06)",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 17, md: 21 },
                fontWeight: 700,
                color: "#29164F",
                mb: { xs: 1, md: 3 },
              }}
            >
              Основная информация
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                columnGap: 5,
                rowGap: { xs: 0, md: 3 },
              }}
            >
              <DetailRow label="Имя" value={user.firstName} />
              <DetailRow label="Фамилия" value={user.lastName} />
              <DetailRow label="Электронная почта" value={user.email} />
              <DetailRow label="Номер телефона" value={user.phoneNumber} />
              <DetailRow label="Возраст" value={formatAge(user.age)} />
              <DetailRow
                label="Пол"
                value={genderLabels[user.gender] ?? user.gender}
              />
              <DetailRow label="Страна" value={user.nationality} />
              <DetailRow label="Город" value={user.city} />
            </Box>

            <Box
              sx={{
                mt: { xs: 2, md: 4 },
                p: { xs: 2, md: 2.5 },
                borderRadius: 2,
                bgcolor: "#F5EDFF",
              }}
            >
              <DetailRow label="Дата создания" value={createdAt} />
            </Box>
          </Paper>
        </Container>
      )}
    </Box>
  );
}
