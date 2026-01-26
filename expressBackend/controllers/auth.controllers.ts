import * as bcrypt from "bcrypt";
import User from "@expressBackend/models/user.model";
import { config } from "@expressBackend/config/env.config";
import RefreshToken from "@expressBackend/models/refresh-token.model";
import jwt, { SignOptions } from "jsonwebtoken";

function generateTokenPair(user: User) {
  const accessToken: string = jwt.sign(
    {
      role: user.role,
      user: {
        id: user.id,
      },
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.accessExpiration,
    } as SignOptions,
  );

  const refreshToken: string = jwt.sign({ id: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiration,
  } as SignOptions);

  return { accessToken, refreshToken };
}
interface LoginResult {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}
async function login(email: string, password: string): Promise<LoginResult> {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const result: boolean = bcrypt.compareSync(password, user.password);
  if (!result) {
    throw new Error("Invalid email or password");
  }
  const tokens = generateTokenPair(user);
  await RefreshToken.upsert({ userId: user.id, token: tokens.refreshToken });
  return { success: true, ...tokens };
}
function verifyToken(token: string) {
  return jwt.verify(token, config.jwt.secret);
}

async function verifyRefreshToken(token: string) {
  const storedRefreshToken = await RefreshToken.findAll({
    where: {
      token,
    },
  });

  if (!storedRefreshToken.length) {
    throw new Error("RefreshToken not found.", { cause: 404 });
  }

  return true;
}

export { login, verifyToken, verifyRefreshToken, generateTokenPair };
