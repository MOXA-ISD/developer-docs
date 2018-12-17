---
id: edge-release
title: Release Notes
---

# v0.9.0

New Features

- [Core] Add Resource Manager
- [Core] Add Log
- [Core] Add APP icon
- [TAG] Support direct command and protocol subscription
- [APP] Release new implementation of device APP for UC-8100 series
- [APP] APP Modbus Master TCP/RTU support read and write in holding registers and coils

Improvements

- [Core] Dashboard shows System Resource including ThingsPro Core and System
- [Core] Starting APP in a fixed sequence
- [APP] APP Azure and Modbus Slave have better UI

Fixes:

- [APP] Fixes bugs of APP Modbus Master TCP/RTU and Azure

Known Issues

- This version must install by run `dpkg --purge cg-appman` first, then install by `wget -O- [http://repo.moxa.online/static/v3/edge/dists/v0.8.0/install.sh](http://repo.moxa.online/static/v3/edge/dists/v0.8.0/install.sh) | sh -s uc-8112-lx`

Breaking Changes

- N/A

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
