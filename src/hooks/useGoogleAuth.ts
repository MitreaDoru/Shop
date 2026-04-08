import { useEffect, useRef } from "react";

interface GoogleCredentialResponse {
  credential: string;
}
export const useGoogleAuth = (
  isOpen: boolean,
  handleResponse: (res: GoogleCredentialResponse) => void,
  btnId: string,
) => {
  const callbackRef = useRef(handleResponse);
  useEffect(() => {
    if (isOpen && window.google) {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      const timer = setTimeout(() => {
        const btnParent = document.getElementById(btnId);
        if (btnParent) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (res) => callbackRef.current(res),
            use_fedcm_for_prompt: false,
          });

          window.google.accounts.id.renderButton(btnParent, {
            theme: "outline",
            size: "large",
            shape: "pill",
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isOpen, btnId]);
};
