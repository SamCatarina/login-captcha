import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const doLogIn = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      {
        email: email,
        password: password,
      },
      { withCredentials: true }
    );
    return response.data; // sucesso HTTP 2xx
  } catch (error) {
    if (error.response && error.response.data) {
      // retorna o corpo da resposta mesmo para status de erro
      return error.response.data;
    }
    // se for erro de rede ou outro, lança mesmo
    throw error;
  }
};

const verifyTwoFactorCode = async (email, code, sessionToken) => {
  try {
    const response = await axios.post(
      `${API_URL}/verify-2fa`,
      {
        email,
        code,
        session_token: sessionToken,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

const getCaptchaImage = async (captchaId) => {
  const response = await axios.get(`${API_URL}/captcha/${captchaId}`);
  return response.data.image;
};

const verifyCaptcha = async (email, captcha) => {
  const response = await axios.post(
    "http://localhost:8080/api/captcha/verify-captcha",
    {
      email,
      captcha,
    },
    { withCredentials: true }
  );
  return response.data;
};

export default {
  doLogIn,
  verifyTwoFactorCode,
  getCaptchaImage,
  verifyCaptcha,
};
