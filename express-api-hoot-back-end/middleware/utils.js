const saveUser = (req, user) => {
  req.user = user;
};

const loadUser = (req) => req.user;

module.exports = {
  saveUser,
  loadUser,
};
