import { Async, AuthHttpInstance, AuthType, IAuthProvider } from './interfaces';
import { defineGetter } from './utils';

export abstract class AuthProvider<Credentials> implements IAuthProvider<Credentials> {
    readonly type: AuthType;

    protected constructor(type: AuthType) {
        defineGetter(this, 'type', () => type);
    }

    abstract isWhitelisted(url: string): boolean;

    abstract credentials(client: AuthHttpInstance<Credentials>): Async<Credentials>;

    abstract isExpired(credentials: Credentials): Async<boolean>;

    abstract toAuthorization(credentials: Credentials): string;

    isUnauthorizedError(error: any): boolean {
        return error?.response?.status === 401;
    }
}
