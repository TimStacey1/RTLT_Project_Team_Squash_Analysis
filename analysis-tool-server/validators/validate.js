const validateSchema = (schema, data) => {
  return new Promise((resolve, reject) => {
    const result = schema.validate(data);
    if (result.error) {
      const errors = result.error.details.map(err => (
        {
          message: result.error.name + ': ' + err.message,
          label: err.context.label,
          type: err.type,
          value: err.context.value
        }
      ));
      reject(errors);
    }
    resolve();
  });
};

module.exports = {
  body: (schema) => (req) => validateSchema(schema, req.body),
  params: (schema) => (req) => validateSchema(schema, req.params)
};
