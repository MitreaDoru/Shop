import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { alert, closeAlert, loginUser } from "../features/actions/authSlice";
import { selectMode } from "../features/actions/actionsSelectors";
import type { AppDispatch } from "../app/store";
import type { User } from "../types/user";

interface AuthResponse {
  token: string;
  user: User;
  alert: {
    title: string;
    message: string;
  };
}
export const useAuthLogic = (onClose: () => void) => {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector(selectMode);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleResponse = (data: AuthResponse, resOk: boolean) => {
    if (resOk) {
      if (mode === "login") {
        localStorage.setItem("token", data.token);
        dispatch(loginUser(data.user));
        dispatch(alert(data.alert));
        setForm({ email: "", password: "", confirmPassword: "" });
        setTimeout(() => {
          dispatch(closeAlert());
          onClose();
        }, 2000);
      } else {
        dispatch(alert(data.alert));
        setForm({ email: "", password: "", confirmPassword: "" });

        setTimeout(() => {
          dispatch(closeAlert());
          onClose();
        }, 2000);
      }
    } else {
      if (data.alert) dispatch(alert(data.alert));
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && form.password !== form.confirmPassword) {
      dispatch(
        alert({ title: "Passwords", message: "Passwords do not match." }),
      );
      return;
    }

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_BE_URL}/${mode === "login" ? "login" : "signup"}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      handleResponse(data, res.ok);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (response: { credential: string }) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BE_URL}/google/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      handleResponse(data, res.ok);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, loading, submitForm, loginWithGoogle, mode };
};
