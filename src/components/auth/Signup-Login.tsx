import { useSelector } from "react-redux";
import {
  selectAlert,
  selectUser,
} from "../../features/actions/actionsSelectors";
import Alert from "../ProductDetails/Alert";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useAuthLogic } from "../../hooks/useAuthLogic";

const Login = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const user = useSelector(selectUser);
  const alertState = useSelector(selectAlert);
  const { form, setForm, loading, submitForm, loginWithGoogle, mode } =
    useAuthLogic(onClose);

  useGoogleAuth(isOpen, loginWithGoogle, "googleBtn");

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth">
      {(!user || user.isAdmin) && (
        <div className="auth__overlay">
          <div className="auth__modal">
            <button className="auth__close-btn" onClick={onClose}>
              ✕
            </button>
            <div className="auth__content">
              <h2 className="auth__title">
                {mode === "login" ? "Autentificare" : "Cont Nou"}
              </h2>

              <form className="auth__form" onSubmit={submitForm}>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="auth__input"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <input
                  name="password"
                  type="password"
                  placeholder="Parolă"
                  className="auth__input"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                {mode === "signup" && (
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmă Parola"
                    className="auth__input"
                    value={form.confirmPassword || ""}
                    onChange={handleChange}
                    required
                  />
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="auth__submit-btn"
                >
                  {!loading
                    ? mode === "login"
                      ? "Intră în cont"
                      : "Înregistrare"
                    : "Loading..."}
                </button>

                <div className="auth__divider">
                  <span>sau</span>
                </div>
                <div id="googleBtn" className="auth__google-container"></div>
              </form>
            </div>
          </div>
          {alertState.showAlert && <Alert />}
        </div>
      )}
    </div>
  );
};

export default Login;
