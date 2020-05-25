#!/usr/bin/env bash
amazon-linux-extras install epel
yum remove planv7* -y
yum localinstall -y /tmp/install/planv7.rpm
