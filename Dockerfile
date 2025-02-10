# Stage 1: Build and package
# Use a Node.js base image
FROM node:18.20.5-alpine AS build
# Download typescript
RUN npm install -g typescript
LABEL author="Mae Wood"
# Set working directory inside container
WORKDIR /ch-frontend
# Copy package.json and package-lock.json for caching
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the app file
COPY . .
RUN npm run build-now


# Stage 2: Production Artefact
FROM node:18.20.5-alpine
ENTRYPOINT ["node"]
CMD ["dist/src/app.js"]
LABEL author="Mae Wood"
# Expose the port the app runs on
EXPOSE 3000
WORKDIR /ch-frontend

COPY package.json .
COPY package-lock.json .
# Omits dev dependencies to make running the app more lightweight
RUN NODE_ENV=production npm ci --omit=dev

COPY --from=build /ch-frontend/dist/src ./dist/src
COPY public ./public
COPY views ./views

