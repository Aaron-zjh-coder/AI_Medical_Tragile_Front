export type LoginType = 'email' | 'phone';

export interface RegisterForm {
  username: string;
  email?: string;
  phoneNumber?: string;
  verifyCode: string;
  password: string;
}

export interface RegisterByEmailDTO {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
}

export interface RegisterByPhoneDTO {
  username: string;
  phoneNumber: string;
  password: string;
  verifyCode: string;
}
