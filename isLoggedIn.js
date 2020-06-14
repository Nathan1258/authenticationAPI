const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req,res) => {
    if(req.user){
        return true;
    }else{
        return false;
    }
});

module.exports = router;