import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "./../service/authService";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignInSide(props) {
  const [account, setAccount] = React.useState({
    email: "",
    password: "",
  });

  const [requires2FA, setRequires2FA] = React.useState(false);
  const [twoFactorCode, setTwoFactorCode] = React.useState("");
  const [sessionToken, setSessionToken] = React.useState("");
  const [email, setUserEmail] = React.useState("");
  const [captchaImage, setCaptchaImage] = React.useState(null);
  const [captchaVisible, setCaptchaVisible] = React.useState(false);
  const [captchaCode, setCaptchaCode] = React.useState("");
  const [captchaValidated, setCaptchaValidated] = React.useState(false);

  const handleAccountChange = (property, event) => {
    setAccount({ ...account, [property]: event.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.doLogIn(
        account.email,
        account.password
      );

      if (response.requiresTwoFactor) {
        toast.info("Código de verificação enviado para seu e-mail.");
        setRequires2FA(true);
        setSessionToken(response.sessionToken);
        setUserEmail(response.email);
      } else if (response.success) {
        toast.success("Login realizado com sucesso!");
        setTimeout(() => {
          props.history.push("/home");
        }, 2000);
      } else if (response.captchaImage) {
        toast.warn("Você precisa resolver o captcha.");
        setCaptchaImage(response.captchaImage);
        setCaptchaVisible(true);
      } else {
        toast.error(response.message || "Login inválido.");
      }
    } catch {
      toast.error("Erro ao tentar login. Tente novamente.");
    }
  };

  const handle2FACodeSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.verifyTwoFactorCode(
        email,
        twoFactorCode,
        sessionToken
      );
      if (response.success) {
        toast.success("Verificação de 2FA bem-sucedida! Redirecionando...");
        setTimeout(() => {
          props.history.push("/home");
        }, 2000);
      } else {
        toast.error("Código 2FA inválido.");
      }
    } catch {
      toast.error("Erro ao verificar o código 2FA.");
    }
  };

  const handleCaptchaVerification = async () => {
    try {
      const result = await authService.verifyCaptcha(
        account.email,
        captchaCode
      );
      if (result === "captcha-success") {
        toast.success("Captcha correto. Tente logar novamente.");
        setCaptchaVisible(false);
        setCaptchaValidated(true);
      } else if (result === "captcha-failure") {
        toast.error("Captcha incorreto. Tente novamente.");
      } else {
        toast.error("Erro na sessão do captcha.");
      }
    } catch {
      toast.error("Erro ao verificar o captcha.");
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={1}
        square
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          justifyContent: "center",
        }}
      >
        <ToastContainer position="top-center" autoClose={3000} />
        <Avatar sx={{ m: 0, bgcolor: "secondary.main" }}>
          <LockOutlineIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {requires2FA ? "Verificação 2FA" : "Entrar na conta"}
        </Typography>

        <Box
          component="form"
          noValidate
          sx={{ width: "100%", mt: 1 }}
          autoComplete="off"
          onSubmit={requires2FA ? handle2FACodeSubmit : handleLogin}
        >
          {!requires2FA ? (
            <>
              <TextField
                onChange={(event) => handleAccountChange("email", event)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoFocus
              />
              <TextField
                onChange={(event) => handleAccountChange("password", event)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              {/* Exibir captcha se necessário */}
              {captchaVisible && (
                <>
                  <img
                    src={`data:image/jpeg;base64,${captchaImage}`}
                    alt="Captcha"
                    style={{ width: "100%", marginTop: 16, marginBottom: 8 }}
                  />
                  <TextField
                    onChange={(e) => setCaptchaCode(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="captcha"
                    label="Digite o código da imagem"
                    id="captcha"
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 1, mb: 2 }}
                    onClick={handleCaptchaVerification}
                  >
                    Verificar Captcha
                  </Button>
                </>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                ENtrar
              </Button>
            </>
          ) : (
            <>
              <TextField
                onChange={(event) => setTwoFactorCode(event.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="twoFactorCode"
                label="Código de Verificação"
                name="twoFactorCode"
                autoComplete="off"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Verificar Código
              </Button>
            </>
          )}
          <Grid container>
            <Grid item>
              <Link href="#" variant="body2">
                {"Não tem uma conta? faça o cadastro"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
