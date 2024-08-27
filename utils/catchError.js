module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            // console.log(req);
            const path = req.route.path
            req.flash('error', 'Something went wrong')
            console.log(error)
            res.redirect(path)
            return

        })
    }

}