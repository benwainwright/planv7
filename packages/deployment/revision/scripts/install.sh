#!/usr/bin/env bash
set -e
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
amazon-linux-extras install nginx1
yum remove choirpractise* -y
yum localinstall -y /tmp/install/choirpractise.rpm
chmod u+x /usr/bin/choirpractise-server
