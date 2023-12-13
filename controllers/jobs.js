const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const GetAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(200).json({ jobs, count: jobs.length })
}

const GetJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOne({ _id: jobId, createdBy: userId })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  return res.status(StatusCodes.OK).json({ job })
}

const CreateJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json(job)
}

const UpdateJob = async (req, res) => {
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

  return res.status(StatusCodes.OK).json({ job })
}

const DeleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  return res.status(StatusCodes.OK).json({ msg: 'Delete successfully' })
}

module.exports = {
  GetAllJobs,
  GetJob,
  CreateJob,
  UpdateJob,
  DeleteJob,
}
