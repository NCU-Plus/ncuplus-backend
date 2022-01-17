FROM node:16.13.2-bullseye

RUN mkdir -p /app

WORKDIR /app

# update npm
RUN npm install -g @nestjs/cli

CMD ["/bin/bash"]