const express = require('express')
const router = express.Router()

const {
  GetAllJobs,
  GetJob,
  CreateJob,
  UpdateJob,
  DeleteJob,
} = require('../controllers/jobs')
const { route } = require('./auth')

router.route('/').post(CreateJob).get(GetAllJobs)
router.route('/:id').get(GetJob).patch(UpdateJob).delete(DeleteJob)

module.exports = router
