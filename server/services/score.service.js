const Account = require('../models/account.model');
const Subject = require('../models/subject.model');
const Enrollment = require('../models/enrollment.model');
const {sql, Op} = require('@sequelize/core');
const Student = require('../models/student.model');
const sequelize = require('../configs/sequelize');
const Course = require('../models/course.model');
const Teacher = require('../models/teacher.model');
const Score = require('../models/score.model');
const LearningOutcome = require('../models/learningOutcome.model');
const LearningOutcomeScore = require('../models/learningOutcomeScore.model');
const Modification = require('../models/modification.model');
const SubjectLearningOutcome = require('../models/subjectLearningOutcome.model');
const axios = require('axios');
const {QueryTypes, where} = require('sequelize');

class ScoreService {
    static gradeScore = async (studentID, {
        courseID,
        teacherID,
        score,
    }) => {
        // Input Validation
        if (!courseID || !teacherID || !studentID) {
            throw new Error('Missing required fields: courseID, teacherID, or studentID');
        }

        if (!Array.isArray(score) || score.length > 3 || score.length < 1) {
            throw new Error('Score must be an array with 1-3 elements');
        }

        const validScoreTypes = ['progress', 'midterm', 'final'];
        score.forEach((s, index) => {
            if (!s.scoreType || typeof s.score !== 'number') {
                throw new Error(`Invalid score data at index ${index}`);
            }
            if (s.score < 0 || s.score > 10) {
                throw new Error(`Score must be between 0 and 10 at index ${index}`);
            }
            if (!validScoreTypes.includes(s.scoreType)) {
                throw new Error(`Invalid score type at index ${index}. Must be one of: ${validScoreTypes.join(', ')}`);
            }
        });

        // Entity validation
        const [student, course, teacher] = await Promise.all([
            Student.findByPk(studentID),
            Course.findByPk(courseID),
            Teacher.findByPk(teacherID)
        ]);

        if (!student || student.status !== 'active') {
            throw new Error('Student not found or inactive');
        }

        if (!course || !course.active) {
            throw new Error('Course not found or inactive');
        }

        if (!teacher || teacher.status !== 'active') {
            throw new Error('Teacher not found or inactive');
        }

        if (course.teacherID !== teacherID) {
            throw new Error('Teacher is not assigned to this course');
        }

        const subject = await Subject.findByPk(course.subjectID);
        if (!subject || !subject.active) {
            throw new Error('Subject not found or inactive');
        }

        const enrollment = await Enrollment.findOne({
            where: {
                studentID,
                courseID,
                status: 'enrolled',
            }
        });
        if (!enrollment) {
            throw new Error('Enrollment not found or student has completed the course');
        }

        // Update to Score Model
        try {
            for (let i = 0; i < score.length; i++) {
                const currentScore = await Score.findOne({
                    where: {
                        enrollmentID: enrollment.id,
                        scoreType: score[i].scoreType,
                    },
                });
                if (currentScore) {
                    await Score.update({
                        score: score[i].score,
                    }, {
                        where: {
                            enrollmentID: enrollment.id,
                            scoreType: score[i].scoreType,
                        },
                    });
                } else {
                    await Score.create({
                        score: score[i].score,
                        scoreType: score[i].scoreType,
                        enrollmentID: enrollment.id,
                        teacherID,
                    });
                }
            }

            // Calculate final score            
            const factors = await Modification.findAll({
                where: {
                    key: {
                        [Op.in]: ['progress', 'midterm', 'final']
                    }
                }
            });

            if (factors.length !== 3) {
                throw new Error('Factors not found');
            }

            const existingScores = await Score.findAll({
                where: {
                    enrollmentID: enrollment.id,
                    scoreType: {
                        [Op.in]: ['progress', 'midterm', 'final']
                    }
                }
            });

            if (existingScores.length === 3) {
                await enrollment.update({
                    completed: true,
                });

                await student.update({
                    credit: student.credit + subject.credit,
                });

                const finalScore = existingScores.reduce((acc, s) => {
                    const factor = factors.find(f => f.key === s.scoreType);
                    return acc + s.score * factor.value;
                }, 0);

                await enrollment.update({
                    finalGrade: finalScore,
                });

                // Calculate learning outcome score
                // const learningOutcomeObject = await SubjectLearningOutcome.findAll({
                //     where: {
                //         subjectID: subject.id,
                //     },
                //     attributes: ['learningOutcomeID'],
                // }
                // );
                // if (learningOutcomeObject.length === 0) {
                //     console.log('No learning outcome found');
                // } else {
                //     const learningOutcomeScoreFactor = await Modification.findAll({
                //         where: {
                //             key: {
                //                 [Op.in]: ['major', 'core']
                //             }

                //         }
                //     });

                //     if (learningOutcomeScoreFactor.length !== 2) {
                //         throw new Error('Learning outcome score factor not found');
                //     }

                //     const learningOutcomeIDs = learningOutcomeObject.map(learningOutcome => learningOutcome.learningOutcomeID);

                //     for (let i = 0; i < learningOutcomeIDs.length; i++) {
                //         const learningOutcome = await LearningOutcome.findByPk(learningOutcomeIDs[i]);
                //         if (!learningOutcome) {
                //             throw new Error('Learning outcome not found');
                //         }
                //         // Output: LearningOutcome object

                //         const learningOutcomeScores = await LearningOutcomeScore.findOne({
                //             where: {
                //                 learningOutcomeID: learningOutcome.id,
                //                 studentID,
                //             }
                //         });
                //         // Output: LearningOutcomeScore object

                //         if (!learningOutcomeScores) {
                //             // Create new learning outcome score
                //             const newLearningOutcomeScore = await LearningOutcomeScore.create({
                //                 learningOutcomeID: learningOutcome.id,
                //                 studentID,
                //                 score: finalScore,
                //             });
                //             if (!newLearningOutcomeScore) {
                //                 throw new Error('Error creating learning outcome score');
                //             }
                //         } else {
                //             // Update existing learning outcome score
                //             // lay danh sach enrollemnt completed cua student (enrollment)
                //             const result = await sequelize.query(
                //                 `SELECT enrollment.finalGrade as score, learningoutcomescore.learningoutcomeID, course.id as courseID, subject.type as subjectType, modification.value as factor
                //                  FROM enrollment
                //                  INNER JOIN course ON enrollment.courseID = course.id
                //                  INNER JOIN subject ON course.subjectID = subject.id
                //                  INNER JOIN subjectlearningoutcome ON subject.id = subjectlearningoutcome.subjectID
                //                  INNER JOIN learningoutcome ON subjectlearningoutcome.learningoutcomeID = learningoutcome.id
                //                  INNER JOIN learningoutcomescore ON learningoutcome.id = learningoutcomescore.learningoutcomeID
                //                  INNER JOIN modification ON modification.key = subject.type
                //                  WHERE enrollment.studentID = ${studentID} AND learningoutcome.id = ${learningOutcome.id} AND enrollment.completed = true          
                //                  ;`,
                //                 { type: QueryTypes.SELECT } // This will return an array of results
                //             );
                //             console.log(result);
                //             if (result.length === 0) {
                //                 throw new Error('No result found');
                //             }
                //             const factorSum = result.reduce((acc, s) => acc + parseFloat(s.factor), 0);
                //             const averageScore = result.reduce((acc, s) => {
                //                 console.log(s.score, s.factor);
                //                 return acc + s.score * parseFloat(s.factor);
                //             }, 0) / factorSum;
                //             console.log(averageScore);
                //             console.log(factorSum);

                //             await LearningOutcomeScore.update({
                //                 score: averageScore,
                //             }, {
                //                 where: {
                //                     learningOutcomeID: learningOutcome.id,
                //                     studentID,
                //                 }
                //             });
                //         }
                //     }

                // }

                if (enrollment.status === 'pass') {
                    const allSubjectLearningOutcomes = await SubjectLearningOutcome.findAll({
                        where: {
                            subjectID: subject.id,
                        },
                        attributes: ['learningOutcomeID'],
                    });

                    if (allSubjectLearningOutcomes.length === 0) {
                        console.log('No learning outcome found');
                    }
                    for (let i = 0; i < allSubjectLearningOutcomes.length; i++) {
                        const learningOutcome = allSubjectLearningOutcomes[i];

                        const learningOutcomeScores = await LearningOutcomeScore.findOne({
                            where: {
                                learningOutcomeID: learningOutcome.learningOutcomeID,
                                studentID,
                            }
                        });

                        const curentLevel = await SubjectLearningOutcome.findOne({
                            where: {
                                subjectID: subject.id,
                                learningOutcomeID: learningOutcome.learningOutcomeID,
                            },
                            attributes: ['level'],
                        });

                        if (!learningOutcomeScores.highestLevel) {
                            await LearningOutcomeScore.update({
                                highestLevel: curentLevel.level,
                            }, {
                                where: {
                                    learningOutcomeID: learningOutcome.learningOutcomeID,
                                    studentID,
                                }
                            });
                        } else {
                            const highestLevel = ScoreService.compareLevel(curentLevel.level, learningOutcomeScores.highestLevel);
                            await LearningOutcomeScore.update({
                                highestLevel,
                            }, {
                                where: {
                                    learningOutcomeID: learningOutcome.learningOutcomeID,
                                    studentID,
                                }
                            });
                        }
                    }
                }
                return "Grade student's score successfully";
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error grading score', error);
        }

    }

    // static getStudentScoreByID = async ({studentID}, {courseID}) => {
    //     if (!studentID) {
    //         throw new Error('Missing student ID');
    //     }
    //     const student = await Student.findByPk(studentID);
    //     if (!student) {
    //         throw new Error('Student not found');
    //     }
    //
    //     // // Build the query conditions
    //     // const whereConditions = {
    //     //     studentID: studentID
    //     // };
    //
    //     // if (courseID) {
    //     //     const course = await Course.findByPk(courseID);
    //     //     if (!course) {
    //     //         throw new Error('Course not found');
    //     //     }
    //     //     whereConditions.courseID = courseID;
    //     // }
    //
    //     let queryCondition = 'where studentID = ?'
    //
    //     if (courseID) {
    //         const enrollments = await Enrollment.findAll({
    //             where: {
    //                 courseID
    //             }
    //         })
    //         queryCondition += ' AND courseID'
    //     }
    //
    //     // Get all enrollments for the student (filtered by courseID if provided)
    //     const scores = await sequelize.query(`
    //         SELECT *
    //         FROM SCORE ${course}
    //     `, {
    //
    //         type: QueryTypes.SELECT
    //     })
    //
    //     return scores;
    //
    //     // if (enrollments.length === 0) {
    //     //     throw new Error('No enrollments found');
    //     // }
    //
    //     // // Get all scores for these enrollments
    //     // const scores = await Score.findAll({
    //     //     where: {
    //     //         enrollmentID: {
    //     //             [Op.in]: enrollments.map(e => e.id)
    //     //         }
    //     //     },
    //     //     attributes: ['enrollmentID', 'scoreType', 'score']
    //     // });
    //
    //     // // Format the response
    //     // const result = enrollments.map(enrollment => ({
    //     //     courseID: enrollment.courseID,
    //     //     teacherID: enrollment.Course.teacherID,
    //     //     scores: scores
    //     //         .filter(s => s.enrollmentID === enrollment.id)
    //     //         .map(s => ({
    //     //             scoreType: s.scoreType,
    //     //             score: s.score
    //     //         }))
    //     // }));
    //
    //     // return courseID ? result[0] : result;
    // }

    static getStudentScore = async (studentID, query) => {
        if (!studentID) {
            throw new Error('Missing student ID');
        }

        const [studentScores] = await sequelize.query(`
            select *
            from enrollment
            where studentID = 1
                ${query.courseID ? `and courseID = ${query.courseID}` : ''}
        `)

        return studentScores;
    }

    static getScore = async (studentID, {subjectID}) => {
        const scores = await Enrollment.findAll({
            where: {
                studentID
            },
            include: [
                {
                    model: Score,
                    attributes: ['scoreType', 'score']
                },
                {
                    model: Course,
                    required: true,
                    include: [
                        {
                            model: Subject,
                            required: true,
                            where: subjectID ? {id: subjectID} : {}
                        }
                    ]
                }
            ]
        });

        return scores;
    }

    // Helper function
    static compareLevel = (currentLevel, highestLevel) => {
        const currentLevelNumber = parseInt(currentLevel.match(/\d+/)[0]);
        const highestLevelNumber = parseInt(highestLevel.match(/\d+/)[0]);
        const highestNumber = Math.max(currentLevelNumber, highestLevelNumber);
        const prefix = currentLevel.match(/[A-Z]+/)[0];  // Extract "NT" from currentLevel
        return `${prefix}${highestNumber}`;
    }
}

module.exports = ScoreService;