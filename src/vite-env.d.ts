export {};

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleInitializeConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  use_fedcm_for_prompt?: boolean;
  auto_select?: boolean;
  context?: string;
}

interface GoogleRenderButtonOptions {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "small" | "medium" | "large";
  width?: string;
  shape?: "rectangular" | "pill" | "circle" | "square";
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleInitializeConfig) => void;
          renderButton: (
            parent: HTMLElement | null,
            options: GoogleRenderButtonOptions,
          ) => void;
        };
      };
    };
  }
}
