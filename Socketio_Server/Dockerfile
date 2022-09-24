FROM node
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "./build/app.js"]