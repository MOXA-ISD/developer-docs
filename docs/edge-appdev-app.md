---
id: edge-appdev-app
title: ThingsPro Development Kit
---

ThingsPro Development Kit(TDK) is a development toolkit used to create application and pack it for MOXA ThingsPro Edge. The Application package is called MPKG (MOXA package), which is extended Docker and Docker Compose. Software that published by Docker now is easily to publish to ThingsPro Edge too.
In this document, we will introduce the method to develop and verify a simple hello application for ThinsgPro Edge via TDK.

## Prerequisite

- To develop a ThingsPro APP
-- Windows/OSX/Linux computer with [Docker ≥ 18.03](https://docs.docker.com/install/)
- To run your APP
-- Hardware withh ThingsPro v3 Edge preinstalled (for example: UC-8100 series)

## STEP 1: Prepare Development Environment

Start ThingsPro Development Desktop

```shell
$ docker run --name tdd -p 6080:80 -p 8000:8000 -v /run/docker.sock:/host/run/docker.sock moxaisd/thingspro-dev-desktop:0.1-linux-amd64
```

You can browse [http://127.0.0.1:6080](http://127.0.0.1:6080) now that show as following

![thingspro-dev-desktop](assets/edge/thingspro-dev-desktop.png)

NOTES: If you are running this image in Virtual Machine (VM), you have to set port forwarding for port 6080 and 8000 in VM Manager. If you plan to compile ARM, you have to install `qemu-user-static` in VM, which run `apt-get install -y qemu-user-static` in Ubuntu.

## STEP 2: Create a Hello World APP

In this environment, open a LXTerminal by the menu in the left-bottom corner -> System Tools, then create a Hello World sample.

```shell
$ mkdir hello
$ cd hello
$ tdk init --template=hello --lang=python3 --arch=armhf
```

where the parameters of `tdk init` means that creating a project with project name **hello** using **python3** on **ARM** platform.

You also can find all templates by following command

```shell
$ tdk init --list
+----------+----------+--------------+
| TEMPLATE | LANGUAGE | ARCHITECTURE |
+----------+----------+--------------+
| hello    | golang   | armhf        |
| hello    | python3  | amd64        |
| hello    | python3  | armhf        |
+----------+----------+--------------+
```

After initializing successfully, the file structure looks like

    ├── docker-compose.yml
    ├── Dockerfile
    ├── metadata.yml
    ├── nginx.conf
    └── src
        ├── app.py
        ├── requirements.txt
        └── templates
            └── index.html

[Dockerfile](https://docs.docker.com/compose/compose-file/) describe how the docker image is built, and [docker-compose.yml](https://docs.docker.com/compose/compose-file/) defines running multi-container Docker application. `metadata.yml` defines how it works and shows in APP Market of ThingsPro Edge. ThingsPro Edge has a web server in front of all APPs. APP has to define which pages and any RESTful APIs expose to exterior in [nginx.conf](https://nginx.org/en/docs/). src is implementation of this APP.

## STEP 3: Build APP

Build the program as a Docker image

    $ docker build -t user/hello:0.1.0 .
    Sending build context to Docker daemon  10.75kB
    Step 1/13 : FROM debian:stretch-slim as qemu
    [skip]
     ---> Using cache
     ---> 16cb1f27639b
    Successfully built 16cb1f27639b
    Successfully tagged user/hello:0.1.0

Pack

    $ tdk pack
    INFO[0000] [Parse docker-compose.yml]
    INFO[0000] [Save images]
    INFO[0000] user/hello:0.1.0
    INFO[0006] [Save files]
    INFO[0006] Copy docker-compose.yml
    INFO[0006] Copy metadata.yml
    INFO[0006] Copy image.txz
    INFO[0007] Copy nginx.conf
    INFO[0007] [pack]
    INFO[0007] Success!
    INFO[0007] hello_0.1.0_armhf.mpkg 23.59 MB

## STEP 4: Deploy APP

Start a http server to provide applications

```shell
$ python3 -m http.server
```

SSH to the board, then install application by following command (replace **<board-ip>** according to your environment)

```shell
root@Moxa:/home/moxa# appman app install http://<dev-env-ip>:8000/hello_0.1.0_armhf.mpkg
{
  "arch": "armhf",
  "attributes": null,
  "description": "An simple example",
  "desiredState": "ready",
  "displayName": "hello world",
  "hardware": null,
  "health": "wait",
  "icon": "",
  "name": "hello",
  "state": "init",
  "version": "0.1.0"
}
```

Check install progress

```shell
root@Moxa:/home/moxa# appman app ls name=hello fields=runtime
{
  "desiredState": "ready",
  "health": "running",
  "progress": {
    "currentTask": 3,
    "message": "",
    "percentage": 0,
    "totalTask": 3
  },
  "state": "installing"
}
```

After state is ready, browse your application at https://<board_ip>/apps/hello/

![app-hello](assets/edge/app-hello.png)

Congrats! You are successful to complete your first ThingsPro APP.

## Appendix: Troubleshooting

**How do I check installation procedure in detail?**

Check the log of APP Manager by

    $ sudo docker logs -f --tail=100 core-appman

**Where is my APP stored?**

Your APP will be stored at `/var/thingspro/apps/<appname>`. `nginx.conf` will be located `/var/thingspro/nginx-conf/<appname>.conf`. UI folder will be extracted to `/var/thingspro/www/apps/<appname>`

**My APP is installed, but I connect with browser, it shows 4xx/5xx error code**

This means something wrong in APP's nginx.conf or APP's HTTP service. First of all, check HTTP service. You may find container IP by `docker inspect <container-name>`. Then, use `curl http://<container-ip>/...` to check HTTP service is connective from the host. If yes, check `nginx.conf`. APP nginx.conf is located in `/var/thingspro/nginx-conf/<appname>.conf`. Revise it, reload it by `docker exec core-web nginx -s reload`, and test it.

**Can I start my app manually with docker-compose command?**

We support docker-compose.yml v2 and v3. v2 will operate by library, so you can not start or stop by docker-compose command. If you are using v3 and APP name is `hello`, you can manage by docker-compose command, like this

    $ docker exec -it core-appman bash
    $ cd /var/thingspro/apps/hello
    $ docker-compose -f .docker-compose.yml start

## APP Management

append `--help` after command to get explanation in detail

    root@Moxa:~# appman
    App Manager of MOXA

    Usage:
      appman [command]

    Available Commands:
      app         app management
      daemon      Run daemon
      deinit      deinitialize containers
      help        Help about any command
      init        init containers
      version     Print the version number

    Flags:
      -h, --help      help for appman
          --verbose   verbose output
          --version   version for appman

    Use "appman [command] --help" for more information about a command.

Install an App

    # appman app install https://...
    or
    # appman app install /home/moxa/...

List Apps

    # appman app ls

Start an App

    # appman app start <appname>

Stop an App

    # appman app stop <appname>
