module.exports = {
  database: 'mongodb://localhost:27017/csgate',
  secret: process.env.KGG_CONF_SECRET,
  admin_secret: process.env.KGG_CONF_ADMINSECRET
}
