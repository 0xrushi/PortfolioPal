FROM node:22-bullseye-slim

# Build-time args injected by docker-compose from the root .env
ARG VITE_WS_BACKEND_URL
ARG VITE_HTTP_BACKEND_URL

ENV VITE_WS_BACKEND_URL=${VITE_WS_BACKEND_URL}
ENV VITE_HTTP_BACKEND_URL=${VITE_HTTP_BACKEND_URL}
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app

COPY package.json yarn.lock /app/

# Ensure devDependencies (including Vite) are installed in Docker
RUN yarn install --production=false && yarn cache clean

COPY ./ /app/

EXPOSE 5173

CMD ["node", "/app/node_modules/vite/bin/vite.js", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
