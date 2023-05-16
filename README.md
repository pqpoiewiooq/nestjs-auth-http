<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="https://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Promise based [Axios](https://www.npmjs.com/package/axios) module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm i --save nestjs-auth-http axios
```

## Usage

##### interfaces/oauth-token.interface.ts

```ts
export interface OAuthToken {
    token_type: 'Basic' | 'Bearer' | 'Digest' | 'HOBA' | 'Mutual';
    access_token: string;
    expires_in: number;
    // ...
};
```

##### auth/jwt-auth.provider.ts
```ts
import { AuthProvider, Async, AuthHttpInstance } from 'nestjs-auth-http';
import { OAuthToken } from '../interfaces';

export class OAuthProvider extends AuthProvider<OAuthToken> {
    constructor () {
        super('Bearer'); // readonly type = 'Bearer';
    }

    override isWhitelisted(url: string): boolean {
        return url.includes('/oauth2/token');
    }

    override credentials(client: AuthHttpInstance<OAuthToken>): Async<OAuthToken> {
        return client.post('/oauth2/token', { /* payload */ })
            .then((response) => response.data);
    }

    override isExpired(credentials: OAuthToken): Async<boolean> {
        /* token verification */
        return false;
    }

    override toAuthorization(credentials: OAuthToken): string {
        return `${this.type} ${credentials.access_token}`;
    }

    /* Default
    isUnauthorizedError(error: any): boolean {
        return error?.response?.status === 401;
    }
     */
}
```

##### auth/jwt-auth.provider.ts
```ts
import { Module } from '@nestjs/common';
import { AuthHttpModule } from 'nestjs-auth-http';
import { JwtAuthProvider } from './auth';
import { FooController } from './controllers';


@Module({
    imports: [AuthHttpModule.register({
        baseURL: 'http://token.api',
        authProvider: new JwtAuthProvider(),
        onCreate(instance) { // Called after the instance is created.
            /* do something */
            /* instance.interceptors.request.use() */
        },
    })],
    controllers: [FooController],
})
export class AppModule {}

```

##### controllers/foo-controller.ts
```ts
import { Controller, Post } from '@nestjs/common';
import { AuthHttpService } from 'nestjs-auth-http';

@Controller('/foo')
export class FooController {
    constructor (private readonly httpService: AuthHttpService) {}

    @Post('/bar')
    async bar() {
        const response = await this.httpService.post('/hello/world', { /* payload */ });
        return response.data;
    }
}
```


## License

[MIT licensed](LICENSE).