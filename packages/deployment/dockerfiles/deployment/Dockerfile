FROM amazonlinux:2

RUN curl --silent --location https://rpm.nodesource.com/setup_14.x | bash -
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN rpm --import https://dl.yarnpkg.com/rpm/pubkey.gpg

RUN yum install -y \
      python-dev \
      python-pip \
      ruby \
      git \
      jq \
      gcc \
      make \
      ruby-devel \
      rubygems \
      build-essential \
      rpm \
      rpm-build \
      yarn

RUN pip install awscli
RUN gem install ffi -f
RUN gem install --no-document fpm

