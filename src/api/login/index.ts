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
    // 理论上不会走到这里，因为拦截器已处理错误
    // 但为了类型安全，仍做判断
    throw new Error(result.message || '登录失败');
  }

  return result.data!; // 非空断言，因为 code=200 时 data 不为 null
}
