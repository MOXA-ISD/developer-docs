---
id: intro
title: Getting Started
---

**ThingsPro Edge** is made up of modules, and the currently supported modules have the following items :

- message broker
- ThingsPro message controller
- docker daemon
- DM gateway
- DM device
- ThingsPro APPs : **APP** is the software that running on the ThingsPro APPs in ThingsPro Edge.

![system-overview](assets/edge/system-overview.png)

## Install ThingsPro Edge

We provide a single command to install ThingsPro Edge that ssh to the board, such as UC-8112, and run as root

```
root@Moxa:~# curl http://repo.moxa.online/static/v3/edge/install.sh | sh -s $PRODUCT_NAME
...
**********************************************************
* The installation process ended successfully.
**********************************************************
```

Currently Supported Products:

- uc8112-lx-cg
- mc1121

Find the up-to-date product list by

```
root@Moxa:~# curl -s http://repo.moxa.online/static/v3/edge/install.sh | sh
usage: ./install.sh <product>
products:
  - mc1121
  - uc8112-lx-cg
```

Start ThingsPro Edge

```
root@Moxa:~# service thingspro-edge start
```

## Install API and Web Service

ThingsPro Edge provides RESTful API for management that is listed in [ThingsPro Edge OAPI server](https://thingspro-edge-oapi.netlify.com/). To enable API service, we have to install ThingsPro Web APP by following command

```
root@Moxa:~# appman app install http://repo.isd.moxa.com/static/v3/edge/apps/release/thingspro-web_0.2.1-80_armhf.mpkg
```

NOTE: If the command returns "appman is not ready", that means you have to wait a few seconds until ThingsPro Edge is ready to install web service.

It will take a while and you may monitor the installation progress by

```
root@Moxa:~# appman app ls
{
  "thingspro-web": {
    "arch": "armhf",
    "attributes": [
      "alwaysInstalled",
      "alwaysStarted"
    ],
    "description": "ThingsPro backend and frontend",
    "desiredState": "ready",
    "displayName": "ThingsPro",
    "hardware": null,
    "health": "good",
    "icon": "",
    "imageSize": 0,
    "name": "thingspro-web",
    "state": "ready",
    "version": "0.2.1"
  }
}
```

Or use following command to refresh every 5 seconds

```
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

If web service is ready, the state field will show `ready`.

Now, you can check device profile via API

```
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

## Data acquisition

ThingsPro Edge have ability to extend functions by installing APPs. For example, we now install one southbound APP _Modbus_ for enabling data acquisition.

```
root@Moxa:~# appman app install http://repo.moxa.online/static/v3/edge/apps/mxmodbusmaster_3.1.0_armhf.mpkg
```

Before creating a device, we must add a template defining data elements(tags). The template can be download at [here](./iologik-e2242.json)

```
root@Moxa:~# curl https://127.0.0.1/api/v1/tags/fieldbus/modbus/templates/iologik-e2242 \
        -X POST \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k \
        -d @./iologik-e2242.json
```

Add a device associating to the template, where `10.144.33.168` must be replaced to IP Address of your computer that simulate a modbus device

```
root@Moxa:~# curl https://127.0.0.1/api/v1/tags/fieldbus/modbus/devices/My_iologik-e2242 \
        -X POST \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k \
        -d '{"name":"My_ioLogik-E2242","interface":"eth0","templateName":"iologik-e2242.json","host":"10.144.33.168","deviceId":0,"service":502}'
```

TODO Get each end devices connection status

```
root@Moxa:~#  mxfbcli -p modbus -a
```

response :

????

TODO Get tag list in the ThingsPro Edge

`IO tags` (all southbound app's tags are in this category)

```
root@Moxa:~# curl https://10.144.33.162/api/v1/tags/fieldbus \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" -k
```

`System tags`

root@Moxa:~# curl https://10.144.33.162/api/v1/tags/system \
 -X GET\
 -H "Content-Type:application/json" \
 -H "mx-api-token:$(cat /etc/mx-api-token)" --insecure

`Virtual tags`

```
$ curl https://10.144.33.162/api/v1/tags/virtual \
        -X GET \
        -H "Content-Type:application/json" \
        -H "mx-api-token:$(cat /etc/mx-api-token)" --insecure
```

**Get(Subscribe) tag value by Tag API (c/python api)**

_python example :_

```
from libmxidaf_py import TagV2

def on_tag_callback(equipment_name, tag_name, tag):
  print "{}:{}:{}:{}:{}".format(
      equipment_name,
      tag_name,
      tag.at(),
      tag.value(),
      tag.unit())

tagv2 = TagV2.instance()
tagv2.subscribe_callback(on_tag_callback)
tagv2.subscribe(
  "My_ioLogik-E2242",
  "di0")

tagv2 = TagV2.instance()
```

**Set tag value by Tag API (c/python api)**
**publish tag value**

```
from libmxidaf_py import TagV2, Tag, Time, Value

tagv2 = TagV2.instance()

tagv2.publish (
    "My_ioLogik-E2242",
    "di0",
    Tag(
        Value(5.010),
        Time.now(),
        "dbm")
)
```

**direct read/write io tag value**

```
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

shell command :

```
$ # read
$ mxfbcli -e My_ioLogik-E2242 -t di0 -r
$ # write
$ mxfbcli -e My_ioLogik-E2242 -t do0 -u 1
```
