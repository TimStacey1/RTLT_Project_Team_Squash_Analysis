const Joi = require('joi');

const { annotationComponents } = require('../../models/Annotation');

const annotationSchema = Joi.object({
  components: Joi.valid(...annotationComponents).error(new Error('Invalid annotation component.')).required(),
  timestamp: Joi.date().timestamp('javascript').required(),
  playerNumber: Joi.number().integer().min(1).max(2).optional()
}).min(1);

const createAnnotationSchema = annotationSchema;

const updateAnnotationSchema = annotationSchema.options({ presence: 'optional' }).empty('', null).default(undefined);

module.exports = {
  annotationSchema,
  createAnnotationSchema,
  updateAnnotationSchema
};
