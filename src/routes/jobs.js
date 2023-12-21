const express = require('express')
const router = express.Router()
const testUser = require('../middleware/testUser')

const {
  GetAllJobs,
  GetJob,
  CreateJob,
  UpdateJob,
  DeleteJob,
  showStats,
} = require('../controllers/jobs')
const { route } = require('./auth')

router.route('/').post(testUser, CreateJob).get(GetAllJobs)
router.route('/stats').get(showStats)
router
  .route('/:id')
  .get(GetJob)
  .patch(testUser, UpdateJob)
  .delete(testUser, DeleteJob)

module.exports = router
