FROM node:14

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update
RUN apt-get install -y yarn

RUN apt-get install -y python-dev python-pip ruby ruby-dev rubygems build-essential rpm
RUN pip install awscli
RUN gem install --no-document fpm

