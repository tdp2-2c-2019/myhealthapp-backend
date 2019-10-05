import { db } from '../db';

class LanguageService {
  static getLanguages() {
    return new Promise((resolve, reject) => {
      db.select().from('languages')
        .then(rows => resolve(rows))
        .catch(() => reject(new Error('Ocurrió un error al obtener los idiomas')));
    });
  }
}

export default LanguageService;
