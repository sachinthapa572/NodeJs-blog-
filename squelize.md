# [Sequelize](https://sequelize.org/)

    sequelize is the SQL based ORM for Node.js. It supports MySQL, PostgreSQL, SQLite and MSSQL. It is easy to use and has a lot of features. It is a promise-based library

- .create({}) insert data into the database
- .findAll() select data from the database
- .findAll({where: {}}) select data from the database with a condition
- .findAll({include: {
  model: ModelName,
  where: {condition}
  }}) select data from the database with a join

- .update() update data in the database
- .destroy() delete data from the database
- .sync() synchronize the model with the database
