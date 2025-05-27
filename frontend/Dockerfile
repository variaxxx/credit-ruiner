FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci && \
    npm cache clean --force

COPY . .

RUN npm run build --prod

FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/src/app/dist/credit-ruiner/browser /usr/share/nginx/html
