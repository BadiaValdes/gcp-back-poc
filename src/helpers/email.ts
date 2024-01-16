import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  //service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: '', //correo
    clientId: '', //id de cliente
    clientSecret: '', //cliente secreto
    refreshToken: '', //refresh token
  },
  port: 465,
  secure: true,
  host: 'smtp.gmail.com',
})
