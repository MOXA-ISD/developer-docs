---
id: ui-app-component-config
title: Component Configs
---

## `Fields` is an array of Config

### `Config` interface

```json
{
  "key": string,
  "type": string,
  "templateOptions": {
    // The options are for a specific type, such as `select` `input`.
  }
}
```

### Fields Example

```json
      [
        {
          key: 'connection',
          type: 'input',
          templateOptions: {
            // The input type contains placeholder templatOptions.
            placeholder: 'Device Connection String'
          }
        },
        {
          key: 'protocol',
          type: 'select',
          templateOptions: {
            // The select type contains label, placeholder, and options templatOptions.
            label: 'Transport Protocol',
            placeholder: 'Transport Protocol',
            options: [{ value: 'MQTT', label: 'MQTT' }, { value: 'AMQT', label: 'AMQT' }, { value: 'HTTP', label: 'HTTP' }]
          }
        },
        {
          key: 'tags',
          type: 'tagSelector'
        },
        {
          key: 'event',
          type: 'float',
          templateOptions: {
            label: 'Event Update Interval'
          }
        }
      ];
```

## Types

### `checkbox`

| Property | type    | Description          |
| -------- | ------- | -------------------- |
| label    | string  |                      |
| required | boolean | The filed is rquired |
| align    | string  | \"start or end\"     |

### `datetimepicker`

| Property    | type   | Description |
| ----------- | ------ | ----------- |
| placeholder | string |             |

### `aliasName`

Regex: `/^[A-Za-z0-9_-]{3,255}$/`

| Property    | type   | Description |
| ----------- | ------ | ----------- |
| label       | string |             |
| placeholder | string |             |

### `domain`

Regex: `/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/`

| Property    | type   | Description |
| ----------- | ------ | ----------- |
| label       | string |             |
| placeholder | string | 127.0.0.1   |

### `email`

Regex:

    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

| Property    | type   | Description |
| ----------- | ------ | ----------- |
| label       | string |             |
| placeholder | string |             |

### `file`

Usage: Select a file and upload

No templateOptions.

### `float`

| Property    | type   | Description                  |
| ----------- | ------ | ---------------------------- |
| label       | string |                              |
| placeholder | string |                              |
| min         | float  | default min number is -65535 |
| max         | float  | default max number is 65535  |

### `hostname`

Its behaviour is the same as `domain` but with different error message.

### `input`

Usage: lets users type data without any restriction.

| Property    | type   | Description |
| ----------- | ------ | ----------- |
| placeholder | string |             |

### `ip`

Regex:

    // Check ip format
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
    or
    // Check multicast IP, e.g. 224.0.0.1, 239.255.255.255
    /2(?:2[4-9]|3\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d?|0)){3}/

| Property    | type   | Description |
| ----------- | ------ | ----------- |
| label       | string | default IP  |
| placeholder | string |             |

### `latitude`

Regex: `/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/`

| Property    | type   | Description      |
| ----------- | ------ | ---------------- |
| label       | string | default Latitude |
| placeholder | string |                  |

### `longitude`

Regex: `/^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/`

| Property    | type   | Description       |
| ----------- | ------ | ----------------- |
| label       | string | default Longitude |
| placeholder | string |                   |

### `mac`

Regex: `/^([0-9A-F]{2}[:]){5}([0-9A-F]{2})$/`

| Property    | type   | Description |
| ----------- | ------ | ----------- |
| label       | string | default MAC |
| placeholder | string |             |

### `number`

Regex: `/^d+$/`

| Property    | type    | Description      |
| ----------- | ------- | ---------------- |
| label       | string  | default Number   |
| placeholder | string  |                  |
| min         | integer | default -65535   |
| max         | integer | "default 65535 " |

### `password`

| Property    | type   | Description      |
| ----------- | ------ | ---------------- |
| label       | string | default Password |
| placeholder | string |                  |

### `port`

| Property    | type    | Description   |
| ----------- | ------- | ------------- |
| label       | string  | default Port  |
| placeholder | string  |               |
| min         | integer | default 1     |
| max         | integer | default 65535 |

### `textarea`

| Property    | type   | Description      |
| ----------- | ------ | ---------------- |
| label       | string | default Textarea |
| placeholder | string |                  |

### `url`

Regex:

    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/

| Property    | type   | Description |
| ----------- | ------ | ----------- |
| label       | string | default Url |
| placeholder | string |             |

### `radio`

| Property | type                                                 | Description     |
| -------- | ---------------------------------------------------- | --------------- |
| label    | string                                               | default `Radio` |
| options  | \[{ "key": string, "label": string, "value": any }\] |                 |

## `select`

| Property    | type                                                   | Description      |
| ----------- | ------------------------------------------------------ | ---------------- |
| label       | string                                                 | default `Select` |
| placeholder | { "disabled": boolean, "label": string, "value": any } |                  |

## `slider`

| Property | type    | Description                              |
| -------- | ------- | ---------------------------------------- |
| label    | string  | default Slider                           |
| min      | integer |                                          |
| max      | integer |                                          |
| step     | integer | The values at which the thumb will snap. |

## `tagSelector`

The type is for cloud applications to select tags.

## `toggle`

| Property | type   | Description    |
| -------- | ------ | -------------- |
| label    | string | default Toggle |
