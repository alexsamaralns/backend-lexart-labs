'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [];
    const brands = ['Apple', 'Samsung', 'Google', 'Sony', 'LG', 'Nokia', 'Motorola', 'Xiaomi'];
    const operatingSystems = ['iOS', 'Android'];

    for (let i = 1; i <= 120; i++) {
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const operating_system = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
      const price = (Math.random() * 1000).toFixed(2);

      products.push({
        name: `Product ${i}`,
        brand: brand,
        model: `Model ${i}`,
        price: price,
        operating_system: operating_system,
        createBy: Math.floor(Math.random() * 10) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
    }

    await queryInterface.bulkInsert('product', products, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product', null, {});
  }
};
