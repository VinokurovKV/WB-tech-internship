import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";

import type { UserFormData } from "../types/user";

interface UserFormDialogProps {
  open: boolean;
  initialValues?: UserFormData;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
}

const emptyForm: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  age: 0,
  gender: "",
  nationality: "",
  hobbies: "",
};

const inputStyles = {
  borderRadius: 2,
  fontSize: 14,
  bgcolor: "#FFFFFF",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#DDD1F2",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#B48BE6",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#8D29CD",
    borderWidth: 2,
  },
  "& input": {
    py: 1.5,
  },
  "& input::placeholder": {
    color: "#9A8EAE",
    opacity: 1,
  },
};

const labelStyles = {
  mb: 0.75,
  fontSize: 13,
  fontWeight: 500,
  color: "#42316B",
  "&.Mui-focused": {
    color: "#42316B",
  },
  "& .MuiFormLabel-asterisk": {
    color: "#E52B83",
  },
};

const genderLabels: Record<string, string> = {
  Male: "Мужской",
  Female: "Женский",
  Other: "Другой",
};

export default function UserFormDialog({
  open,
  initialValues,
  onClose,
  onSubmit,
}: UserFormDialogProps) {
  const [form, setForm] = useState<UserFormData>(initialValues ?? emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (field: keyof UserFormData, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(false);

    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error("Failed to save user:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          width: { xs: "calc(100% - 32px)", sm: "calc(100% - 48px)" },
          maxHeight: { xs: "calc(100dvh - 32px)", sm: "90dvh" },
          m: { xs: 2, sm: 3 },
          borderRadius: { xs: 3, sm: 4 },
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(38, 12, 80, 0.25)",
        },
        "& .MuiBackdrop-root": {
          bgcolor: "rgba(25, 13, 49, 0.62)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2.5, sm: 4 },
          py: { xs: 2.5, sm: 3 },
          background: {
            xs: "#FFFFFF",
            sm: "linear-gradient(110deg, #5419AD 0%, #9630D7 60%, #EF3BAB 100%)",
          },
        }}
      >
        <Box>
          <DialogTitle
            sx={{
              p: 0,
              fontSize: { xs: 18, sm: 25 },
              fontWeight: 700,
              color: { xs: "#29164F", sm: "#FFFFFF" },
            }}
          >
            Добавить пользователя
          </DialogTitle>

          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              mt: 0.75,
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Заполните информацию о новом пользователе
          </Typography>
        </Box>

        <IconButton
          aria-label="Закрыть"
          size="small"
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: { xs: "#68548F", sm: "#FFFFFF" },
            "&:hover": {
              bgcolor: {
                xs: "#F6EFFF",
                sm: "rgba(255,255,255,0.15)",
              },
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <DialogContent
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: { xs: 2, sm: 3.5 },
            overflowY: "auto",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Не удалось сохранить пользователя
            </Alert>
          )}

          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <FormLabel sx={labelStyles}>Имя</FormLabel>
                <OutlinedInput
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Введите имя"
                  sx={inputStyles}
                  required
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <FormLabel sx={labelStyles}>Фамилия</FormLabel>
                <OutlinedInput
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Введите фамилию"
                  sx={inputStyles}
                  required
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <FormLabel sx={labelStyles}>Электронная почта</FormLabel>
                <OutlinedInput
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="example@mail.com"
                  sx={inputStyles}
                  required
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <FormLabel sx={labelStyles}>Номер телефона</FormLabel>
                <OutlinedInput
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  placeholder="+7 999 123-45-67"
                  sx={inputStyles}
                  required
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 6, sm: 6 }}>
              <FormControl fullWidth required>
                <FormLabel sx={labelStyles}>Возраст</FormLabel>
                <OutlinedInput
                  type="number"
                  value={form.age === 0 ? "" : form.age}
                  onChange={(e) => handleChange("age", Number(e.target.value))}
                  placeholder="18"
                  slotProps={{
                    input: {
                      min: 1,
                      max: 100,
                    },
                  }}
                  sx={{
                    ...inputStyles,
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                      appearance: "textfield",
                    },
                  }}
                  required
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 6, sm: 6 }}>
              <FormControl fullWidth required>
                <FormLabel sx={labelStyles}>Пол</FormLabel>
                <Select
                  value={form.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  displayEmpty
                  required
                  renderValue={(value) =>
                    value ? (
                      (genderLabels[value] ?? value)
                    ) : (
                      <Typography
                        component="span"
                        sx={{ fontSize: 13, color: "#9A8EAE" }}
                      >
                        Выберите пол
                      </Typography>
                    )
                  }
                  sx={{
                    ...inputStyles,
                    "& .MuiSelect-select": {
                      py: 1.5,
                      fontSize: 13,
                    },
                  }}
                >
                  <MenuItem value="Male">Мужской</MenuItem>
                  <MenuItem value="Female">Женский</MenuItem>
                  <MenuItem value="Other">Другой</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel sx={labelStyles}>Страна</FormLabel>
                <OutlinedInput
                  value={form.nationality}
                  onChange={(e) => handleChange("nationality", e.target.value)}
                  placeholder="Укажите страну"
                  sx={inputStyles}
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel sx={labelStyles}>Увлечения</FormLabel>
                <OutlinedInput
                  value={form.hobbies}
                  onChange={(e) => handleChange("hobbies", e.target.value)}
                  placeholder="Например, спорт, музыка"
                  sx={inputStyles}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: { xs: 2.5, sm: 3 },
            gap: 1.5,
            borderTop: "1px solid #F1EBF8",
            justifyContent: { xs: "stretch", sm: "flex-end" },
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            fullWidth
            sx={{
              maxWidth: { sm: 160 },
              py: 1.1,
              borderRadius: 2,
              color: "#7130B7",
              borderColor: "#D6C0F1",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#8D29CD",
                bgcolor: "#FAF5FF",
              },
            }}
          >
            Отмена
          </Button>

          <Button
            type="submit"
            variant="contained"
            loading={loading}
            fullWidth
            sx={{
              maxWidth: { sm: 180 },
              py: 1.1,
              borderRadius: 2,
              background: "linear-gradient(100deg, #B72CE0, #7921D0)",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(138,35,204,0.2)",
              "&:hover": {
                background: "linear-gradient(100deg, #A321CF, #6919BE)",
              },
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
