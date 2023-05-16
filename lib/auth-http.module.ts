import { DynamicModule, Module, Provider } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { AuthHttpService } from './auth-http.service';
import {
    AUTH_AXIOS_INSTANCE_TOKEN,
    AUTH_HTTP_MODULE_ID,
    AUTH_HTTP_MODULE_OPTIONS,
} from './auth-http.constants';
import {
    AuthHttpModuleAsyncOptions,
    AuthHttpModuleOptions,
    AuthHttpModuleOptionsFactory,
} from './interfaces';
import { createAuthHttpClient } from './auth-http.client';
import { extractProperty } from './utils';

@Module({
    providers: [AuthHttpService],
    exports: [AuthHttpService],
})
export class AuthHttpModule {
    static register<D = any>(config: AuthHttpModuleOptions<D>): DynamicModule {
        return {
            module: AuthHttpModule,
            providers: [
                AuthHttpService,
                {
                    provide: AUTH_AXIOS_INSTANCE_TOKEN,
                    useValue: AuthHttpModule.createAuthHttpClient(config),
                },
                {
                    provide: AUTH_HTTP_MODULE_ID,
                    useValue: randomStringGenerator(),
                },
            ],
        };
    }

    static registerAsync<D = any>(options: AuthHttpModuleAsyncOptions<D>): DynamicModule {
        return {
            global: options.global,
            module: AuthHttpModule,
            imports: options.imports,
            providers: [
                ...this.createAsyncProviders(options),
                {
                    provide: AUTH_AXIOS_INSTANCE_TOKEN,
                    useFactory: (config: AuthHttpModuleOptions) =>
                        AuthHttpModule.createAuthHttpClient(config),
                    inject: [AUTH_HTTP_MODULE_OPTIONS],
                },
                {
                    provide: AUTH_HTTP_MODULE_ID,
                    useValue: randomStringGenerator(),
                },
                ...(options.extraProviders || []),
            ],
        };
    }

    private static createAuthHttpClient(config: AuthHttpModuleOptions) {
        const { onCreate } = extractProperty(config, 'onCreate');
        const instance = createAuthHttpClient(config);
        onCreate?.(instance);
        return instance;
    }

    private static createAsyncProviders(options: AuthHttpModuleAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createAsyncOptionsProvider(options: AuthHttpModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: AUTH_HTTP_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: AUTH_HTTP_MODULE_OPTIONS,
            useFactory: (optionsFactory: AuthHttpModuleOptionsFactory) =>
                optionsFactory.createAuthHttpOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
}
