FROM node:22

RUN apt-get update && apt-get install -y wget gnupg
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable
RUN apt-get install -y libatk-bridge2.0-0 libgtk-3-0 libgbm-dev libasound2

WORKDIR /chatter
ADD . .
RUN yarn install --frozen-lockfile

CMD ["yarn", "start"]