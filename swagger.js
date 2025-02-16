import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WitsCTF API Docs",
      version: "1.0.0",
    },
  },
  apis: ["app/api/**/*.js"], // Points to your API route files
};

const swaggerSpec = swaggerJsdoc(options);
console.log(JSON.stringify(swaggerSpec, null, 2));

export default swaggerSpec;
