---
id: edge-intro
title: Getting Started
---

ThingsPro Edge is an intelligent industrial IoT edge device to help you accelerate the development of your IIoT applications and create a smarter field site. ThingsPro Edge extends connectivity for data acquisition by APPs
This document will give you an overview and steps to create an APP running on top of ThingsPro version 3 and after.

![system-overview](assets/edge/system-overview.png)

- **Southbound APP** usually to acquires data from field devices, like sensors, smart meters and then publishes the data to subcribers. It also listens direct command from other APP and routes to the underlying devices.
- **Northbound APP** usually subscribes data from the publisher and then exports to the cloud. It also comprises web interface and backend HTTP service to configure which data to be uploaded and collecting interval. Besides, it has a daemon to subscribe data in real time.
- **DATA CORE** is responsible to manage these field devices and tags. APPs will be notified when a device registers to ThingsPro Edge with the protocol the southbound APP provieded. The design and implementation will be introduced in [Southbound SDK](edge-appdev-south).
- Web interface of northbound APP is needed to register to **WEB SERVER** that is a reverse proxy to sucure REST API. APP life cycle is managed by **APP SERVICE**. APP is container based and package by ThingsPro [developent kit](edge-appdev-app).
- **Device Management** makes the hardware to be managed by ThingsPro Edge and ThingsPro Server.

Following is an typical data acquisition example with this scenario: a MODBUS/TCP master APP to poll data from field device and then export the data to the cloud:

## STEP 1: Install ThingsPro Edge

### 1.1. Install ThingsPro Edge
A single command is used to install ThingsPro Edge in MOXA hardware, be sure to run it with root

```shell
root@Moxa:~# wget -O- http://repo.moxa.online/static/v3/edge/dists/v0.3.0/install.sh | sh -s $PRODUCT_NAME
...
**********************************************************
* The installation process ended successfully.
**********************************************************
```

Currently supported products are:

- UC8112-lx-cg
- MC1121

You may also find the up-to-date product list by executing:

```shell
root@Moxa:~# wget -O- -q http://repo.moxa.online/static/v3/edge/dists/v0.3.0/install.sh | sh
usage: ./install.sh <product>
products:
  - mc1121
  - uc8112-lx-cg
```

### 1.2. Start ThingsPro Edge

```shell
root@Moxa:~# service thingspro-edge start
```

## STEP 2: Install ThingsPro Edge Web Service

