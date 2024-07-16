'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [];

    for (let i = 1; i <= 120; i++) {
      users.push({
        firstName: `User`,
        lastName: `Test ${i}`,
        email: `usertest${i}@example.com`,
        password: 12345678,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('user', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};
