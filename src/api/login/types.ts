export interface LoginParams {
  username: string;
  password: string;
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
