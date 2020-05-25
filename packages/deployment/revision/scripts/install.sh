#!/usr/bin/env bash
yum-config-manager --enable epel
yum remove planv7* -y
yum localinstall -y /tmp/install/planv7.rpm
