// Setting up database name, port assignment

module.exports = {
    database: process.env.MONGODB_URI || 'mongodb://localhost:27017/china-scaper'
};