#!/usr/bin/env bash
yum-config-manager --enable epel
yum localinstall -y /tmp/install/*.rpm
