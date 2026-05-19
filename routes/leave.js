const express = require('express');
const router = express.Router();
const {
  createLeave,
  getAllLeaves,
  getMyLeaves,
  getCalendarLeaves,
  updateLeave,
  updateLeaveStatus,
  deleteLeave,
} = require('../controllers/leaveController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createLeave);
router.get('/my', authMiddleware, getMyLeaves);
router.get('/calendar', authMiddleware, getCalendarLeaves);
router.get('/', authMiddleware, getAllLeaves);
router.put('/:id', authMiddleware, updateLeave);
router.put('/:id/status', authMiddleware, updateLeaveStatus);
router.delete('/:id', authMiddleware, deleteLeave);

module.exports = router;
