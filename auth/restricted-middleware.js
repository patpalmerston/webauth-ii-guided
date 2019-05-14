// const bcrypt = require('bcryptjs');

// const Users = require('../users/users-model.js');

// do not need bcrypt or users anymore

module.exports = (req, res, next) => {
    // if the client is logged in, res.seesion.user will be set

    if(req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({ message: "Nope, not allowed" })
    }
};
