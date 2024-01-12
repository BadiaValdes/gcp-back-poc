import { bucket } from '../../../helpers/upload-file'

let res: any

export const uploadFile = async (photo: any) => {
  return new Promise<void>((resolve, reject) => {
    const blob = bucket.file(photo.originalname)
    const blobStream = blob.createWriteStream()
    blobStream.on('error', () => {
      reject((res = { status: 400, message: 'Error while uploading file' }))
    })
    blobStream.end(photo.photo.buffer)
    resolve()
  })
}

export const getFiles = async () => {
  try {
    const [files] = await bucket.getFiles()
    return {
      status: 200,
      files,
    }
  } catch (err) {
    return {
      status: 500,
      message: err,
    }
  }
}

export const getFile = async (name: string): Promise<any> => {
  const [files] = await bucket.getFiles()
  const result = files.filter((file: any) => file.metadata.name === name)[0]
  if (!result) {
    return {
      status: 400,
      message: 'File not found',
    }
  }
  return {
    status: 200,
    image: result.metadata,
  }
}
