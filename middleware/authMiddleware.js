const {db_Select} = require("../modules/MasterModule");

const validateSession = async (req, res, next) => {
      console.log(req.session);

  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const sessionId = req.session.user.session_version_id;
    const user_id = req.session.user.user_id;
    // Validate the session ID stored in the cookie against the database
    const validSession_data = await db_Select('session_version_id','md_user',`user_id='${user_id}' `,null);
      var  db_session =  validSession_data.suc > 0 ? validSession_data.msg[0].session_version_id : 0
    if (sessionId == db_session) {
        
      // If session is valid, proceed to the next middleware or route handler
      next();
    } else {
      res.redirect('/logout');
      //return res.status(401).send('Invalid session ID');
    }
  } catch (err) {
    console.error('Error validating session:', err);
    return res.status(500).send('Internal server error');
  }
};

module.exports = { validateSession };
