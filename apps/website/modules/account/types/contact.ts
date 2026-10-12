export type ContactChannel = 'phone' | 'email';

/** POST customers/current-user/contact: sends a code to the new phone / email */
export interface ContactChangeRequest {
  channel: ContactChannel;
  identifier: string;
  portal?: string;
}

/** Step 1 of an OTP-confirmed change: the token step 2 sends back with the code */
export interface ChangeTokenResponse {
  token: string;
  success: boolean;
}

/** PUT …/contact and …/iban: confirms the change with the 6-digit code */
export interface ConfirmChangeRequest {
  token: string;
  otp: string;
}

/** Step 1 of a code-confirmed change hands this to step 2 (see ChangeFlowDialog.vue) */
export interface SentStep {
  token: string;
  /** Text of step 2, e.g. "Enter the code sent to +9665…" */
  text: string;
  /** Repeats step 1 for a new code; returns its token */
  again: () => Promise<string>;
}
