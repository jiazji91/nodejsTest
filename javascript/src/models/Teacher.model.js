module.exports = (sequelize, Sequelize) => {
  const Teacher = sequelize.define('teacher', {
    email: { type: Sequelize.STRING, allowNull:false, primaryKey:true },
    name: { type: Sequelize.STRING, allowNull:false },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });
  return Teacher;
}
