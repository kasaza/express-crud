var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

// DISPLAY employees page
router.get('/', function (req, res, next) {

  dbConn.query('SELECT * FROM employees ORDER BY id desc', function (err, rows) {

    if (err) {
      req.flash('error', err);
      // render to views/employees/index.ejs
      res.render('employees', { data: '' });
    } else {
      // render to views/employees/index.ejs
      res.render('employees', { data: rows });
    }
  });
});

// DISPLAY add employee page
router.get('/add', function (req, res, next) {
  // render to add.ejs
  res.render('employees/add', {
    name: '',
    email: '',
    phone:''
  })
})

// ADD new employee
router.post('/add', function (req, res, next) {

  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let errors = false;

  if (name.length === 0 || email.length === 0 || phone.length === 0) {
    errors = true;

    // SET flash message
    req.flash('error', "Please enter Employee name, email, and phone");
    // RENDER to add.ejs with flash message
    res.render('employees/add', {
      name: name,
      email: email,
      phone: phone
    })
  }

  // if no error
  if (!errors) {

    var form_data = {
      name: name,
      email: email,
      phone: phone
    }

    // INSERT query
    dbConn.query('INSERT INTO employees SET ?', form_data, function (err, result) {
      //if(err) throw err
      if (err) {
        req.flash('error', err)

        // RENDER to add.ejs
        res.render('employees/add', {
          name: form_data.name,
          email: form_data.email,
          phone: form_data.phone
        })
      } else {
        req.flash('success', 'Employee successfully added');
        res.redirect('/employees');
      }
    })
  }
})
// DISPLAY view employee page
router.get('/view/(:id)', function (req, res, next) {

  let id = req.params.id;

  dbConn.query('SELECT * FROM employees WHERE id = ' + id, function (err, rows, fields) {
    if (err) throw err

    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'Employee not found with id = ' + id)
      res.redirect('/employees')
    }
    // if employee found
    else {
      // RENDER to view.ejs
      res.render('employees/view', {
        title: 'View Employee',
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        phone: rows[0].phone,
        created: rows[0].created,
        updated: rows[0].updated
      })
    }
  })
})

// DISPLAY edit employee page
router.get('/edit/(:id)', function (req, res, next) {

  let id = req.params.id;

  dbConn.query('SELECT * FROM employees WHERE id = ' + id, function (err, rows, fields) {
    if (err) throw err

    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'Employee not found with id = ' + id)
      res.redirect('/employees')
    }
    // if employee found
    else {
      // RENDER to edit.ejs
      res.render('employees/edit', {
        title: 'Edit Employee',
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        phone: rows[0].phone
      })
    }
  })
})

// UPDATE employee data
router.post('/update/:id', function (req, res, next) {

  let id = req.params.id;
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let errors = false;

  if (name.length === 0 || email.length === 0) {
    errors = true;

    // set flash message
    req.flash('error', "Please enter Employee name, email, and phone");
    // render to add.ejs with flash message
    res.render('employees/edit', {
      id: req.params.id,
      name: name,
      email: email,
      phone: phone
    })
  }

  // if no error
  if (!errors) {

    var form_data = {
      name: name,
      email: email,
      phone: phone
    }
    // UPDATE query
    dbConn.query('UPDATE employees SET ? WHERE id = ' + id, form_data, function (err, result) {
      //if(err) throw err
      if (err) {
        // set flash message
        req.flash('error', err)
        // render to edit.ejs
        res.render('employees/edit', {
          id: req.params.id,
          name: form_data.name,
          email: form_data.email,
          phone: form_data.phone
        })
      } else {
        req.flash('success', 'Employee successfully updated');
        res.redirect('/employees');
      }
    })
  }
})

// DELETE employee
router.get('/delete/(:id)', function (req, res, next) {

  let id = req.params.id;

  dbConn.query('DELETE FROM employees WHERE id = ' + id, function (err, result) {
    //if(err) throw err
    if (err) {
      // set flash message
      req.flash('error', err)
      // redirect to employees page
      res.redirect('/employees')
    } else {
      // set flash message
      req.flash('success', 'Successfully deleted! ID = ' + id)
      // redirect to employees page
      res.redirect('/employees')
    }
  })
})

module.exports = router;