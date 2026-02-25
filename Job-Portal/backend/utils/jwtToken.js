export const generateToken = async (user, message, statusCode, res) => {
  const token = user.generateAccessToken();

  const cookieName =
    user.role === "Employer" ? "employertoken" : "employeetoken";

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
    });
};
