FROM node:10.15.2-alpine

WORKDIR /home/entony/node_hosts

COPY . .

RUN npm install

ENV NODE_ENV=production \
	MONGO_URL=mongodb://admin:wb29nNiDLSdrTip@ds149947.mlab.com:49947/clinic-api \
	SECRET_KEY=eferfwrgewgerg

CMD node index.js
EXPOSE 5000/tcp