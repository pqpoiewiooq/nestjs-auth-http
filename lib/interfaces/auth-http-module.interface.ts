import { DynamicModule, Provider, Type } from '@nestjs/common';
import { AuthHttpInstance, CreateAuthHttpDefaults } from './auth-http.interface';
import { Async } from './async.interface';

export interface AuthHttpModuleOptions<D = any> extends CreateAuthHttpDefaults<D> {
    /**
     * Called after the {@link AuthHttpInstance} is created.
     */
    onCreate<Credentials>(instance: AuthHttpInstance<Credentials>): void;
}

export interface AuthHttpModuleOptionsFactory<D = any> {
    createAuthHttpOptions(): Async<AuthHttpModuleOptions<D>>;
}

export interface AuthHttpModuleAsyncOptions<D = any>
    extends Pick<DynamicModule, 'imports' | 'global'> {
    useExisting?: Type<AuthHttpModuleOptionsFactory<D>>;
    useClass?: Type<AuthHttpModuleOptionsFactory<D>>;
    useFactory?: (...args: any[]) => Async<AuthHttpModuleOptions<D>>;
    inject?: any[];
    extraProviders?: Provider[];
}
