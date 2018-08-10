---
id: intro
title: Getting Started
---

**FIXME: image and description that only show what user cares**

ThingsPro Edge is made up of modules, and the currently supported modules have the following items:

- message broker
- ThingsPro message controller
- Docker daemon
- Device management(DM) gateway
- Device management(DM) device
- ThingsPro APPs : **APP** is the software that running on the ThingsPro APPs in ThingsPro Edge.

![system-overview](assets/edge/system-overview.png)

## Install ThingsPro Edge

We provide a single command to install ThingsPro Edge in MOXA hardware by run following command as root

```shell
root@Moxa:~# wget -O- http://repo.moxa.online/static/v3/edge/dists/v0.3.0/install.sh | sh -s $PRODUCT_NAME
...
**********************************************************
* The installation process ended successfully.
**********************************************************
```

Currently Supported Products:

- uc8112-lx-cg
- mc1121

You may also find the up-to-date product list by

```shell
root@Moxa:~# wget -O- -q http://repo.moxa.online/static/v3/edge/dists/v0.3.0/install.sh | sh
usage: ./install.sh <product>
products:
  - mc1121
  - uc8112-lx-cg
```

Start ThingsPro Edge

```shell
root@Moxa:~# service thingspro-edge start
```

## Install API and Web Service

**FIXME: command output change**

ThingsPro Edge provides RESTful API for management that is listed in [ThingsPro Edge OAPI server](https://thingspro-edge-oapi.netlify.com/). To enable API service, we have to install ThingsPro Web APP by following command

```shell
root@Moxa:~# appman app install thingspro-web
```

NOTE: If the command returns "appman is not ready", that means you have to wait a few seconds until ThingsPro Edge is ready to install web service.

It will take a while and you may monitor the installation progress by

```shell
root@Moxa:~# appman app ls
```

Or use following command to refresh every 5 seconds

```shell
root@Moxa:~# watch -n 5 appman app ls fields=runtime --no-color
Every 5.0s: appman app ls fields=runtime --no-color
{
  "thingspro-web": {
    "desiredState": "ready",
    "health": "good",
    "state": "ready"
  }
}
```

If web service is ready, the state will show `ready`.

Now, you can check device profile via API

```shell
root@Moxa:~# curl -s https://127.0.0.1/api/v1/profile \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k | python -m json.tool
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

## Acquire Data

ThingsPro Edge have ability to extend functions by installing APPs. For example, we now install one southbound APP _Modbus_ for enabling data acquisition.

```shell
root@Moxa:~# appman app install modbusmaster
```

### Add Devices

Before creating a device, we must add a template that defines data elements(tags). The template can be download at [here](assets/edge/iologik-e2242.json)

```shell
root@Moxa:~# curl https://127.0.0.1/api/v1/tags/fieldbus/modbus/templates/iologik-e2242 \
        -X POST \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k \
        -d @./iologik-e2242.json
```

Add a device associating to the template, where `10.144.33.168` must be replaced to IP address of your computer that simulate a modbus device

**FIXME: add computer screenshot to simulate modbus**

```shell
root@Moxa:~# curl https://127.0.0.1/api/v1/tags/fieldbus/modbus/devices/My_iologik-e2242 \
        -X POST \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k \
        -d '{"name":"My_ioLogik-E2242","interface":"eth0","templateName":"iologik-e2242.json","host":"10.144.33.168","deviceId":0,"service":502}'
```

You now can check device connection and status

**FIXME: output**

```shell
root@Moxa:~# mxfbcli -p modbus -a
```

### Collect Data

In previous section, we add a device and define its data element that called **IO Tag** in ThingsPro Edge. IO Tag can be listed by API

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
$ curl https://127.0.0.1/api/v1/tags/virtual \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k
```

To subscribe data, we used a simple Python code to show

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

tagv2 = TagV2.instance()
```

The code publish data as following

```python
from libmxidaf_py import TagV2, Tag, Time, Value

tagv2 = TagV2.instance()

tagv2.publish (
    "My_ioLogik-E2242",
    "di0",
    Tag(
        Value(5.010),
        Time.now(),
        "dbm"
    )
)
```

ThinsgPro Edge also provide capability to directly communicate with device. Here is a C sample for reference that reads IO tag directly

```c
int main()
{
    mxfb_t *fb = mxfb_new();

    value_t value;
    value_type_t value_type;
    int rc = mxfb_read(
        fb,
        "My_ioLogik-E2242",     # device_name
        "di0",                  # tag_name
        10000,                  # timeout_ms
        &value,
        &value_type
    );
    if (rc == 0)
        print_value(value, value_type);
}
```

We have provided corresponding shell command:

```shell
root@Moxa:~# # read
root@Moxa:~# mxfbcli -e My_ioLogik-E2242 -t di0 -r
root@Moxa:~# # write
root@Moxa:~# mxfbcli -e My_ioLogik-E2242 -t do0 -u 1
```
