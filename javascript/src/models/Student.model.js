module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define('student', {
    email: { type: Sequelize.STRING, allowNull:false, primaryKey:true },
    name: { type: Sequelize.STRING, allowNull:false },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    classCode: {
      type: Sequelize.STRING, allowNull: false, primaryKey: true,
    }
  });
  return Student;
}

