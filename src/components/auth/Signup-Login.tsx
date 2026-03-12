import { useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { alert, loginUser, logoutUser } from "../../features/actions/authSlice";
import type { AppDispatch } from "../../app/store";
import { selectUser } from "../../features/actions/actionsSelectors";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = "login" | "signup";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

const Login = ({ isOpen, onClose }: LoginProps) => {
  const [mode, setMode] = useState<Mode>("login");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
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

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));

    setForm({
      email: "",
      password: "",
      confirmPassword: "",
    });
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
      localStorage.setItem("token", data.token);
      dispatch(loginUser(data.user));
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {!user.email ? (
          <div>
            <h2>{mode === "login" ? "Login" : "Signup"}</h2>

            <form onSubmit={submitHandler}>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={changeHandler}
                  required
                />
              </div>

              {mode === "signup" && (
                <div className="input-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={changeHandler}
                    required
                  />
                </div>
              )}

              <button type="submit" className="login-btn">
                {mode === "login" ? "Login" : "Signup"}
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => {
              dispatch(logoutUser());
              onClose();
            }}
            type="submit"
            className="login-btn"
          >
            Logout
          </button>
        )}
        {!user.email && (
          <p className="switch-auth" onClick={switchMode}>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
