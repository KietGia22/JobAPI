const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const jobService = require('../services/jobs')
const mongoose = require('mongoose')
const moment = require('moment')

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

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    console.log(acc)
    return acc
  }, {})

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  }

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ])

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y')
      return { date, count }
    })
    .reverse()

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

module.exports = {
  GetAllJobs,
  GetJob,
  CreateJob,
  UpdateJob,
  DeleteJob,
  showStats,
}
