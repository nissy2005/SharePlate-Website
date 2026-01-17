module.exports = (req, res, next) => {
  try {
    const role = req.headers['x-user-role'];

    if (!role) {
      return res.status(401).json({ message: 'No role provided. Access denied.' });
    }

    if (role.toLowerCase() === 'admin') {
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
  } catch (err) {
    console.error('Error in isAdmin middleware:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};