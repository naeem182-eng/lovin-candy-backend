
export const isAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== "ADMIN" && role !== "SUPER ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin only",
    });
  }
  next();
};
