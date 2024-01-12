import { createDatabase } from '../../../helpers/connection-bd'
import { getUserByIdByDelete } from './getUser.query'

const pool = createDatabase()
let res: any

export const deleteUser = async (id: string) => {
  return new Promise<void>((resolve, reject) => {
    getUserByIdByDelete(id).then((getUser: any) => {
      if (getUser === 0) {
        reject(
          (res = {
            status: 400,
            message: 'user not found',
          })
        )
      }
      pool.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
          reject(
            (res = {
              status: 500,
              message: err.message,
            })
          )
        } else {
          res = {
            status: 200,
            message: 'user deleted',
          }
        }
        resolve(res)
      })
    })
  })
}
