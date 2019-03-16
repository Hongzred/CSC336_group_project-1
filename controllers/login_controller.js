

;

const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');


module.exports = (connection) => {
  
  const router = express.Router();

  router
    
    .get(
      '/login', 
      (req, res) => {
        res.render('pages/login')
      }
    )
      
    .post(
      '/login', 
      
      bodyParser(),
      
      (req, res) => {
        
        const REQUEST_ENDPOINT = 'http://localhost:3003'
                                  +'/api/authenticate';
        const REQUEST_METHOD = 'POST';
        const USERNAME = req.body.username;
        const PASSWORD = req.body.password;
  
        request(
          
          {
            url: REQUEST_ENDPOINT,
            method: REQUEST_METHOD,
            json: true,
            body: {
              username: USERNAME,
              password: PASSWORD
            }
            
          },
          
          (error, response, body) => {
            
            if (error) {
              console.log('error');
              res.status(400);
              res.json(error);
              
            } else {
              console.log('no error');
              const RESPONSE_STATUS_CODE = response.statusCode;
              switch (RESPONSE_STATUS_CODE) {
                case 200: {
                  
                  const USER_INFO = body[0]
                  
                  Object.assign(req.session.user, USER_INFO)
                  delete req.session.user['username']
                  delete req.session.user['password']
                  
                  res.redirect('/')
                  break;
                }
                
                case 204: {
                  
                  res.redirect('/login')
                  break;
                }
                
                case 400: {
                  
                  res.redirect(400, '/login')
                  break;
                }                          
              }            
              
            }         
            
          }
        )
        
      }
    )
  
  
  return router;
  
}