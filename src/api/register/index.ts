import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { RegisterByEmailDTO, RegisterByPhoneDTO } from './types';

const api = axios.create({
  baseURL: '/api/v1',
});

// 发送邮箱验证码
export const sendEmailVerificationCode = (email: string): Promise<AxiosResponse<void>> => {
  return api.post('/verify-code/email/send', null, { params: { email } });
};

// 发送手机验证码
export const sendPhoneVerificationCode = (phone: string): Promise<AxiosResponse<void>> => {
  return api.post('/verify-code/phone/send', null, { params: { phone } });
};

// 邮箱注册
export const registerByEmail = (data: RegisterByEmailDTO): Promise<AxiosResponse<boolean>> => {
  return api.post('/users/register/email', data);
};

// 手机注册
export const registerByPhone = (data: RegisterByPhoneDTO): Promise<AxiosResponse<boolean>> => {
  return api.post('/users/register/phone', data);
};
