exports.checkUser = (req, res, next) => {
    if (!req.session.userEmail || !req.currentUser) {
        res.redirect("/login");
        return;
    }
    res.locals.userEmail = req.session.userEmail;
    next();
}