FROM nginx:1.30-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY *.html *.js robots.txt sitemap.xml /usr/share/nginx/html/
COPY *.webp *.jpg *.png *.ico *.woff2 inter-OFL.txt /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
