const express = require('express');
const router = express.Router();

// Bring in Award/User model
const Award = require('../models/award')
const User = require('../models/user')

// Add Route
router.get('/add', ensureAuthenticated, function(req, res) {
  res.render('add_award', {
    title: 'Add awards'
  })
});

// Add Submit POST Routes
router.post('/add', function(req, res) {
  req.checkBody('type','Type is Required').notEmpty();
  req.checkBody('detail','Detail is Required').notEmpty();

  // Get Error
  let errors = req.validationErrors();
  if(errors){
    res.render('add_award',{
      title: 'Add award',
      errors: errors
    });
  }else{
    let award = new Award()

    award.type = req.body.type
    award.award_winner = req.user._id;
    award.detail = req.body.detail

    award.save(function(err){
      if(err){
        console.log(err)
        return
      }else{
        req.flash('success','Award Added');
        res.redirect('/')
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req,res){
  Award.findById(req.params.id, function(err, award){
    if(award.award_winner != req.user._id){
      req.flash('danger','Not Authorized');
      return res.redirect('/');
    }
    res.render('edit_award',{
      title: 'Edit Award',
      award : award
    });
  });
});

// Update Submit POST Routes
router.post('/edit/:id', function(req, res) {
  let award = {};
  award.type = req.body.type
  award.award_winner = req.body.award_winner
  award.detail = req.body.detail

  let query = {_id:req.params.id}

  Award.update(query,award,function(err){
    if(err){
      console.log(err)
      return
    }else{
      req.flash('success','Award Updated');
      res.redirect('/')
    }
  });
});

// Delete Award
router.delete('/:id',function(req,res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Award.findById(req.params.id, function(err, award){
    if(award.award_winner != req.user._id){
      res.status(500).send();
    }else{
      Award.remove(query, function(err){
        if(err){
          console.log(err);
        }
        req.flash('success','Award deleted');
        res.send('Success');
      });
    }
  });
});

// Get Single Awards
router.get('/:id', function(req,res){
  Award.findById(req.params.id, function(err, award){
    User.findById(award.award_winner, function(err, user){
      res.render('award',{
        award : award,
        award_winner : user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger','Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
