const { CREATED, OK } = require('../core/success.response');
const ScoreService = require('../services/score.service')

class ScoreController {
    //handle get all students
    gradeScore = async (req, res, next) => {
        new CREATED({
            message: "Grade student's score successfully",
            metadata: await ScoreService.gradeScore(req.params.studentID, req.body),
            options: {
                limit: 10,
            }
        }).send(res)
    }

    //handle get student by ID
    getStudentScoreByID = async (req, res, next) => {
        new CREATED({
            message: "GET Student Score By ID OK",
            metadata: await ScoreService.getStudentScoreByID(req.params, req.body),
            options: {
                limit: 10,
            }
        }).send(res)
    }

    //handle get student by ID
    getStudentScore = async (req, res, next) => {
        new CREATED({
            message: "GET Student Score By Course OK",
            metadata: await ScoreService.getStudentScore(req.params.studentID, req.query),
            options: {
                limit: 10,
            }
        }).send(res)
    }

    getScore = async (req, res, next) => {
        new OK({
            message: "GET Student Score  OK",
            metadata: await ScoreService.getScore(req.params.studentID, req.query),
            options: {
                limit: 10,
            }
        }).send(res)
    }
}
module.exports = new ScoreController();