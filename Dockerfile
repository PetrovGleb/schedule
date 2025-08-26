# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the Nest.js application will run

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate dev && npm run start:dev"]
