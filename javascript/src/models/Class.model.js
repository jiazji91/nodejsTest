module.exports = (sequelize, Sequelize) => {
  const Class = sequelize.define('class', {
    classCode: { type: Sequelize.STRING, allowNull:false, primaryKey:true },
    name: { type: Sequelize.STRING, allowNull:false },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  });

  return Class;
}


