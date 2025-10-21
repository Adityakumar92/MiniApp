const express = require('express');
const router = express.Router();

const Auth = require('./Auth.route');
const Question = require('./Qustion.route');
const Answer = require('./Answer.route');
const Insight = require('./Insight.route'); 

router.use('/auth', Auth);
router.use('/questions', Question);
router.use('/answers', Answer);
router.use('/insights', Insight);

module.exports = router;

