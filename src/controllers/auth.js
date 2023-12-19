const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const AuthService = require('../services/auth')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  try {
    const { user, token } = await AuthService.UserLogin(req.body)
    console.log(user, token)
    res
      .status(StatusCodes.OK)
      .json({ user: { name: user.name, email: user.email }, token })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  register,
  login,
}
