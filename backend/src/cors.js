module.exports = (req, res, next) => {
    const allowedOrigins = ['https://www.cfregly.com/ricebook', 'https://www.cfregly.com',
        'https://backend-ricebook.herokuapp.com', 'https://www.facebook.com'];
    const origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
};