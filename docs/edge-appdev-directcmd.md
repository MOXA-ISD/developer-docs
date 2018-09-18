---
id: edge-appdev-directcmd
title: Fieldbus SDK
---

In this quickstart, you can learn how to direct read and write to protocol APP's acquisition tags through Fieldbus SDK.

## Installation

### System Requirements

Fieldbus SDK Client APIs is tested to compile and run on the following systems:

- Debian Jessie and Stretch
- Thingspro platform Mosquitto and Sanji-Controller are active.

Architectures:

- armhf
- amd64

### Prerequisites

Before you start a new adventure with ThingsPro Fieldbus Client SDK. You need to set up the repository. Afterward, you can install and update the relevant packages from the repository. If you are not allowed to directly access this apt-repository, development packages are packed into the Docker image [moxaisd/thingspro-dev-base](https://hub.docker.com/r/moxaisd/thingspro-dev-base/).

**ADD GPG KEYS**

```bash
wget -O- http://repo.isd.moxa.com/gpg | apt-key add - \
wget -O- http://repo.mosquitto.org/debian/mosquitto-repo.gpg.key | apt-key add -
```

**SET UP THE REPOSITORY**

```bash
echo "deb [trusted=yes] http://repo.isd.moxa.com/debian/jessie/thingspro stable main" >> /etc/apt/sources.list.d/thingspro.list \
echo "deb [trusted=yes] http://repo.mosquitto.org/debian jessie main" >> /etc/apt/sources.list.d/thingspro.list
```

**INSTALL AND UPDATE PACKAGES**

```bash
apt-get update
apt-get install -qy --fix-missing \
    libmxtagf-dev \
    libmxtaglist
```

## Fieldbus Client APIs

### mxfb_new

Initialize a mxfieldbus client instance.

```c
mxfb_t*     mxfb_new ();
```

Returns

- If the function succeeds, the return a mxfieldbus client instance. Otherwise, the return value is NULL on failure.

### mxfb_read

Direct Read southbound app's protocol tags by simply given Device Name and Tag Name.

```c
int         mxfb_read(
                mxfb_t         *self,
                const char      *device_name,
                const char      *tag_name,
                int             timeout_ms,
                value_t         *value,
                value_type_t    *value_type
                );
```

Parameters

- self: mxfieldbus client instance
- device_name: The target device name
- tag_name: The target tag name
- timeout_ms: read tag time out setting in millisecond
- value: returned value of tag
- value_type: returned value type of tag

Returns

- If the function succeeds, the return value is 0 with tag value and value type in function arguments. Otherwise, the return value is -1 on failure.

### mxfb_write

Deliver a Direct Write job to southbound app's protocol tags by simply given Device Name and Tag Name.

Sometimes southbound app won't synchronous handle incoming Write Tag job, you might have to confirm tag value from subscriber of MQTT Broker.

```c
int         mxfb_write(
                mxfb_t *self,
                const char *device_name,
                const char *tag_name,
                int timeout_ms,
                value_t value,
                value_type_t value_type
                );
```

Parameters

- self: mxfieldbus client instance
- device_name: The target device name
- tag_name: The target tag name
- timeout_ms: read tag time out setting in millisecond
- value: returned value of tag
- value_type: returned value type of tag

Returns

If the function succeeds, the return value is 0 means southbound app has received the write tag job. Otherwise, the return value is -1 on failure.

### mxfb_delete

Free mxfieldbus client instance resource.

```c
void        mxfb_delete (
                mxfb_t *self
                );
```

Parameters

- self: mxfieldbus client instance

## Example: get tag list

```c
#include <inttypes.h>
#include <stdio.h>
#include <stdlib.h>

#include <mxfb_api.h>

void print_value (value_t value, value_type_t value_type)
{
    switch(value_type)
    {
    case TAG_VALUE_TYPE_INT:
        printf("Value: %" PRId64 "\n", value.i);
        break;
    case TAG_VALUE_TYPE_UINT:
        printf("Value: %" PRIu64 "\n", value.u);
        break;
    case TAG_VALUE_TYPE_DOUBLE:
        printf("Value: %lf\n", value.d);
        break;
    case TAG_VALUE_TYPE_STRING:
        printf("Value: %s\n", value.s);
        free(value.s);
        break;
    default:
        printf("Error: unexpected value_type_t\n");
        break;
    }
}

int main (int argc, const char *argv[])
{
    int rc = 0;
    mxfb_t *fb = mxfb_new();
    if (fb == NULL)
    {
        printf("Create mxmodbus object FAIL\n");
        return -1;
    }

    value_t value;
    value_type_t type;
    value.i = 1;
    printf("write tag do1 as value 1\n");
    rc = mxfb_write(
        fb,
        "demo-device",
        "do0",
        10000,
        value,
        TAG_VALUE_TYPE_UINT
    );

    printf("read tag di1 back and check it out\n");
    rc = mxfb_read(
        fb,
        "demo-device",
        "di0",
        10000,
        &value,
        &type
    );

    print_value(value, type);
    mxfb_delete(fb);

    return 0;
}
```
