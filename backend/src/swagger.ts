import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const port = process.env.PORT || '3000';
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Network API',
      version: '1.0.0',
    },
    servers: [{ url: baseURL }],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        RefreshTokenCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
        },
      },

      schemas: {
        ObjectId: {
          type: 'string',
          example: '507f1f77bcf86cd799439011',
        },

        DocumentMetadata: {
          type: 'object',
          properties: {
            _id: { $ref: '#/components/schemas/ObjectId' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        User: {
          allOf: [
            { $ref: '#/components/schemas/DocumentMetadata' },
            {
              type: 'object',
              properties: {
                username: { type: 'string' },
                email: { type: 'string', format: 'email' },
                isPrivate: { type: 'boolean' },
                postsCount: { type: 'number' },
                bio: { type: 'string', nullable: true },
                profilePictureURL: { type: 'string', nullable: true },
              },
            },
          ],
        },

        CreateUserDTO: {
          type: 'object',
          required: ['username', 'email', 'password', 'isPrivate'],
          properties: {
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
            isPrivate: { type: 'boolean' },
            postsCount: { type: 'number' },
            bio: { type: 'string', nullable: true },
            profilePictureURL: { type: 'string', nullable: true },
          },
        },

        UpdateUserDTO: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
            isPrivate: { type: 'boolean' },
            postsCount: { type: 'number' },
            bio: { type: 'string', nullable: true },
            profilePictureURL: { type: 'string', nullable: true },
          },
        },

        UserCredentials: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string', format: 'password' },
          },
        },

        Post: {
          allOf: [
            { $ref: '#/components/schemas/DocumentMetadata' },
            {
              type: 'object',
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                imageURL: { type: 'string', nullable: true },
                commentsAmount: { type: 'number', example: 5 },
                sender: { $ref: '#/components/schemas/User' },
              },
            },
          ],
        },

        CreatePostDTO: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            imageURL: { type: 'string', nullable: true },
          },
        },

        UpdatePostDTO: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            imageURL: { type: 'string', nullable: true },
          },
        },

        PaginatedPosts: {
          type: 'object',
          properties: {
            posts: {
              type: 'array',
              items: { $ref: '#/components/schemas/Post' },
            },
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            pages: { type: 'number', example: 10 },
          },
        },

        Comment: {
          allOf: [
            { $ref: '#/components/schemas/DocumentMetadata' },
            {
              type: 'object',
              properties: {
                content: { type: 'string' },
                postId: { $ref: '#/components/schemas/ObjectId' },
                senderId: { $ref: '#/components/schemas/ObjectId' },
              },
            },
          ],
        },

        CreateCommentDTO: {
          type: 'object',
          required: ['content', 'postId'],
          properties: {
            content: { type: 'string' },
            postId: { $ref: '#/components/schemas/ObjectId' },
          },
        },

        UpdateCommentDTO: {
          type: 'object',
          properties: {
            content: { type: 'string' },
          },
        },
      },
    },
  },

  apis: ['src/**/*.ts'],
});

export default swaggerSpec;
