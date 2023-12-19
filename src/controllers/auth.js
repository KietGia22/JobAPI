const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const AuthService = require('../services/auth')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  })
}

const login = async (req, res) => {
  try {
    const { user, token } = await AuthService.UserLogin(req.body)
    res.status(StatusCodes.OK).json({
      user: {
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
        token,
      },
    })
  } catch (err) {
    console.log(err)
  }
}

const update = async (req, res) => {
  try {
    const { user, token } = await AuthService.UpdateUser(req)
    res.status(StatusCodes.OK).json({
      user: {
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
        token,
      },
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  register,
  login,
  update,
}
