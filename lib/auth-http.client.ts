import Axios from 'axios';
import { AuthHttpInstance, CreateAuthHttpDefaults } from './interfaces';
import { extractProperty, defineGetter } from './utils';

type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void;
type PromiseReject = (reason?: any) => void;

type Task<T = any> = [resolve: PromiseResolve<T>, reject: PromiseReject];
type TaskQueue<T = any> = Task<T>[];

export function createAuthHttpClient<Credentials, D = any>(
    config: CreateAuthHttpDefaults<Credentials, D>,
): AuthHttpInstance<Credentials> {
    const { authProvider } = extractProperty(config, 'authProvider');
    const taskQueue: TaskQueue = [];
    let isRefreshing = false;
    let credentials: Credentials = null;
    let authorization: string = null;

    const client = Axios.create(config) as AuthHttpInstance<Credentials>;
    defineGetter(client, 'authProvider', () => authProvider);
    defineGetter(client, 'isRefreshing', () => isRefreshing);

    function enroleTask() {
        return new Promise((resolve, reject) => {
            taskQueue.push([resolve, reject]);
        });
    }

    function resolveTask(error?) {
        let task: Task;
        while ((task = taskQueue.shift())) {
            const [resolve, reject] = task;
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        }
    }

    async function provideCredentials() {
        if (isRefreshing) return;
        isRefreshing = true;

        let error = undefined;
        try {
            credentials = await authProvider.credentials(client);
            authorization = await authProvider.toAuthorization(credentials);
        } catch (_error) {
            error = _error;
        }

        isRefreshing = false;
        resolveTask(error);
    }

    client.interceptors.request.use(async (config) => {
        if (authProvider.isWhitelisted(config.url)) return config;

        if (isRefreshing) {
            await enroleTask();
        } else if (credentials === null || authProvider.isExpired(credentials)) {
            const task = enroleTask();
            await provideCredentials();
            await task;
        }

        config.headers.Authorization = authorization;
        return config;
    }, null);

    client.interceptors.response.use(null, async (error) => {
        if (authProvider.isUnauthorizedError(error)) {
            credentials = authorization = null;
            const task = enroleTask();
            await provideCredentials();
            await task;
            return client.request(error.config);
        }

        return Promise.reject(error);
    });

    return client;
}
