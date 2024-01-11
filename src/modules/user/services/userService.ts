import { IUserService } from './userService.interface'
import { logger } from '../../../helpers/logger'
import { createDatabase } from '../../../helpers/connection-bd'

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
}

export default new UserService()
