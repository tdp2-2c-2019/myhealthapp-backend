const bcrypt = require('bcrypt');

const saltRounds = 10;

class CryptoService {
  static encrypt(plaintextPassword) {
    return bcrypt.hash(plaintextPassword, saltRounds).then(hash => hash);
  }

  static compare(plaintextPassword, hashedPassword) {
    return bcrypt.compare(plaintextPassword, hashedPassword).then(res => res);
  }
}

export default CryptoService;
