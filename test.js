const crypto = require('crypto');

const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTc2MTU3NDkyNywiZXhwIjoxNzYyMTc5NzI3fQ.Hw6SLfU5M02HeLwUzCicnxrn_6IGYQMwsVBeKrOqua8';

const hashedToken = crypto
  .createHash('sha256')
  .update(refreshToken)
  .digest('hex');

console.log(hashedToken);
