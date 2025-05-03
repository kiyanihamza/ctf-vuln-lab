module.exports = function auth(req, res, next) {
    console.log('[AUTH] session =', req.session);
  
    if (!req.session.user) {
      console.log('[AUTH] Pas authentifié → redirect');
      return res.redirect('/login');
    }
  
    console.log('[AUTH] Authentifié → accès autorisé');
    next();
  };
  