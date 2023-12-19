const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createJWT = () => {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

const comparePassword = async (isPassword) => {
  const isMatch = await bcrypt.compare(isPassword, this.password)
  return isMatch
}

const UserLogin = async (data) => {
  try {
    const { email, password } = data

    if (!email || !password)
      throw new BadRequestError('Please provide email or password')

    const user = await User.findOne({ email })

    if (!user) throw new UnauthenticatedError('Invalid Credentials')

    const isPassword = await user.comparePassword(password)
    if (!isPassword) throw new UnauthenticatedError('Invalid Credentials')

    const token = createJWT()

    return { user, token }
  } catch (err) {
    throw err
  }
}

const UserRegister = async (data) => {}

module.exports = { UserLogin }
