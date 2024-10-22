const express = require('express');
const router = express.Router();
const employeeModel = require('../model/employeeData');
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const jwt = require("jsonwebtoken")

//Adding middleware -verify token 
//next() -
function verifyToken(req,res,next){
    let token = req.headers.token;
    try {
        if (!token) throw 'Unauthorised Access'
        let payload= jwt.verify(token,"secret") //the same secret key in sign method(user.js)
        if (!payload) throw 'Unauthorise Access'
        next()
    } catch (error) {
        res.json({message:error})
    }
}

//add middleware function in every router


router.post('/add',verifyToken,async(req,res)=>{
    try {
        var item = req.body;
        const data1 = new employeeModel(item);
        const saveddata = await data1.save();
        res.status(200).send('Post Successful');

    } catch (error) {
      res.status(404).send('Post Unsuccessful');  
    }
})
router.get('/', verifyToken, async (req, res) => {
    try {
        const courses = await employeeModel.find(); 
        res.status(200).json(courses); 
    } catch (error) {
        console.error('Error retrieving courses:', error);
        res.status(500).send('Error retrieving courses');
    }
});


router.get('/:id', verifyToken, async (req, res) => {
    try {
        const course = await employeeModel.findById(req.params.id); 
        if (!course) {
            return res.status(404).send('Course not found');
        }
        res.status(200).json(course); 
    } catch (error) {
        console.error('Error retrieving course:', error);
        res.status(500).send('Error retrieving course');
    }
});
router.put('/editEmployee/:id', verifyToken, async(req,res)=>{
    try {
        const id = req.params.id;
        const data = await employeeModel.findByIdAndUpdate(id,req.body);
        res.status(200).send('Update successful');
    } catch (error) {
       res.status(404).send(error); 
    }
})

router.delete('/deleteEmployee/:id', verifyToken, async(req,res)=>{
    try {
        const id = req.params.id;
        const data = await employeeModel.findByIdAndDelete(id);
        res.status(200).send('Delete successful')
    } catch (error) {
        res.status(404).send('Delete Unsuccessful');
    }
})

module.exports = router;
