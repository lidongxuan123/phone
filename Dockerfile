FROM nginx:1.14

ARG NGINX_FILE

WORKDIR /etc/nginx

COPY ./deploy/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

COPY build .

EXPOSE 8001

CMD nginx -g "daemon off;"