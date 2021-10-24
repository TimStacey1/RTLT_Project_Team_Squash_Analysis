const handle = (...callbacks) => {
  return (req, res, next) => {
    Promise.all(callbacks.map(callback => callback(req)))
      .then(res => next())
      .catch(errors => {
        console.log(errors);
        res.status(400).json(errors);
      });
  };
};

module.exports = handle;
