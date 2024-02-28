import { createDatabase } from '../../../helpers/connection-bd'
import { IUser } from '../interfaces/user.interface'
import { uploadFile } from './uploadFile.query'

const pool = createDatabase()
let res: any

export const createUser = async (user: IUser) => {
  return new Promise<void>((resolve, reject) => {
    const users: IUser = {
      name: user.name,
      email: user.email,
      dni: user.dni,
      photo: user.photo.originalname,
    }

    uploadFile(user.photo)
      .then(() => {
        const query = 'INSERT INTO users SET ?'
        pool.query(query, users, (err, result) => {
          if (err) {
            reject(
              (res = {
                status: 400,
                message: err.message,
              })
            )
          } else {
            res = {
              status: 200,
              message: 'user created',
              object: { ...users, id: result.insertId },
            }
          }
          resolve(res)
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}
