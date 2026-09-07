import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "InsightLoop API",
      version: "1.0.0",
      description: "API documentation for InsightLoop Platform",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: env.COOKIE_NAME,
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["./src/**/*.ts", "./src/modules/**/*.ts", "./src/schemas/**/*.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
