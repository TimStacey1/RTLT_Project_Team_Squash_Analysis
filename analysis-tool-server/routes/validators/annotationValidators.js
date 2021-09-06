const { objectIdSchema } = require('./utility.schemas');
const { createAnnotationSchema, updateAnnotationSchema } = require('./annotation.schemas');

function validateAnnotationId(req, res, next) {
  const result = objectIdSchema.validate({ _id: req.params.annotation_id });

  if (result.error) return res.status(400).json(result.error.message);

  next();
};

function validateNewAnnotation(req, res, next) {
  const result = createAnnotationSchema.validate(req.body);

  if (result.error) return res.status(400).json(result.error.message);

  next();
};

function validateUpdatedAnnotation(req, res, next) {
  const result = updateAnnotationSchema.validate(req.body);

  if (result.error) return res.status(400).json(result.error.message);

  next();
};

module.exports = {
  validateAnnotationId,
  validateNewAnnotation,
  validateUpdatedAnnotation
};
