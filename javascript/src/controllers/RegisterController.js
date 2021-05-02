import Express from 'express';
import Logger from '../config/logger';

const db = require('../config/database');
const LOG = new Logger('RegisterController.js');
const Teacher = db.teacher;
const Subject = db.subject;
const Class = db.class;
const Student = db.student;

const RegisterController = Express.Router();

const addRegistrationHandler = async (req, res) => {
  if (!(req.body.teacher && req.body.teacher.email && req.body.teacher.name)) {
    res.status(400).send({
      message: 'Teacher can not be empty!'
    });
    LOG.error('Teacher can not be empty!');
    return;
  }
  if (!req.body.students) {
    res.status(400).send({
      message: 'Students can not be empty!'
    });
    LOG.error('Students can not be empty!');
    return;
  }
  if (!(req.body.subject && req.body.subject.subjectCode && req.body.subject.name)) {
    res.status(400).send({
      message: 'Subject can not be empty!'
    });
    LOG.error('Subject can not be empty!');
    return;
  }
  if (!(req.body.class && req.body.class.classCode && req.body.class.name)) {
    res.status(400).send({
      message: 'Class can not be empty!'
    });
    LOG.error('Class can not be empty!');
    return;
  }

  const students = req.body.students.map(arrObj => {
    if (!(arrObj.email && arrObj.name)) {
      res.status(400).send({
        message: 'Students can not be empty!'
      });
      LOG.error('Students can not be empty!');
      return;
    }
    return {
      email: arrObj.email,
      name: arrObj.name,
      classCode: req.body.class.classCode
    }
  });

  updateOrCreate(Teacher, { email: req.body.teacher.email }, { email: req.body.teacher.email, name: req.body.teacher.name })
    .then(updateOrCreate(Class, { classCode: req.body.class.classCode }, { classCode: req.body.class.classCode, name: req.body.class.name }))
    .then(updateOrCreate(Subject, { subjectCode: req.body.subject.subjectCode, teacherEmail: req.body.teacher.email, classCode: req.body.class.classCode }, { subjectCode: req.body.subject.subjectCode, name: req.body.subject.name, teacherEmail: req.body.teacher.email, classCode: req.body.class.classCode }))
    .catch(function (err) {
      res.status(500).send({
        message: err.message || 'Registration Failed!'
      });
      LOG.error(err.message);
      return;
    });

  Student.bulkCreate(students,
    {
      fields: ['email', 'name', 'classCode'],
      updateOnDuplicate: ['email', 'classCode']
    })

  return res.status(204).send({ message: 'Register Success' });
}

async function updateOrCreate(model, where, newItem) {
  const foundItem = await model.findOne({ where });
  if (!foundItem) {
    const item = await model.create(newItem)
    return { item, created: true };
  }
  const item = await model.update(newItem, { where });
  return { item, created: false };
}

const workLoad = async (req, res) => {
  Teacher.findAll({
    attributes: ['name'],
    include: [{
      model: Subject,
      attributes: ['subjectCode', ['name', 'subjectName'], [db.sequelize.fn('COUNT', db.sequelize.col('classCode')), 'numberOfClasses']]
    }],
    raw: true,
    nest: true,
    group: ['teacher.name', 'subjects.subjectCode', 'subjects.name']
  }).then(teachers => {
    res.send(teachers);
  });
};

RegisterController.post('/register', addRegistrationHandler);
RegisterController.get('/reports/workload', workLoad);

export default RegisterController;
