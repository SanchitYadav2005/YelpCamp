const express = require('express');
const router = express.Router();


router.get('/register', (req,res)=>{
    res.render('user/register');
});

router.post('/register', async (req,res)=>{
    res.send(req.body);
})

module.exports = router;