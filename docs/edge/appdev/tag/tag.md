---
id: tag
title: Tag SDK
---

In this quickstart you learn how to develop a your application by ThingsPro data acquisition SDK.

## Installation

### System Requirements

Tag SDK is tested to compile and run on the following systems:

- Debian jessie and stretch

Architectures:

- armhf
- amd64

### Prerequisites

Before you start a new adventure with ThingsPro Tag SDK. You need to set up the repository. Afterward, you can install and update the relevant packages from the repository.

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

### mxtag_list

Be used to obtain tag list by the specific type `tag_type_t`.

    int mxtag_list( mxtaglist_t **tags,
                    tag_type_t type )

Parameters

- tags A pointer to the tag list instance which is assigned value afterwards.
- type the type of tag list, including `io`, `system`, `virtual`.

Returns

If the function succeeds, the return value is the number of the tag list size ≥ 0. Otherwise, the return value is -1 on failure.

### mxtag_list_to_json

      char *mxtag_list_to_json( tag_type_t type )

Be used to obtain tag list in json format by the specific type `tag_type_t`.

Parameters

- type the type of tag list, including `io`, `system`, `virtual`.

Returns

If the function succeeds, the return value is a json format content of tag list. Otherwise, the return value is NULL on failure.

### mxtag_list_free

Free memory that was allocated in `mxtag_list`.

      void mxtag_list_free( mxtaglist_t **tags )

Parameters

- tags A pointer to the tag list instance.

Returns

None.

### Example: get tag list

    #include <mxtaglist.h>

    int main(int argc, char *argv[])
    {
        int i, size;
        mxtaglist_t *taglist = NULL;
        size = mxtag_list_get(&taglist, TAG_TYPE_IO);
        for (i = 0; i < size; i++) {
            printf("source name: %s\n", taglist[i].source_name);
            printf("tag name: %s\n", taglist[i].tag_name);
            printf("data type: %s\n", taglist[i].data_type);
            printf("data unit: %s\n", taglist[i].data_unit);
            printf("access: %s\n", taglist[i].access);
            printf("duration: %d ms\n", taglist[i].duration);
        }

        if (taglist) {
            mxtag_list_free(&taglist);
            taglist = NULL;
        }
        return 0;
    }

### Example: get tag list in json format

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

---

## Tag Pub/Sub API

### mxtag_publish

      int mxtag_publish( tag_t           *tag,
                         const char      *source_name,
                         const char      *tag_name,
                         const char      *tag_ts,
                         const char      *tag_unit,
                         data_value_t    *data_value,
                         data_type_t      data_type )

Parameters

- tag Instance of tag api.
- source_name Source of tag in which the data comes from.
- tag_name Name of tag.
- tag_ts Timestamp at tag publishing.
- tag_unit Unit of tag.
- data_type Data type of tag [uint16, uint32, uint64, int16, int32, int64, float32, float64, string, boolean, bytearray]
- data_value Value of tag.

Returns

If the function succeeds, the return value is 0. Otherwise, 1 on failure.

---

### mxtag_subscribe

      int mxtag_subscribe( tag_t           *tag,
                           const char      *source_name,
                           const char      *tag_name )

Parameters

- tag Instance of tag api.
- source_name Source of tag in which the data comes from.
- tag_name Name of tag.

Returns

If the function succeeds, the return value is 0. Otherwise, 1 on failure.

### mxtag_unsubscribe

      int mxtag_unsubscribe( tag_t           *tag,
                             const char      *source_name,
                             const char      *tag_name )

Parameters

- tag Instance of tag api.
- source_name Source of tag in which the data comes from.
- tag_name Name of tag.

Returns

If the function succeeds, the return value is 0. Otherwise, 1 on failure.

### mxtag_subscribe_callback

      int mxtag_subscribe_callback( tag_t      *tag,
                                    on_tag      cb_func )

Parameters

- tag Instance of tag api.
- cb_func Callback function to receive subscribed tags.

Returns

If the function succeeds, the return value is 0. Otherwise, 1 on failure.

### Example: publish tag

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

### Example: subscribe tag

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

**After tag subscription, the following sample shows how to receive tags by a callback function.**

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

---

## Tag CLI

    Usage: tagcli [commands]

    commands:
      ls [options]  get tag list by the specific type
      options:      [-i <IO tag list>]
                    [-s <System tag list>]
                    [-v <Virtual tag list>]

**GET IO TAGS:**

    tagcli ls -i
