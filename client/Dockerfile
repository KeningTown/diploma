FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN rm -rf node_modules && yarn install --frozen-lockfile

COPY . .

RUN yarn run build

FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3001/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
