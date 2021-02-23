exports.isLogged = (req, res, next) => {
    if(req.user) return next();
    return res.redirect('/');
}
exports.notLogged = (req, res, next) => {
    if(!req.user) return next();
    else{
        if(req.user.role === 'DOCTOR') res.redirect('/doctor');
        else if(req.user.role === 'ADMIN') res.redirect('/admin');
    }
}
exports.isDoctor = (req, res, next) => {
    if(req.user.role === 'DOCTOR') return next();
    else if(req.user.role === 'ADMIN') return res.redirect('/admin');
}
exports.isAdmin = (req, res, next) => {
    if(req.user.role === 'ADMIN') return next();
    else if(req.user.role === 'DOCTOR') return res.redirect('/doctor');
}