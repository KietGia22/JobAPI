const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const jobService = require('../services/jobs')

const GetAllJobs = async (req, res) => {
  try {
    const { jobs, totalJobs, numOfPages } = await jobService.GetAllJob(req)
    res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
  } catch (err) {
    console.log(err)
  }
}

const GetJob = async (req, res) => {
  try {
    const job = await jobService.GetJob(req)
    return res.status(StatusCodes.OK).json(job)
  } catch (err) {
    console.log(err)
  }
}

const CreateJob = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId
    const job = await jobService.CreateJob(req.body)
    res.status(StatusCodes.CREATED).json(job)
  } catch (err) {
    console.log(err)
  }
}

const UpdateJob = async (req, res) => {
  try {
    const job = await jobService.UpdateJob(req)
    return res.status(StatusCodes.OK).json({ job })
  } catch (err) {
    console.log(err)
  }
}

const DeleteJob = async (req, res) => {
  try {
    const job = await jobService.DeleteJob(req)
    return res.status(StatusCodes.OK).json({ msg: 'Delete successfully' })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  GetAllJobs,
  GetJob,
  CreateJob,
  UpdateJob,
  DeleteJob,
}
