//* blogpost gar na vanda paila yo middleware le check garxa ki user login xa ki xaina ani login xa vane matra blog post garne natra login page ma redirect garxa (middelware vane ko inbetween process ho)

const jwt = require('jsonwebtoken')
const { promisify } = require('util');
const { user } = require('../model');
const { where } = require('sequelize');

exports.isAuth = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token)
        return res.redirect('/loginpage')

    //! token verification 

    // jwt.verify(token , process.env.JWT_SECRET , (err , decoded) => {
    //     if(err)
    //             res.send(err)
    //     else{
    //         // futher step
    //     }

    // })


    // easier step use the promisify le aafai handel garcha tyo pacahdi ko kura le 
    const decodedResult = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // check the user is present or not 
    const userExist = await user.findAll({
        where: {
            id: decodedResult.id
        }
    })
    console.log(userExist[0].id);

    if (userExist.length === 0) {
        res.send("You Must be Loged In ")
    } else {
        req.users = userExist[0].id
    }

    // console.log(userExist);
    // Advantage of the middelware is that it can carry the data for the next component as req.[data]
    next()



}