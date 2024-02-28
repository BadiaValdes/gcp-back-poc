import { createDatabase } from '../../../helpers/connection-bd'

class UserSchema {
  // eslint-disable-line
  async createTableUser (): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      let res: any;
      const pool = createDatabase()
      const query =
        'CREATE TABLE users (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, dni VARCHAR(20) UNIQUE, name VARCHAR(150), email VARCHAR(100), photo VARCHAR(255));'
      pool.query(query, (err, result) => {
        if (err) {
          res = {
            "status": 500,
            "mesage": err.message,
          };
        }
        else {
          res = {
            "status": 200,
            "mesage": "created table users",
          };
        }
        resolve(res)
      })
    })
  }
}

export default new UserSchema()
