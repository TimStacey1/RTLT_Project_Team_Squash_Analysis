const Joi = require('joi');
const joi = require('joi-oid');
const { annotationComponents } = require('../models/Annotation');

const annotationSchema = Joi.object({
  components: Joi.valid(...annotationComponents).error(new Error('Invalid annotation component.')),
  timestamp: Joi.date().timestamp('javascript'),
  playerNumber: Joi.number().integer().min(1).max(2).optional()
}).options({ stripUnknown: true, abortEarly: false }).min(1);

const annotationIdSchema = Joi.object({ annotation_id: joi.objectId().required() }).options({ stripUnknown: true });
const createAnnotationSchema = annotationSchema.options({ presence: 'required' });
const updateAnnotationSchema = annotationSchema.options({ presence: 'optional' }).empty('', null).default(undefined);

module.exports = {
  annotationSchema,
  createAnnotationSchema,
  updateAnnotationSchema,
  annotationIdSchema
};
