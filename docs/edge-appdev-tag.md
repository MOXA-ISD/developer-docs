---
id: edge-appdev-tag
title: Tag SDK
---

In this quickstart you learn how to develop your application by ThingsPro data acquisition SDK.

## Installation

### System Requirements

Tag SDK is tested to compile and run on the following systems:

- Debian jessie and stretch

Architectures:

- armhf
- amd64

### Prerequisites

Before you start a new adventure with ThingsPro Tag SDK. You need to set up the apt-repository. Afterward, you can install and update the relevant packages from the thingspro apt-repository. If you are not allowed to directly access this apt-repository, development packages are packed into the Docker image [moxaisd/thingspro-dev-base](https://hub.docker.com/r/moxaisd/thingspro-dev-base/).

**ADD GPG KEYS**

    wget -O- http://repo.isd.moxa.com/gpg | apt-key add - \
    wget -O- http://repo.mosquitto.org/debian/mosquitto-repo.gpg.key | apt-key add -

**SET UP THE REPOSITORY**

    echo "deb [trusted=yes] http://repo.isd.moxa.com/debian/jessie/thingspro stable main" >> /etc/apt/sources.list.d/thingspro.list \
    echo "deb [trusted=yes] http://repo.mosquitto.org/debian jessie main" >> /etc/apt/sources.list.d/thingspro.list

**INSTALL AND UPDATE PACKAGES**

    apt-get update
    apt-get install -qy --fix-missing \
    	libmxtagf-dev \
    	libmxtaglist

## Tag List API

### mxtaglist_t

The structure of tag list.

**SCHEMA**
| Name | Description |
| :-------: | :----------------------------------------------------------------------------------------------------------------- |
| srcName | source of tag in which the data come from. |
| tagName | name of tag. |
| tagType | the type of tag [io, system, virtual. |
| dataType | the data type of tag \[uint16, uint32, uint64, int16, int32, int64, float32, float64, string, boolean, bytearray\] |
| dataUnit | the data unit of tag. |
| duration | polling interval in the unit of millisecond. 0ms means ASAP. |
| access | the access type of tag `["ro", "wo", "rw"]`. |
| default | the default value of tag. (Optional) |

### mxtag_list

Be used to obtain tag list by the specific type `tag_type_t`.

```c
    int mxtag_list( mxtaglist_t **tags,
                    tag_type_t type )
```

**Parameters**

| Name | Description                                                            |
| :--: | :--------------------------------------------------------------------- |
| tags | A pointer to the tag list instance which is assigned value afterwards. |
| type | the type of tag list, including `io`, `system`, `virtual`.             |

**Returns**

If the function succeeds, the return value is the number of the tag list size ≥ 0. Otherwise, the return value is -1 on failure.

### mxtag_list_to_json

```c
      char *mxtag_list_to_json( tag_type_t type )
```

Be used to obtain tag list in json format by the specific type `tag_type_t`.

**Parameters**

| Name | Description                                                |
| :--: | :--------------------------------------------------------- |
| type | the type of tag list, including `io`, `system`, `virtual`. |

**Returns**

If the function succeeds, the return value is a json format content of tag list. Otherwise, the return value is NULL on failure.

### mxtag_list_free

Free memory that was allocated in `mxtag_list`.

```c
      void mxtag_list_free( mxtaglist_t **tags )
```

**Parameters**

| Name | Description                                                |
| :--: | :--------------------------------------------------------- |
| tags | A pointer to the tag list instance.                        |
| type | the type of tag list, including `io`, `system`, `virtual`. |

**Returns**

None.

### Example: get tag list

```c
    #include <mxtaglist.h>

    int main(int argc, char *argv[])
    {
        int i, size;
        mxtaglist_t *taglist = NULL;
        size = mxtag_list(&taglist, TAG_TYPE_IO);
        for (i = 0; i < size; i++) {
            printf("source name: %s\n", taglist[i].source_name);
            printf("tag name: %s\n", taglist[i].tag_name);
            printf("data type: %d\n", taglist[i].data_type);
            printf("data unit: %s\n", taglist[i].data_unit);
            printf("access: %d\n", taglist[i].access);
            printf("duration: %u ms\n", taglist[i].duration);
        }

        if (taglist) {
            mxtag_list_free(&taglist);
            taglist = NULL;
        }
        return 0;
    }
```

### Example: get tag list in json format

```c
    #include <mxtaglist.h>

    int main(int argc, char *argv[])
    {
        char *payload = mxtag_list_to_json(TAG_TYPE_IO);
        if (payload) {
            fprintf(stdout, "Tag List: %s\n", payload);
            free(payload);
        }
        return 0;
    }
```

---

## Tag Pub/Sub API

### mxtag_publish

```c
      int mxtag_publish( tag_t           *tag,
                         const char      *source_name,
                         const char      *tag_name,
                         data_value_t    *data_value,
                         data_type_t      data_type,
                         const char      *tag_unit,
                         long long        tag_ts,
```

**Parameters**

|    Name     | Description                                                                                                    |
| :---------: | :------------------------------------------------------------------------------------------------------------- |
|     tag     | Instance of tag api.                                                                                           |
| source_name | Source of tag in which the data comes from.                                                                    |
|  tag_name   | Name of tag.                                                                                                   |
|   tag_ts    | Publish timestamp in millisecond.                                                                              |
|  tag_unit   | Unit of tag.                                                                                                   |
|  data_type  | Data type of tag \[uint16, uint32, uint64, int16, int32, int64, float32, float64, string, boolean, bytearray\] |
|  data_value | Value of tag.                                                                                                  |

**Returns**

If the function succeeds, the return value is 0. Otherwise, 1 on failure.

---

### mxtag_subscribe

```c
      int mxtag_subscribe( tag_t           *tag,
                           const char      *source_name,
                           const char      *tag_name )
```

**Parameters**

|    Name     | Description                                 |
| :---------: | :------------------------------------------ |
|     tag     | Instance of tag api.                        |
| source_name | Source of tag in which the data comes from. |
|  tag_name   | Name of tag.                                |

**Returns**

If the function succeeds, the return value is 0. Otherwise, 1 on failure.

### mxtag_unsubscribe

```c
      int mxtag_unsubscribe( tag_t           *tag,
                             const char      *source_name,
                             const char      *tag_name )
```

**Parameters**

|    Name     | Description                                 |
| :---------: | :------------------------------------------ |
|     tag     | Instance of tag api.                        |
| source_name | Source of tag in which the data comes from. |
|  tag_name   | Name of tag.                                |

**Returns**

If the function succeeds, the return value is 0. Otherwise, 1 on failure.

### mxtag_subscribe_callback

```c
      int mxtag_subscribe_callback( tag_t      *tag,
                                    on_tag      cb_func )
```

**Parameters**

- tag Instance of tag api.
- cb_func Callback function to receive subscribed tags.

**Returns**

If the function succeeds, the return value is 0. Otherwise, 1 on failure.

### Example: publish tag

```c
    #include <stdio.h>
    #include <mxtagf.h>

    int main(
             int argc,
             const char *argv[])
    {
        tag *tag_ = mxtag_new();

        value_t volt;
        volt.d = 1.414;

        mxtag_publish(
            tag_,
            "electrical-probe",
            "voltage",
            &volt,
            TAG_VALUE_TYPE_DOUBLE,
            "v",
            1516247068);

        mxtag_delete(tag_);

        return 0;
    }
```

### Example: subscribe tag

```c
    #include <mxtagf.h>

    int
        main(
            int argc,
            const char *argv[])
    {
        tag *tag_ = mxtag_new();

        mxtag_subscribe_callback(tag_, on_tag_callback);

        mxtag_subscribe(
            tag_,
            "electrical-probe",
            "voltage");
        mxtag_subscribe(
            tag_,
            "electrical-probe",
            "current");

        mxtag_unsubscribe(
            tag_,
            "electrical-probe",
            "current");

        for(;;)
        {
            sleep(1);
        }

        mxtag_delete(tag_);

        return 0;
    }
```

**After tag subscription, the following sample shows how to receive tags by a callback function.**

```c
    void
        on_tag_callback(
            tag *self,
            const char *equipment_name,
            const char *tag_name,
            value_t *value,
            value_type_t value_type,
            const char *unit,
            const long long at)
    {
        printf("Equ: %s, ", equipment_name);
        printf("Tag: %s, ", tag_name);
        printf("Value: ");
        if (value_type == TAG_VALUE_TYPE_INT)
            printf("%" PRId64 ", ", value->i);
        else if (value_type == TAG_VALUE_TYPE_UINT)
            printf("%" PRIu64 ", ", value->u);
        else if (value_type == TAG_VALUE_TYPE_DOUBLE)
            printf("%lf, ", value->d);
        else if (value_type == TAG_VALUE_TYPE_STRING)
        {
            printf("%s, ", value->s);
        }
        else if (value_type == TAG_VALUE_TYPE_BYTEARRAY)
        {
            size_t i;
            for(i = 0; i < value->l; i++)
            {
                printf("%02x", value->b[i]);
            }
            printf(", ");
        }
        else
            printf(", ");
        printf("Time: %lld, ", at);
        printf("Unit: %s\n", unit);
    }
```

---

## Tag CLI

```shell
    Usage: tagcli [commands]

    commands:
      --list [options]  get tag list by the specific type
      options:          [io <IO tag list>]
                        [system <System tag list>]
                        [virtual <Virtual tag list>]
```

**GET IO TAGS:**

```shell
    tagcli --list system
```
