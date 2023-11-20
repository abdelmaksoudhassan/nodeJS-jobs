const ExtraData = require('./models/extra-data.model')
const User = require('./models/user.model')
const Job = require('./models/job.model')
const ClientJob = require('./models/client-job.model')
const category = require('./models/category.model')

User.hasOne(ExtraData,{constraints:true,onDelete:'CASCADE'})
ExtraData.belongsTo(User, { constraints:true })

User.hasMany(Job,{constraints:true,onDelete:'CASCADE'});
Job.belongsTo(User, { constraints: true });

User.belongsToMany(Job,{through:ClientJob,constraints:true,onDelete:'CASCADE'})
Job.belongsToMany(User,{through:ClientJob,constraints:true})

category.hasMany(Job,{constraints:true,onDelete:'CASCADE'});
Job.belongsTo(category,{ constraints: true })

category.hasMany(ExtraData,{ constraints: true,onDelete:'SET NULL'});
ExtraData.belongsTo(category,{ constraints: true})
