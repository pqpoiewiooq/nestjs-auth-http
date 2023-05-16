import { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import { IAuthProvider } from './auth-provider.interface';

export interface AuthHttpInstance<Credentials> extends AxiosInstance {
    readonly authProvider: IAuthProvider<Credentials>;
    readonly isRefreshing: boolean;
}

export interface CreateAuthHttpDefaults<Credentials, D = any> extends CreateAxiosDefaults<D> {
    authProvider: IAuthProvider<Credentials>;
}

export type AuthHttpRequestConfig<D = any> = AxiosRequestConfig<D>;
