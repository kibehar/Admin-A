import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the backend system.',
    },
    servers: [
      {
        url: 'http://localhost:5000/api', 
      },
    ],
  },
  apis: [
    './src/routes/authRoutes.ts',
    './src/routes/userRoutes.ts',
    './src/routes/inventoryRoutes.ts',
    './src/routes/warehouseRoutes.ts',
    './src/routes/saleRoutes.ts',
    './src/routes/supplierRoutes.ts',
    './src/controllers/authController.ts',
    './src/controllers/userController.ts',
    './src/controllers/inventoryController.ts',
    './src/controllers/warehouseController.ts',
    './src/controllers/saleController.ts',
    './src/controllers/supplierController.ts',
    './src/controllers/profileController.ts', 
    './src/controllers/UserProfileController.ts',
  ], 
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
