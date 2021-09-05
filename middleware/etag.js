const crypto = require('crypto');

const computeHash = (str) =>
  crypto
    .createHmac('sha256', 'mysupersecretkeyidontcareaboutit')
    .update(str)
    .digest('hex');

const setEtag = (req, res, next) => {
  if (req.query.id) {
    const hashEtag = computeHash(req.query.id);
    res.setHeader('Etag', hashEtag);
    console.log(hashEtag);
  }
  next();
};

module.exports = { setEtag };
