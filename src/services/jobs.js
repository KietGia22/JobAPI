const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const GetAllJob = async (req) => {
  try {
    const { search, status, jobType, sort } = req.query

    const queryObject = {
      createdBy: req.user.userId,
    }

    if (search) {
      queryObject.position = { $regex: search, $options: 'i' }
    }
    if (status && status !== 'all') {
      queryObject.status = status
    }
    if (jobType && jobType !== 'all') {
      queryObject.jobType = jobType
    }
    let result = Job.find(queryObject)

    if (sort === 'latest') {
      result = result.sort('-createdAt')
    }
    if (sort === 'oldest') {
      result = result.sort('createdAt')
    }
    if (sort === 'a-z') {
      result = result.sort('position')
    }
    if (sort === 'z-a') {
      result = result.sort('-position')
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    console.log(result)

    const jobs = await result

    const totalJobs = await Job.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalJobs / limit)

    return { jobs, totalJobs, numOfPages }
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
