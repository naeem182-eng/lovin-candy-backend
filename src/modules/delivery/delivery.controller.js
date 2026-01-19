export const getAddress = async (req, res, next) => {
  try {
    const { userId } = req.params; // ดึงมาจากข้อมูล 1 คน?

    const addresses = await Delivery.find({ user_id: userId });
    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    return next(error);
  }
};
