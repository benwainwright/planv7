#!/usr/bin/env bash
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
yum remove planv7* -y
yum localinstall -y /tmp/install/planv7.rpm
chmod u+x /usr/bin/planv7-server
