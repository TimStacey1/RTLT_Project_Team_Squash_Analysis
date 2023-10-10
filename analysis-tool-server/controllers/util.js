const fs = require("fs");

const handle = (promise) => {
  return promise
    .then(result => ([result, undefined]))
    .catch(error => Promise.resolve([undefined, error]));
}

const transformMatches = (matches) => {
  return matches.map(match => {
    return {
      id: match._id,
      title: match.title,
      players: {
        player1: [match.players.player1.firstName, match.players.player1.lastName].join(' '),
        player2: [match.players.player2.firstName, match.players.player2.lastName].join(' '),
      },
      description: match.description,
      duration: match.duration, 
      annotations: match.annotations
    };
  });
};

const transformAnnotations = (annotations) => {
  return annotations.map(item => {
    return {
      id: item._id,
      timestamp: item.timestamp,
      playerNumber: item.playerNumber,
      components: item.components
    };
  });
};

const handleFileUpload = (_file, path) => {
  return handle(
    new Promise((resolve, reject) => {
      _file.mv(path, function (err) {
        if (err) reject(new Error('Failed to upload file.'));
        else resolve('File successfully uploaded.');
      })
    })
  );
};

const handleFileRemoval = (path) => {
  return handle(
    new Promise((resolve, reject) => {
      fs.unlink(path, function (err) {
        if (err) reject(new Error('Failed to remove file.'));
        else resolve('File successfully removed.');
      })
    })
  );
};

const getVideoFileFormat = (mimetype) => {
  return mimetype.slice(-3, mimetype.length)
}

module.exports = {
  handle,
  transformMatches,
  transformAnnotations,
  handleFileUpload,
  handleFileRemoval,
  getVideoFileFormat,
};
