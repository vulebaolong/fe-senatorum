# ---------- builder ----------
FROM node:24-alpine AS builder
WORKDIR /fe
ENV NEXT_TELEMETRY_DISABLED=1

# pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# cài deps đầy đủ để build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# copy source
COPY . .

# (nếu bạn cần biến NEXT_PUBLIC_* lúc build, truyền bằng --build-arg)
# stage build
ARG NEXT_PUBLIC_IS_PRODUCTION
ARG NEXT_PUBLIC_BASE_DOMAIN_BE
ARG NEXT_PUBLIC_BASE_DOMAIN_FE
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY

ENV NEXT_PUBLIC_IS_PRODUCTION=${NEXT_PUBLIC_IS_PRODUCTION}
ENV NEXT_PUBLIC_BASE_DOMAIN_BE=${NEXT_PUBLIC_BASE_DOMAIN_BE}
ENV NEXT_PUBLIC_BASE_DOMAIN_FE=${NEXT_PUBLIC_BASE_DOMAIN_FE}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY=${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}

RUN printenv | grep NEXT_PUBLIC_ 

# yêu cầu next.config.js có: module.exports = { output: 'standalone' }
# Build NestJS
RUN pnpm run build

# Cài dependencies production-only
RUN pnpm prune --prod

# ---------- runner ----------
FROM node:24-alpine AS runner
WORKDIR /fe
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# (tùy – hữu ích cho 1 số native addon)
# RUN apk add --no-cache libc6-compat

# chỉ cài prod deps để runtime sạch
RUN corepack enable && corepack prepare pnpm@latest --activate

# copy app đã build
COPY --from=builder /fe/.next/standalone ./
COPY --from=builder /fe/public ./public
COPY --from=builder /fe/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]

# docker container stop con-fe_senatorum && docker container rm con-fe_senatorum && docker image rm img-fe_senatorum:latest

# set -a
# . ./.env
# set +a

# docker build \
#   --build-arg NEXT_PUBLIC_BASE_DOMAIN_BE=$NEXT_PUBLIC_BASE_DOMAIN_BE \
#   --build-arg NEXT_PUBLIC_BASE_DOMAIN_FE=$NEXT_PUBLIC_BASE_DOMAIN_FE \
#   --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID \
#   --build-arg NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY=$NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY \
#   -t img-fe_senatorum:latest .

# docker run -d --name con-fe_senatorum -p 3001:3000 img-fe_senatorum:latest

