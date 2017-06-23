const twilio = require('twilio');

const accountSid = 'ACcd5b8aa10435c510509b299cbcf1b0d38';
const authToken = '4b83fd4474fss52ca6a2fa9a6a6cc61ec9';

module.exports = new twilio.Twilio(accountSid, authToken);
