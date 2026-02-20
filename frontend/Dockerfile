FROM node:22-bullseye-slim

# Build-time args injected by docker-compose from the root .env
ARG VITE_WS_BACKEND_URL
ARG VITE_HTTP_BACKEND_URL
ARG VITE_IS_DEPLOYED

ENV VITE_WS_BACKEND_URL=${VITE_WS_BACKEND_URL}
ENV VITE_HTTP_BACKEND_URL=${VITE_HTTP_BACKEND_URL}
ENV VITE_IS_DEPLOYED=${VITE_IS_DEPLOYED}
ENV NODE_ENV=development
ENV YARN_PRODUCTION=false
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app

COPY package.json yarn.lock /app/

# Install devDependencies (tsc/vite needed for build/preview)
RUN yarn install --non-interactive --production=false && yarn cache clean

COPY ./ /app/

# In containers we serve a production build (no HMR).
RUN yarn build

EXPOSE 5173

CMD ["node", "/app/node_modules/vite/bin/vite.js", "preview", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
