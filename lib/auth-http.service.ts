import { Inject, Injectable } from '@nestjs/common';
import { AUTH_AXIOS_INSTANCE_TOKEN, AuthHttpInstance, AuthHttpRequestConfig } from './';
import Axios from 'axios';

@Injectable()
export class AuthHttpService<Credentials = any> {
    public readonly put: typeof Axios.put;
    public readonly post: typeof Axios.post;
    public readonly patch: typeof Axios.patch;
    public readonly head: typeof Axios.patch;
    public readonly delete: typeof Axios.delete;
    public readonly get: typeof Axios.get;
    public readonly request: typeof Axios.request;

    constructor(
        @Inject(AUTH_AXIOS_INSTANCE_TOKEN)
        protected readonly instance: AuthHttpInstance<Credentials>,
    ) {
        this.put = this.instance.put;
        this.post = this.instance.post;
        this.patch = this.instance.patch;
        this.head = this.instance.head;
        this.delete = this.instance.delete;
        this.get = this.instance.get;
        this.request = this.instance.request;
    }

    get axiosRef() {
        return this.instance;
    }
}
