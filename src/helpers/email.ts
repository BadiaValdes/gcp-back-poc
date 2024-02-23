import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  //service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'jsantana@soaint.com', //correo
    clientId: '1063658746297-2pfqjc4e2gkq2ael5hqn9m4971t4tbco.apps.googleusercontent.com', //id de cliente
    clientSecret: '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', //cliente secreto
    refreshToken:
      '1//04NjNPLdVC8HlCgYIARAAGAQSNwF-L9Ir14ve62OjAWunBBz0dOwfipGMJqcs9ALLCrWtz1t-PTrEvMAGkJfPH71F9AwMEvKrggI', //refresh token
  },
  port: 465,
  secure: true,
  host: 'smtp.gmail.com',
})
