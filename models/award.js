let mongoose = require('mongoose'); // import module

let awardSchema = mongoose.Schema({ // import
  type:{type:String,required:true},
  award_winner:{type: String,required:true},
  detail:{type: String,required:true}
});

let Award = module.exports = mongoose.model('awards',awardSchema);
