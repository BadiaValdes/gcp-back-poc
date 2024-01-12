import { IUserService } from './userService.interface'
import { logger } from '../../../helpers/logger'
import { createDatabase } from '../../../helpers/connection-bd'
import { IUser } from '../interfaces/user.interface'

class UserService implements IUserService {
  // eslint-disable-line

  async getRandomTest(): Promise<any> {
    try {
      logger.info('success')
      return 'it works'
    } catch (error) {
      logger.error(error)
      return error
    }
  }

  async getUsers(): Promise<any> {
    const pool = createDatabase()
    const query = 'Select * from testtabla'
    pool.query(query, [], (err, result) => {
      if (err) throw err
        return 'asd';
    })
  }

  async createUsers (req: IUser): Promise<any> {
    const user = {
      name: req.name,
      email: req.email,
      dni: req.dni,
      photo: req.photo
    }
    const pool = createDatabase()
    const query = 'INSERT INTO authors SET ?'
    pool.query(query, user, (err, result) => {
      if (err) throw err
      return result;
    })
  }
}

export default new UserService()
