const admin = require('firebase-admin');

module.exports = function (req, res) {
  if (!req.body.phone || !req.body.code) {
    res.status(422).send({ error: "code and phone number mus be provided" })
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, "");
  const code = parseInt(req.body.code);

  admin.auth().getUser(phone)
  .then(() => {
    const ref = admin.database().ref('users/' + phone);
    ref.on('value', snapshot => {
      ref.off();
      const user = snapshot.val();

      if (user.code !== code || !user.codeValide) {
        return res.status(422).send({ error: "code not valide " })
      }

      ref.update({ codeValide: false });
      admin.auth().createCustomToken(phone)
      .then((token) => res.send({ token: token }))
    });
  })
  .catch(err => res.status(422).send({ error: "error" }))
}