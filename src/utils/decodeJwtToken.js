import jwt from "jsonwebtoken";
import { promisify } from "util";

export const jwtDecode = async (token) => {
    const decodedResult = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    return decodedResult;
};
