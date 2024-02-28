import { createDatabase } from '../../../helpers/connection-bd'
import { IUser } from '../interfaces/user.interface'
import { getUserByIdByDelete } from './getUser.query'
import { getFiles, uploadFile } from './uploadFile.query'

const pool = createDatabase()
let res: any

export const updateUser = async (user: IUser, id: string) => {
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
      let users: IUser = {
        name: user.name,
        email: user.email,
        dni: user.dni,
      }
      if (user.photo) {
        users.photo = user.photo.originalname
        uploadFile(user.photo)
          .then(() => {
            updateUserTemp(users, id)
              .then((result) => {
                resolve(result)
              })
              .catch((err) => {
                reject(err)
              })
          })
          .catch((err) => {
            reject(err)
          })
      } else {
        getFiles().then((getFiles: any) => {
          getFiles.map((file: any) => {
            users.photo = file.name
            updateUserTemp(users, id)
              .then((result) => {
                resolve(result)
              })
              .catch((err) => {
                reject(err)
              })
          })
        })
      }
    })
  })
}

const updateUserTemp = async (user: IUser, id: string) => {
  return new Promise<void>((resolve, reject) => {
    const query = 'UPDATE users SET ? WHERE id = ?'
    pool.query(query, [user, id], (err, result) => {
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
          message: 'user modified',
          object: { ...user, id: id },
        }
      }
      resolve(res)
    })
  })
}
