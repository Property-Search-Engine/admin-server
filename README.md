<p align="center" >
  <img src="docs/images/logo.png" title="Casame" width="200">
</p>

<p align="center">
  <a href="./LICENSE" target="_blank">
    <img alt="MIT License" src="https://img.shields.io/github/license/Property-Search-Engine/admin-server" />
  </a>

  <img alt="node-build" src="https://img.shields.io/github/workflow/status/Property-Search-Engine/admin-server/NodeJS?logo=node.js" />

  <img alt="pr" src="https://img.shields.io/github/issues-pr/Property-Search-Engine/admin-server" />
  <img alt="issues" src="https://img.shields.io/github/issues/Property-Search-Engine/admin-server" />
  <img alt="discord-chat" src="https://img.shields.io/discord/803927161806520340?logo=discord" />
</p>

<h1 align="center">CasaMe: Find the house or office of your dreams</h1>

> CasaMe Service admin dashboard backend

## Configure

Make sure that you have **Docker** & **Docker Compose** installed on your system
so you can easily follow the next steps!

Before running the project, first copy the .env.save file:

```bash
$ cp .env.example .env
```

Then setup all the needed env variables and everything should be up to go!
## Run

We provide you with a set of tools that can help you to automate the building
and running process throughout makefiles and docker-compose files.

```bash
$ make run_start
# remember to execute `make down` when you are done
```

Run watch to restart the server on each change

```bash
$ make run_dev
# remember to execute `make down` when you are done
```

## Test ✅

```bash
$ make test_watch
```

This is going to run all the tests inside a docker environment. If you want to
have more control over how the tests are performed, you can run:

```bash
$ make up
> $ npm run test # ex.
```

## 👤 Contributors ✨

<table>
<tr>
<td align="center"><a href="https://github.com/JasterV"><img src="https://avatars3.githubusercontent.com/u/49537445?v=4" width="100" alt=""/><br /><sub><b>Victor Martínez</b></sub></a></td>
<td align="center"><a href="https://github.com/devmxhv"><img src="https://avatars.githubusercontent.com/u/18093090?s=400&u=f1be9a47c65f930f7cb6948fe3a606fdac42c197&v=4" width="100" alt=""/><br /><sub><b>devmxhv</b></sub></a></td>
<td align="center"><a href="https://github.com/Damantino"><img src="https://avatars.githubusercontent.com/u/50982542?s=400&u=94fbe1218e4fb44f5443848c1a586a087dfc773f&v=4" width="100" alt=""/><br /><sub><b>Daniel García</b></sub></a></td>
</tr>

</table>

## Show your support

Give a ⭐️ if this project helped you!
