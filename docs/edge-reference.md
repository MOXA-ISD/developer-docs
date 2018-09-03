---
id: edge-reference
title: API Reference
---

## Web Service API Reference

Check the [link](https://thingspro-edge-oapi.netlify.com/) to get full API reference. We list a few common API as following.

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
