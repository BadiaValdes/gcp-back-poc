import { createDatabase } from '../../../helpers/connection-bd'

const pool = createDatabase()
let res: any

export const getUserByIdByDelete = async (id: string) => {
  return new Promise<void>((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
      if (err) {
        reject({
          status: 500,
          message: err.message,
        })
      }
      resolve(result.length)
    })
  })
}

export const getUserById = async (id: string) => {
  return new Promise<void>((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
      if (err) {
        reject({
          status: 500,
          message: err.message,
        })
      }
      if (result.length === 0) {
        reject(
          (res = {
            status: 400,
            message: 'user not found',
          })
        )
      }
      resolve(result[0])
    })
  })
}

export const getUsers = async () => {
  return new Promise<void>((resolve, reject) => {
    pool.query('Select * from users', [], (err, result) => {
      if (err) {
        reject(
          (res = {
            status: 500,
            message: err.message,
          })
        )
      }
      res = {
        status: 200,
        message: 'users',
        object: result,
      }
      resolve(res)
    })
  })
}
