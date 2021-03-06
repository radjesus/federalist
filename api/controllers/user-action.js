const { showActions } = require('../authorizers/site');
const { UserAction } = require('../models');
const userActionSerializer = require('../serializers/user-action');

const validId = (maybeId) => {
  const idToNumber = Number(maybeId);

  return Promise.resolve(idToNumber)
  .then((id) => {
    if (isNaN(id)) {
      throw 404;
    }

    return id;
  });
};

module.exports = {
  find(req, res) {
    validId(req.params.site_id)
    .then(id => showActions(req.user, { id }))
    .then(siteId =>
      UserAction.findAllBySite(siteId)
    )
    .then(userActions => userActions || [])
    .then(userActionSerializer.serialize)
    .then(serialized => res.json(serialized))
    .catch(res.error);
  },
};
