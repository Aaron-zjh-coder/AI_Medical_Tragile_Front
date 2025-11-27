import request from '@/utils/request';
import type { LoginParams, LoginResponse } from './types';
import type { ResultVO } from '@/types/api';

export async function loginApi(data: LoginParams): Promise<LoginResponse> {
  const response = await request.post<ResultVO<LoginResponse>>(
    '/users/login/password',
    data
  );

  const result = response.data; // ResultVO<LoginResponse>

  if (result.code !== '200') {
    throw new Error(result.message || '登录失败');
  }

  if (!result.data) {
    throw new Error('登录响应数据异常');
  }

  return result.data;
}