ThingsPro Edge provides RESTful API for management that is listed in [ThingsPro Edge OAPI server](https://thingspro-edge-oapi.netlify.com/). To enable API service, we have to install ThingsPro Web APP. First, update APPs index

```shell
root@Moxa:/home/moxa# appman source update --force
I: updating source stable(https://repo.moxa.online/static/v3/edge/dists/v0.3.0/apps)
I: updated source stable(https://repo.moxa.online/static/v3/edge/dists/v0.3.0/apps)
I: updating package app-azure_0.3.0-15_amd64.mpkg
I: updating package app-azure_0.3.0-15_armhf.mpkg
I: updating package console_0.3.0-5_amd64.mpkg
I: updating package console_0.3.0-5_armhf.mpkg
I: updating package linuxdesktop_0.3.0-10_amd64.mpkg
I: updating package linuxdesktop_0.3.0-10_armhf.mpkg
I: updating package tagservice_0.2.4-14_amd64.mpkg
I: updating package tagservice_0.2.4-14_armhf.mpkg
I: updating package thingspro-web_0.3.0-1_amd64.mpkg
I: updating package thingspro-web_0.3.0-1_armhf.mpkg
```

### 2.1. Install thingspro-web service

```shell
root@Moxa:~# appman app install thingspro-web
```

NOTE: If the command returns "appman is not ready", that means you have to wait a few seconds until ThingsPro Edge is ready to install web service.

It will take a while and you may monitor the installation progress by

```shell
root@Moxa:~# appman app ls
+---------------+--------------------+--------------------------------+---------+
|     NAME      |      VERSION       |     STATE (DESIRED STATE)      | HEALTH  |
+---------------+--------------------+--------------------------------+---------+
| app-azure     | N/A (0.3.0-15)     | uninstalled (uninstalled)      | good    |
| console       | N/A (0.3.0-5)      | uninstalled (uninstalled)      | good    |
| linuxdesktop  | N/A (0.3.0-10)     | uninstalled (uninstalled)      | good    |
| modbusmaster  | N/A (3.5.3-11)     | uninstalled (uninstalled)      | good    |
| tagservice    | N/A (0.2.4-14)     | uninstalled (uninstalled)      | good    |
| thingspro-web | 0.3.0-1 (0.3.0-1)  | installing (ready) - importing | running |
|               |                    | images...3% (2/3)              |         |
+---------------+--------------------+--------------------------------+---------+
```

### 2.2. Run thingspro-web service
If web service is ready, the state will show `ready`.

Now, you can check device profile via API

```shell
root@Moxa:~# curl -s https://127.0.0.1/api/v1/profile \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k | json_pp
{
    "deviceModelName": "UC-8112-LX-CG",
    "deviceType": "iiot-gateway",
    "hardwareInterfaceList": [
        {
            "concurrent": true,
            "devName": "eth0",
            "interfacePath": "/sys/devices/platform/ocp/4a100000.ethernet/net/eth0",
            "name": "ethernet1",
            "type": "ethernet"
        },
        ...
    "moduleList": [
        "docker",
        "message-broker",
        "sanji-framework",
        "thingspro-apps"
    ],
    "systemTagList": [
        {
            "access": "ro",
            "dataType": "string",
            "dataUnit": "",
            "default": "UC-8112-LX",
            "duration": 1000,
            "srcName": "system",
            "tagName": "modelName",
            "tagType": "system"
        },
        ...
    ]
}
```

## STEP 3: Polling Sensor Data Using MODBUS/TCP master APP

ThingsPro Edge have ability to extend functions by installing APPs. We will start to do data acquisition by installing and MODBUS/TCP  master APP.

### 3.1. Install related APP or service
```shell
root@Moxa:~# appman app install tagservice
root@Moxa:~# appman app install modbusmaster
```

### 3.2. Add MODBUS slave devices and define tags to read

Before creating a device, we must add a template that defines data elements(tags). The template can be download at [here](assets/edge/iologik-e2242.json)

```shell
root@Moxa:~# curl https://127.0.0.1/api/v1/tags/fieldbus/modbus/templates/iologik-e2242 \
        -X POST \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k \
        -d @./iologik-e2242.json | json_pp
{
"templateName" : "iologik-e2242.json",
   "tagList" : [
      {
         "type" : "uint16",
         "pollingPeriodMs" : 1000,
         "address" : 0,
         "id" : "di0",
         "op" : "read",
         "quantity" : 1,
         "function" : "read-coils",
         "requestTimeoutMs" : 5000
      },
      ...
      {
         "pollingPeriodMs" : 1000,
         "type" : "uint16",
         "id" : "di3",
         "address" : 3,
         "function" : "read-coils",
         "quantity" : 1,
         "op" : "read",
         "requestTimeoutMs" : 5000
      }
   ]
}
```

Wait modbusmaster and tagservice are ready as following

```shell
+---------------+---------------------+---------------------------+--------+
|     NAME      |       VERSION       |   STATE (DESIRED STATE)   | HEALTH |
+---------------+---------------------+---------------------------+--------+
| app-azure     | N/A (0.3.0-15)      | uninstalled (uninstalled) | good   |
| console       | N/A (0.3.0-5)       | uninstalled (uninstalled) | good   |
| linuxdesktop  | N/A (0.3.0-10)      | uninstalled (uninstalled) | good   |
| modbusmaster  | 3.5.3-11 (3.5.3-11) | ready (ready)             | good   |
| tagservice    | 0.2.4-14 (0.2.4-14) | ready (ready)             | good   |
| thingspro-web | 0.3.0-1 (0.3.0-1)   | ready (ready)             | good   |
+---------------+---------------------+---------------------------+--------+
```

Add a device associating to the template, where `10.144.33.168` must be replaced to IP address of your computer that simulate a modbus device and `eth3` is the interface to the sumulator.

```shell
root@Moxa:~# curl https://127.0.0.1/api/v1/tags/fieldbus/modbus/device \
        -X POST \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k \
        -d '{"name":"My_ioLogik-E2242","interface":"eth3","templateName":"iologik-e2242","host":"10.144.33.168","deviceId":0,"service":502}' | json_pp
{
   "service" : 502,
   "protocol" : "modbus",
   "host" : "10.144.32.107",
   "name" : "My_ioLogik-E2242",
   "id" : "05c3aa3a0ed445449586fa19e4d044e1",
   "interface" : "eth0",
   "hostName" : "modbusmaster_app_1",
   "templateName" : "iologik-e2242.json",
   "deviceId" : 0
}
```

Check device list

```shell
root@Moxa:~# curl https://127.0.0.1/api/v1/tags/fieldbus/modbus/devices \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k | json_pp
{
   "deviceList" : [
      {
         "id" : "5c09fae3e83845fb8459159389079deb",
         "protocol" : "modbus",
         "host" : "10.144.32.107",
         "name" : "My_ioLogik-E2242",
         "templateName" : "iologik-e2242.json",
         "deviceId" : 0,
         "interface" : "eth3",
         "hostName" : "modbusmaster_app_1",
         "service" : 502
      }
   ]
}
```

Then, you may install Modbus simulator. For example, we use [modrssim](https://sourceforge.net/projects/modrssim/). Open it and set protocol to TCP.

![modbus simulator](assets/edge/modrssim.png)

The number of `received/sent` should increase if connected.

### Tag Types

In previous section, we add a device and define its data element that called **I/O Tag** in ThingsPro Edge. I/O Tag can be listed by API

```shell
root@Moxa:~# curl https://127.0.0.1/api/v1/tags/fieldbus \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k
```

If you want to retrieve CPU usage, memory usage and others metrics of system that named **System Tag**. The supported system tag can be fetched by

```shell
root@Moxa:~# curl https://127.0.0.1/api/v1/tags/system \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k
```

The last tag is **Virtual Tag**. It is used by APP(normaly a north APP) publishing virtual data which used by another APP after it streamlines real data from devices. The supported virtual tags list by following API

```shell
root@Moxa:~# curl https://127.0.0.1/api/v1/tags/virtual \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k
```

## STEP 4: Create Hello APP to read and display the tag data
To subscribe data, we used a simple Hello APP wirtten in Python code to show the data

```python
from libmxidaf_py import TagV2

def on_tag_callback(equipment_name, tag_name, tag):
    print("{}:{}:{}:{}:{}".format(
        equipment_name,
        tag_name,
        tag.at(),
        tag.value(),
        tag.unit()
    ))

tagv2 = TagV2.instance()
tagv2.subscribe_callback(on_tag_callback)
tagv2.subscribe(
    "My_ioLogik-E2242",
    "di0"
)
```

This sample is already packed as an APP. You can install by

```shell
root@Moxa:~# appman app install north-hello
```

Then open [https://<board-ip>/apps/north-hello/](https://<board-ip>/apps/north-hello/) to see the data which looks like

![north sample](assets/edge/north-sample.jpg)

You can get source easily by `tdk`. Please refer to [Development Kit](edge-appdev-app).

## Appendix
### I.Web Service API Reference

Get templates

```shell
curl https://127.0.0.1/api/v1/tags/fieldbus/modbus/templates \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k | json_pp
```

Get devices

```shell
curl https://127.0.0.1/api/v1/tags/fieldbus/modbus/devices \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k  | json_pp
```

Delete a device

```shell
curl https://127.0.0.1/api/v1/tags/fieldbus/modbus/device \
        -X DELETE \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k \
        -d '{"name":"My_ioLogik-E2242","id":"05c3aa3a0ed445449586fa19e4d044e1"}'
```
