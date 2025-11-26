export type LoginType = 'PHONE_NUMBER' | 'EMAIL' | 'THIRD_PARTY';

export interface LoginParams {
  loginId: string;
  credential: string;
  loginType: LoginType;
  verifyCode?: string;
}

export interface User {
  userId: number;
  username: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  bio?: string;
  gender?: string;
  role: string;
  status: string;
  activityTime?: string;
  createTime: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
