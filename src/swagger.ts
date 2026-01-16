import dotenv from 'dotenv';
import { Types } from 'mongoose';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const port = process.env.PORT || '3000';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Network API',
      version: '1.0.0',
    },
    servers: [{ url: `http://localhost:${port}` }],

    components: {
      schemas: {
        DocumentMetadata: {
          type: 'object',
          properties: {
            _id: Types.ObjectId,
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
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
                isPrivate: { type: 'boolean' },
                postsCount: { type: 'number' },
                bio: { type: 'string', nullable: true },
              },
            },
          ],
        },

        CreateUserDTO: {
          type: 'object',
          required: ['name', 'email', 'isPrivate', 'postsCount'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            isPrivate: { type: 'boolean' },
            postsCount: { type: 'number' },
            bio: { type: 'string', nullable: true },
          },
        },

        UpdateUserDTO: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            isPrivate: { type: 'boolean' },
            postsCount: { type: 'number' },
            bio: { type: 'string', nullable: true },
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
                senderId: Types.ObjectId,
              },
            },
          ],
        },

        CreatePostDTO: {
          type: 'object',
          required: ['title', 'content', 'senderId'],
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            senderId: Types.ObjectId,
          },
        },

        UpdatePostDTO: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            senderId: Types.ObjectId,
          },
        },

        Comment: {
          allOf: [
            { $ref: '#/components/schemas/DocumentMetadata' },
            {
              type: 'object',
              properties: {
                content: { type: 'string' },
                postId: Types.ObjectId,
                senderId: Types.ObjectId,
              },
            },
          ],
        },

        CreateCommentDTO: {
          type: 'object',
          required: ['content', 'postId', 'senderId'],
          properties: {
            content: { type: 'string' },
            postId: Types.ObjectId,
            senderId: Types.ObjectId,
          },
        },

        UpdateCommentDTO: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            senderId: Types.ObjectId,
          },
        },
      },
    },
  },

  apis: ['src/**/*.ts'],
});

export default swaggerSpec;
