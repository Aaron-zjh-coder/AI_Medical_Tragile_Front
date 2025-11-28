import request from '@/utils/request';
import type { RegisterByEmailDTO, RegisterByPhoneDTO } from './types';

// 发送邮箱验证码
export const sendEmailVerificationCode = (email: string) => {
  return request.post('/verify-code/email/send', null, { params: { email } });
};

// 发送手机验证码
export const sendPhoneVerificationCode = (phone: string) => {
  return request.post('/verify-code/phone/send', null, { params: { phone } });
};

// 邮箱注册
export const registerByEmail = (data: RegisterByEmailDTO) => {
  return request.post('/users/register/email', data);
};

// 手机注册
export const registerByPhone = (data: RegisterByPhoneDTO) => {
  return request.post('/users/register/phone', data);
};
