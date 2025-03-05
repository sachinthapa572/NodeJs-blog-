module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            // console.log(req);
            const path = req.route.path
            req.flash('error', 'Something went wrong')
            res.redirect(path)
            return
        })
    }

}
