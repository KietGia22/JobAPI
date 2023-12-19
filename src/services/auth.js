const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const UserLogin = async (data) => {
  try {
    const { email, password } = data

    if (!email || !password)
      throw new BadRequestError('Please provide email or password')

    const user = await User.findOne({ email })

    if (!user) throw new UnauthenticatedError('Invalid Credentials')

    const isPassword = await user.comparePassword(password)
    if (!isPassword) throw new UnauthenticatedError('Invalid Credentials')

    const token = user.createJWT()

    return { user, token }
  } catch (err) {
    throw err
  }
}

const UpdateUser = async (req) => {
  try {
    const {
      body: { email, name, lastName, location },
      user: { userId },
    } = req
    if (!email || !name || !lastName || !location) {
      throw new BadRequestError('Please provide all values')
    }
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { email, name, lastName, location },
      { new: true }
    )
    const token = user.createJWT()
    return { user, token }
  } catch (err) {
    throw err
  }
}

module.exports = { UserLogin, UpdateUser }
