module.exports = (sequelize, Sequelize) => {
  const Subject = sequelize.define('subject', {
    subjectCode: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    teacherEmail: {
      type: Sequelize.STRING, allowNull: false, primaryKey: true,
      references: {
        model: 'teachers',
        key: 'email',
      }
    },
    classCode: {
      type: Sequelize.STRING, allowNull: false, primaryKey: true,
      references: {
        model: 'classes',
        key: 'classCode',
      }
    }
  });

  return Subject;
}
