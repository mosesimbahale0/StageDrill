# 1. Base Stage: Use a specific, lightweight Node.js version
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# 2. Dependencies Stage: Install all dependencies for building
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 3. Build Stage: Generate the production build artifacts
FROM deps AS build
WORKDIR /app
COPY . .
# Use the node_modules from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# 4. Production Stage: Create a small final image with only what's needed
FROM base AS production
WORKDIR /app
ENV PORT=8080
EXPOSE 8080

# Copy only the production server, build artifacts, and public assets
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/build/ ./build
COPY --from=build /app/public/ ./public
COPY --from=build /app/package.json ./package.json

# Install ONLY production dependencies
RUN npm prune --production

# This command now explicitly uses the start script from package.json
CMD ["npm", "run", "start"]

