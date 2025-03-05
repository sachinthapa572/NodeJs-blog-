const catchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      const path = req.route.path;
      req.flash("error", "Something went wrong");
      res.redirect(path);
      return;
    });
  };
};

export default catchError;
