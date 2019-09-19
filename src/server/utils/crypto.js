const bcrypt = require('bcrypt');

const saltRounds = 10;

class CryptoService {
  static encrypt(plaintextPassword) {
    return bcrypt.hash(plaintextPassword, saltRounds);
  }

  static compare(plaintextPassword, hashedPassword) {
    return bcrypt.compare(plaintextPassword, hashedPassword);
  }
}

export default CryptoService;
