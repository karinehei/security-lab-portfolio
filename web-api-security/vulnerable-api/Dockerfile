FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma.config.ts ./
COPY prisma ./prisma
# prisma generate reads prisma.config.ts; URL is unused for generate but env() requires it
ENV DATABASE_URL=postgresql://lab:lab@127.0.0.1:5432/documents_lab
RUN npx prisma generate

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY prisma/seed.ts ./prisma/seed.ts

# Official Node alpine images ship npm with tar 6.2.1 (CVE-2026-59873). A fix exists in tar
# 7.5.19, but npm still vendors 6.x. This lab image does not extract untrusted
# archives at runtime; drop global npm/npx after generate and use local CLIs.
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx

ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && ./node_modules/.bin/tsx prisma/seed.ts && ./node_modules/.bin/tsx src/index.ts"]
