import { query } from '../db';

class UserService {
  static async createUser(dni, password, mail) {
    query('select * from users where dni = $1', [dni], (err, result) => {
      if (err) {
        throw err;
      }
      if (result.rowCount === 1) {
        query('update users set password = $1, mail = $2 where dni = $3', [password, mail, dni], (err) => {
          if (err) {
            throw err;
          }
        });
      }
    });
  }
}

export default UserService;
