# 1. Base image
# ---- THIS IS THE FIX ----
# Switched from FIPS-enabled 'bitnami/node' to the standard 'node' image
FROM node:24-slim AS base
WORKDIR /app
COPY package*.json ./

# 2. Builder stage: Install all deps (including dev) and build the app
FROM base AS builder
# Install all dependencies
RUN npm install
# Copy all source code
COPY . .
# Build the TypeScript
RUN npm run build

# 3. Production stage: Install ONLY production deps and copy built code
FROM base AS production
ENV NODE_ENV=production
# Install only production dependencies
RUN npm install --omit=dev
# Copy built code from the builder stage
COPY --from=builder /app/dist ./dist

ENV PORT=8080
EXPOSE 8080

# The CMD is now simpler, as package.json is already copied from 'base'
CMD ["npm", "run", "start"]


# # 1. Base image
# FROM bitnami/node:latest AS base
# WORKDIR /app
# COPY package*.json ./

# # 2. Builder stage: Install all deps (including dev) and build the app
# FROM base AS builder
# # Install all dependencies
# RUN npm install
# # Copy all source code
# COPY . .
# # Build the TypeScript
# RUN npm run build

# # 3. Production stage: Install ONLY production deps and copy built code
# FROM base AS production
# ENV NODE_ENV=production
# # Install only production dependencies
# RUN npm install --omit=dev
# # Copy built code from the builder stage
# COPY --from=builder /app/dist ./dist

# ENV PORT=8080
# EXPOSE 8080

# # The CMD is now simpler, as package.json is already copied from 'base'
# CMD ["npm", "run", "start"]


