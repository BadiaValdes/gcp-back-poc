import { IUserService } from './userService.interface'
import { IUser } from '../interfaces/user.interface'
import { getUsers } from '../querys/getUser.query'
import { deleteUser } from '../querys/deleteUser.query'
import { createUser } from '../querys/createUser.query'
import { updateUser } from '../querys/updateUser.query'
import { getFile, getFiles } from '../querys/uploadFile.query'

class UserService implements IUserService {
  // eslint-disable-line
  res: any

  async getUsers(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      getUsers()
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async createUsers(req: IUser): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      createUser(req)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async updateUsers(req: IUser, id: string): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      updateUser(req, id)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async deleteUsers(id: string): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      deleteUser(id)
        .then((deleteUser: any) => {
          resolve(deleteUser)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }

  async getImage(name: string): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      getFile(name)
        .then((files: any) => {
          resolve(files)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default new UserService()
