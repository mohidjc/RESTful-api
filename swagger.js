const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0', // Specification version
  info: {
    title: 'Restaurant Social Media API',
    version: '1.0.0',
    description: 'API documentation for the restaurant social media app',
  },
  components: {
    schemas: {
      Post: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Post ID',
          },
          user: {
            type: 'string',
            description: 'ID of the user who created the post',
          },
          image: {
            type: 'string',
            description: 'URL of the image associated with the post',
          },
          description: {
            type: 'string',
            description: 'Description or text content of the post',
          },
          restaurant: {
            type: 'string',
            description: 'ID of the restaurant associated with the post',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date and time when the post was created',
          },
          likes: {
            type: 'array',
            items: {
              type: 'string',
              description: 'User ID of the person who liked the post',
            },
            description: 'List of user IDs who liked the post',
          },
          comments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: {
                  type: 'string',
                  description: 'ID of the user who made the comment',
                },
                text: {
                  type: 'string',
                  description: 'Comment text',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Date and time when the comment was created',
                },
              },
            },
            description: 'List of comments on the post',
          },
        },
      },
      Restaurant: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Restaurant ID',
          },
          name: {
            type: 'string',
            description: 'Name of the restaurant',
          },
          location: {
            type: 'string',
            description: 'Location of the restaurant',
          },
          phoneNumber: {
            type: 'string',
            description: 'Phone number of the restaurant',
          },
          email: {
            type: 'string',
            description: 'Email address of the restaurant',
          },
          website: {
            type: 'string',
            description: 'Website of the restaurant',
          },
          hours: {
            type: 'object',
            properties: {
              monday: {
                type: 'object',
                properties: {
                  open: { type: 'string', description: 'Opening time on Monday' },
                  close: { type: 'string', description: 'Closing time on Monday' },
                },
              },
              tuesday: {
                type: 'object',
                properties: {
                  open: { type: 'string', description: 'Opening time on Tuesday' },
                  close: { type: 'string', description: 'Closing time on Tuesday' },
                },
              },
              wednesday: {
                type: 'object',
                properties: {
                  open: { type: 'string', description: 'Opening time on Wednesday' },
                  close: { type: 'string', description: 'Closing time on Wednesday' },
                },
              },
              thursday: {
                type: 'object',
                properties: {
                  open: { type: 'string', description: 'Opening time on Thursday' },
                  close: { type: 'string', description: 'Closing time on Thursday' },
                },
              },
              friday: {
                type: 'object',
                properties: {
                  open: { type: 'string', description: 'Opening time on Friday' },
                  close: { type: 'string', description: 'Closing time on Friday' },
                },
              },
              saturday: {
                type: 'object',
                properties: {
                  open: { type: 'string', description: 'Opening time on Saturday' },
                  close: { type: 'string', description: 'Closing time on Saturday' },
                },
              },
              sunday: {
                type: 'object',
                properties: {
                  open: { type: 'string', description: 'Opening time on Sunday' },
                  close: { type: 'string', description: 'Closing time on Sunday' },
                },
              },
            },
          },
          type: {
            type: 'string',
            description: 'Type of cuisine or restaurant',
          },
          rating: {
            type: 'number',
            minimum: 0,
            maximum: 5,
            description: 'Average rating of the restaurant',
          },
          reviews: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: {
                  type: 'string',
                  description: 'ID of the user who wrote the review',
                },
                rating: {
                  type: 'number',
                  minimum: 0,
                  maximum: 5,
                  description: 'Rating given by the user',
                },
                comment: {
                  type: 'string',
                  description: 'Review comment',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Date and time when the review was created',
                },
              },
            },
            description: 'List of reviews for the restaurant',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'User ID',
          },
          username: {
            type: 'string',
            description: 'Unique username for the user',
          },
          email: {
            type: 'string',
            description: 'Unique email address of the user',
          },
          password: {
            type: 'string',
            description: 'Hashed password of the user',
          },
          followers: {
            type: 'array',
            items: {
              type: 'string',
              description: 'User ID of the follower',
            },
            description: 'List of user IDs who follow this user',
          },
          following: {
            type: 'array',
            items: {
              type: 'string',
              description: 'User ID of the user being followed',
            },
            description: 'List of user IDs this user is following',
          },
          isPrivate: {
            type: 'boolean',
            description: 'Indicates if the user profile is private',
          },
          pendingRequests: {
            type: 'array',
            items: {
              type: 'string',
              description: 'User ID of the user who sent a follow request',
            },
            description: 'List of user IDs who have sent follow requests',
          },
          favorites: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Restaurant ID of the user\'s favorite restaurants',
            },
            description: 'List of IDs of favorite restaurants',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date and time when the user was created',
          },
        },
      },
    },
  },
  
  servers: [
    {
      url: 'http://localhost:3001', // The URL of your API
      description: 'Local server',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./controllers/*.js'], // Path to the API routes
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;