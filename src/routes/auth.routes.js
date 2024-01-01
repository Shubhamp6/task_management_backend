const express = require('express')
const ResetTokenController = require('../contoller/AuthController/ResetToken.controller')

const SignInController = require('../contoller/AuthController/Signin.controller.js')
const tokenVerifier = require('../middleware/tokenVerifiers.middleware')
const ResetPasswordController = require('../contoller/AuthController/ResetPassword.controller')

const authRoutes = express()

authRoutes.post('/login', SignInController)
authRoutes.post('/reset-token', ResetTokenController)
authRoutes.post('/reset-pass', tokenVerifier, ResetPasswordController)

module.exports = authRoutes
