---
id: edge-dmdev-dm
title: Device Management Development
---

## Introduction

---

In this quickstart you learn how to develop a your device management module (DM-device) by ThingsPro data management SDK .

## Prerequisite

---

Make sure the following dependencies are installed.

    apt-get install -y libmosquitto-dev libcurl4-openssl-dev

## DM API

---
## dmdevice_init

    void dmdevice_init()

Initializes the Thingspro data management SDK. It must be invoked before any further actions.

## dmdevice_create_session

    void dmdevice_create_session(DMSession **session, size_t session_count)

User should provide some required information before calling this function. A corresponding handle will be generated if the provided information is correct.

## Parameters

- session

  Initialize sessions, each session indicates a connection to a device management service.

      typedef struct
      {
          // user input section
          CLOUD_TYPE type;
          char *host;
          int port;
          int keepalive;
          char *id;
          char *key;
          char *cert;
          #ifdef DM_CLOUD_AWS
          char *rootCA;
          #endif
          void *user_context;

          // SDK generate section
          void *handle;
          int connection_status;
      } DMSession;

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

    void set_twin_callback(DMSession *session, DMCLIENT_TWIN_CALLBACK twin_callback)

Set the twin callback. This is called whenever a twin update is received.

## Parameters

- session

  The target DMSession instance.

- twin_callback

  A callback function in the following form: void callback(DMSession \*session, DEVICE_TWIN_TYPE update_state, const unsigned char \*payload, void \*user_context)

## Callback Parameters

- session

  Specifies which session received the twin update.

- update_state

  Indicates whether this is a complete device twin or a partial device twin.

- payload

  The received device twin.

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

  The response to the caller.

- response_size

  The size of the response.

- user_context

  The user_context which was provided while initializing the session.

## Callback Return Value

The return code of the command. It will be reported to the device management service. HTTP status code is the suggested implementation.

---

## dmdevice_connect

    DMDEVICE_RESULT dmdevice_connect(DMSession *session)

Connect to the device management service. Note that this function is an asynchronize call, the return value DMDEVICE_SUCCEEDED does not implies the connection has been established successfully. The actual connection status will be reported by the callback function set by set_connection_callback().

## Parameters

- session

  The target DMSession instance.

## Return Value

    typedef enum DMDEVICE_RESULT_VALUE
    {
        DMDEVICE_SUCCEEDED,
        DMDEVICE_FAILED
    } DMDEVICE_RESULT;

---
## dmdevice_message_create

    DMMessage_Handle dmdevice_message_create(char *payload)

## Parameters

- payload

  The payload of the message.

## Return Value

A handle representing the message instance.

---

## dmdevice_message_append_property

    void dmdevice_message_append_property(DMMessage_Handle message, char *key, char *value)

## Parameters

- message

  The targeted message instance which to append property.

- key

  An unique key of the property.

- value

  Value of the property.

## Return Value

---

## dmdevice_sendMessage

    DMDEVICE_RESULT dmdevice_sendMessage(DMSession *session, DMMessage_Handle message, DMDEVICE_MESSAGE_CALLBACK message_callback, void *user_context);

Send message to device management service.

## Parameters

- session

  The target DMSession instance.

- message

  The message to be sent to device management serveice.

- message_callback

  A callback function in the following form: void callback(DMSession \*session, int status_code, void \*user_context)

- user_context

  A user pointer that will be passed as an argument to reported_callback that are specified.

## Return Value

    typedef enum DMDEVICE_RESULT_VALUE
    {
        DMDEVICE_SUCCEEDED,
        DMDEVICE_FAILED
    } DMDEVICE_RESULT;

## Callback Parameters

- session

  Specifies which session have sent the reported state.

- status_code

  The return value from data management service. If the service accepts the update, status_code is set to zero, else return a nonzero value.

- user_context

  The user_context which was provided while sending the reported state.

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

  The size of the reported string. The limitation of this value is 8192.

- reported_callback

  A callback function in the following form: void callback(DMSession *session, DEVICE_TWIN_TYPE update_state, const unsigned char *payload, void *user_context)

- user_context

  A user pointer that will be passed as an argument to reported_callback that are specified.

## Return Value

    typedef enum DMDEVICE_RESULT_VALUE
    {
        DMDEVICE_SUCCEEDED,
        DMDEVICE_FAILED
    } DMDEVICE_RESULT;

DMDEVICE_FAILED will be returned if the reported_size is larger than 8192.

## Callback Parameters

- session

  Specifies which session received the twin update.

- update_state

  Indicates whether this is a complete device twin or a partial device twin.

- payload

  The received device twin.

- user_context

  The user_context which was provided while initializing the session.

---

## dmdevice_disconnect

    void dmdevice_disconnect(DMSession *session)

Disconnect from the device management service.

## Parameters

- session

  The target DMSession instance.

---

## dmdevice_remove_session

Remove a creates session.

## Parameters

- session

  The session to be removed.

---

## dmdevice_uninit

    void dmdevice_uninit()

Free all the resources associated with the library.
