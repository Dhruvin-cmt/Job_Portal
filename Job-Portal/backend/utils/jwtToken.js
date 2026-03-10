export const generateToken = async (user, message, statusCode, res) => {
  const token = user.generateAccessToken();

  const cookieName =
    user.role === "Employer" ? "employertoken" : "employeetoken";

  const isProd = process.env.NODE_ENV === "production";

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    })
    .json({
      success: true,
      message,
      user,
    });
};
