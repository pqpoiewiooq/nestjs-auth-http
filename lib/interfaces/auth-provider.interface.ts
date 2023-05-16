import { AuthHttpInstance } from './auth-http.interface';
import { Async } from './async.interface';

export type AuthType = 'Basic' | 'Bearer' | 'Digest' | 'HOBA' | 'Mutual' | string;

export interface IAuthProvider<Credentials> {
    readonly type: AuthType;

    /**
     * Verify that the endpoint does not require authorization.
     */
    isWhitelisted(url: string): boolean;

    credentials(client: AuthHttpInstance<Credentials>): Async<Credentials>;

    isExpired(credentials: Credentials): Async<boolean>;

    /**
     * Convert credentials to the value set in 'Authorization' header.
     */
    toAuthorization(credentials: Credentials): Async<string>;

    /**
     * If an error occurs during the request, verify that it is an Unauthorized error.
     * `default`: returns true if `error?.response?.status === 401`
     */
    isUnauthorizedError?(error): boolean;
}
