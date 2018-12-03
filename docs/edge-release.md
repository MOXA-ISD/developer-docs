---
id: edge-appdev-app
title: Release Notes
---

# v0.8.0

New Features

- [Core] New dashboard
- [Core] Add supports for HTTP server port settings and fail2ban
- [Core] Re-design sidebar
- [APP] New APPs: Modbus Slave and NodeRED
- [APP] Azure supports data logger
- [APP] Console includes developer toolchain
- [APP] Modbus TCP Master reconnects automatically

Improvements

- [Core] System Agent is re-written with Golang
- [Core] APPMAN supports preinst, postinst, prerm, postrm scripts
- [APP] Many APPs improve its installation time, starting time and image size

Fixes:

- [Core] Mosquitto reverts to stable version

Known Issues

- [APP] OPC UA server and client cannot publish tags properly

Breaking Changes

- core-sanji is deprecated. Any APP use in nginx.conf have to replace it with core-appman
- mosquitto is moved to appman container. All APPs have to repack with the latest libsanji=1.6.0-1 and libmxtagf-dev=1.4.1-1.
