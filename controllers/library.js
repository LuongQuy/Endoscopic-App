exports.getCurrentUser = (user) => {
    var username = '';
    if(typeof user.info.lastname != 'undefined') username += user.info.lastname + ' '; 
    if(typeof user.info.firstname != 'undefined') username += user.info.firstname;
    if(username === '') username = user.local.email;
    return username;
}