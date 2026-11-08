// Institute isolation middleware
// Automatically scopes queries to the logged-in user's institute
// Must be used AFTER auth middleware

const instituteScope = (req, res, next) => {
  if (!req.user || !req.user.institute) {
    // Super admins may not have an institute
    if (req.user && req.user.role === 'super_admin') {
      return next();
    }
    return res.status(403).json({ success: false, error: 'No institute associated with this account' });
  }
  // Attach institute ID for controllers to use
  req.instituteId = req.user.institute;
  next();
};

module.exports = instituteScope;
