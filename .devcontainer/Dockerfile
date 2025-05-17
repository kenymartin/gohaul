FROM node:20-bullseye

# Install basic development tools
RUN apt update && apt install -y less git

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Install global npm packages
RUN npm install -g prisma typescript ts-node nodemon

# Set `SHELL` so it's available in VS Code terminal
ENV SHELL /bin/bash 