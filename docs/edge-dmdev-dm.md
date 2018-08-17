---
id: edge-dmdev-dm
title: Device Management Development
---

## Introduction

---

In this quickstart you learn how to develop a your device management module (DM-device) by ThingsPro data management SDK .

## Prerequisite

---

The prebuild libraries provided in (/external/lib) is for Debian 9 x86.

A properly configured MQTT broker on UC-8100.

- Add the following settings to /etc/mosquitto/thingspro.conf

      psk_hint YOURID
      psk_file /PATH/TO/pskfile.cfg

- Add the following settings to /PATH/TO/pskfile.cfg.

      DeviceID:DeviceKey

- Restart the broker (port 8883)

## DM API

---

## dmdevice_init

    void dmdevice_init(DMSession **session, size_t session_count)

User should provide some required information before calling this function. A corresponding handle will be generated if the provided information is correct.

## Parameters

- session

  Initialize sessions, each session indicates a connection to a device management service.

      typedef struct
          {
              // user input section
              enum CLOUD_TYPE type;     // CLOUD_ISD
              char *host;               // IP address or device connection string
              int port;                 // 8883
              int keepalive;            // timeout(sec)
              char *id;                 // device id
              char *key;                // device key provided by device management service
              void *user_context;       // A user pointer that will be passed as an argument to connection_callback / twin_callback / command_callback.

              // SDK generate section
              void *handle;             // SDK generates a handle for each session after a successful initialization
              int connection_status;    // indicates the connection status - 0: disconnected; 1: connected
          } DMSession

- session_count:

  If there is a need to connect multiple device management services, user can provide a DMSession list and specify its size with **session_count**. Normally this should be set to 1.

---

## set_connection_callback

    void set_connection_callback(DMSession *session, DMCLIENT_CONNECTION_CALLBACK connection_callback)

Set the connection callback. This is called whenever the connection status has changed.

## Parameters

- session

  The target DMSession instance.

- connection_callback

  A callback function in the following form: void callback(DMSession \*session, int result, int reason, void \*user_context)

## Callback Parameters

- session

  Specifies which session has a connection status change event.

- result

  Zero indicates that the session has connected successfully, else means the session has disconnected.

- reason

  A number that indicates the reason causing the disconnection.

- user_context

  The user_context which was provided while initializing the session.

---

## set_twin_callback

    void set_twin_callback(DMSession \*session, int update_state, DMCLIENT_TWIN_CALLBACK twin_callback)

Set the twin callback. This is called whenever a twin update is received.

## Parameters

- session

  The target DMSession instance.

- update_state

  Indicates whether this is a complete device twin or a partial device twin.

- twin_callback

  A callback function in the following form: void callback(DMSession \*session, const unsigned char \*payload, void \*user_context)

## Callback Parameters

- session

  Specifies which session received the twin update.

- payload

  The received desired state.

- user_context

  The user_context which was provided while initializing the session.

---

## set_command_callback

    void set_command_callback(DMSession *session, DMCLIENT_COMMAND_CALLBACK command_callback)

Set the command callback. This is called whenever a command is invoked.

## Parameters

- session

  The target DMSession instance.

- command_callback

  A callback function in the following form: int callback(DMSession \*session, const unsigned char \*command_name, const unsigned char \*payload, unsigned char \*\*response, size_t \*response_size, void \*user_context)

## Callback Parameters

- session

  Specifies which session received the command.

- command_name

  The command name.

- payload

  The arguments of the command.

- response

  The response for the caller.

- response_size

  The size of the response.

- user_context

  The user_context which was provided while initializing the session.

## Callback Return Value

The return code of the command. It will be reported to the device management service.

---

## dmdevice_connect

    DMDEVICE_RESULT dmdevice_connect(DMSession *session)

Connect to the device management service. The callback functions mentioned above will be called only if the connection is established.

## Parameters

- session

  The target DMSession instance.

## Return Vlaue

    typedef enum DMDEVICE_RESULT_VALUE
    {
        DMDEVICE_SUCCEEDED,
        DMDEVICE_FAILED
    } DMDEVICE_RESULT;

---

## dmdevice_sendReported

    DMDEVICE_RESULT dmdevice_sendReported(DMSession *session, const unsigned char *reported, size_t reported_size, DMDEVICE_REPORTED_CALLBACK reported_callback, void *user_context)

Send reported state to device management service.

## Parameters

- session

  The target DMSession instance.

- reported

  The reported state to be updated.

- reported_size

  The size of the reported string. This value can not exceed 65536.

- reported_callback

  A callback function in the following form: void callback(DMSession \*session, int status_code, void \*user_context)

- user_context

  A user pointer that will be passed as an argument to reported_callback that are specified.

## Return Value

    typedef enum DMDEVICE_RESULT_VALUE
    {
        DMDEVICE_SUCCEEDED,
        DMDEVICE_FAILED
    } DMDEVICE_RESULT;

DMDEVICE_FAILED will be returned if the reported_size is larger than 65536.

## Callback Parameters

- session

  Specifies which session have sent the reported state.

- status_code

  The return value from data management service. If the service accepts the update, status_code is set to zero, else return a nonzero value.

- user_context

  The user_context which was provided while sending the reported state.

---

## dmdevice_disconnect

    void dmdevice_disconnect(DMSession *session)

Disconnect to the device management service. The callback functions mentioned above will no longer be called if the disconnected.

## Parameters

- session

  The target DMSession instance.

---

## dmdevice_uninit

    void dmdevice_uninit()

Free all the resources associated with the library.
