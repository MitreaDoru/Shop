import { useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { alert, loginUser, logoutUser } from "../../features/actions/authSlice";
import type { AppDispatch } from "../../app/store";
import {
  selectMode,
  selectUser,
} from "../../features/actions/actionsSelectors";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

const Login = ({ isOpen, onClose }: LoginProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const mode = useSelector(selectMode);
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "signup" && form.password !== form.confirmPassword) {
      dispatch(
        alert({
          title: "Passwords",
          message: "Please make sure both password fields match.",
        }),
      );
      return;
    }

    const url =
      mode === "login"
        ? "https://candle-1.onrender.com/login"
        : "https://candle-1.onrender.com/signup";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return;
      }
      if (mode !== "login") {
        onClose();
        dispatch(alert(data.alert));
      } else {
        localStorage.setItem("token", data.token);
        dispatch(loginUser(data.user));
        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="auth">
      <div className="auth__overlay">
        <div className="auth__modal">
          <button className="auth__close-btn" onClick={onClose}>
            ✕
          </button>

          {!user || user.isAdmin ? (
            <div className="auth__content">
              <h2 className="auth__title">
                {mode === "login" ? "Autentificare" : "Cont Nou"}
              </h2>

              <form className="auth__form" onSubmit={submitHandler}>
                <div className="auth__input-group">
                  <input
                    type="email"
                    name="email"
                    className="auth__input"
                    placeholder="Email"
                    onChange={changeHandler}
                    required
                  />
                </div>

                <div className="auth__input-group">
                  <input
                    type="password"
                    name="password"
                    className="auth__input"
                    placeholder="Parolă"
                    onChange={changeHandler}
                    required
                  />
                </div>

                {mode === "signup" && (
                  <div className="auth__input-group">
                    <input
                      type="password"
                      name="confirmPassword"
                      className="auth__input"
                      placeholder="Confirmă Parola"
                      onChange={changeHandler}
                      required
                    />
                  </div>
                )}

                <button type="submit" className="auth__submit-btn">
                  {mode === "login" ? "Intră în cont" : "Înregistrare"}
                </button>
              </form>
            </div>
          ) : (
            <div className="auth__logout-zone">
              <h3 className="auth__welcome">Salut, {user.email}!</h3>
              <button
                onClick={() => {
                  dispatch(logoutUser());
                  onClose();
                }}
                className="auth__submit-btn auth__submit-btn--logout"
              >
                Ieșire din cont
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
