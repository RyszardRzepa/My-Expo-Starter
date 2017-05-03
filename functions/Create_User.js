const admin = require('firebase-admin');

module.exports = function (req, res) {
  // verify user provided the phone
  if (!req.body.phone) {
    res.status(422).send({ error: "Bad Input" })
  }

  // format phone number to remove dashes and parens
  // if req.body.phone is a number, we will convert it to the string and replace() dashes andparams
  const phone = String(req.body.phone).replace(/[^\d]/g, "");

  // Create new user account using phone numebr\
  admin.auth().createUser({ uid: phone })
  .then(user => res.send(user))
  .catch(err => res.status(422).send({ error: err }));
 // +4759444967
}