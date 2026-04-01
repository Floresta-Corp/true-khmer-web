export type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export type LoginActionData = {
  errors?: LoginErrors;
};

export type RegisterErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  occupation?: string;
  password?: string;
  form?: string;
};

export type RegisterActionData = {
  errors?: RegisterErrors;
};

export type VerifyOtpErrors = {
  email?: string;
  otp?: string;
  form?: string;
};

export type VerifyOtpActionData = {
  errors?: VerifyOtpErrors;
  resend?: {
    success: boolean;
    message: string;
  };
};

export type ForgotPasswordErrors = {
  email?: string;
  form?: string;
};

export type ForgotPasswordActionData = {
  errors?: ForgotPasswordErrors;
};

export type ResetPasswordErrors = {
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
  form?: string;
};

export type ResetPasswordActionData = {
  errors?: ResetPasswordErrors;
};
