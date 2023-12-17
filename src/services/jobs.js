const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const GetAllJob = async (req) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort(
      'createdAt'
    )
    if (!jobs) throw new NotFoundError(`Not found`)
    return jobs
  } catch (err) {
    console.log(err)
    throw err
  }
}

const GetJob = async (req) => {
  try {
    const {
      user: { userId },
      params: { id: jobId },
    } = req

    const job = await Job.findOne({ _id: jobId, createdBy: userId })

    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`)
    }

    return job
  } catch (err) {
    throw err
  }
}

const CreateJob = async (data) => {
  try {
    const job = await Job.create(data)
    return job
  } catch (err) {
    throw err
  }
}

const UpdateJob = async (req) => {
  try {
    const {
      body: { company, position },
      user: { userId },
      params: { id: jobId },
    } = req

    if (company === '' || position === '')
      throw new BadRequestError('Company or Position fields cannot be empty')

    const job = await Job.findByIdAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`)
    }

    return job
  } catch (err) {
    throw err
  }
}

const DeleteJob = async (req) => {
  try {
    const {
      user: { userId },
      params: { id: jobId },
    } = req

    const job = await Job.findByIdAndDelete({
      _id: jobId,
      createdBy: userId,
    })
    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`)
    }
    return null
  } catch (err) {
    throw err
  }
}

module.exports = { GetAllJob, GetJob, CreateJob, UpdateJob, DeleteJob }
