import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

class PrismaService {
  static #prisma = new PrismaClient().$extends(withAccelerate());

  // Return the Prisma Client instance
  static getClient() {
    return this.#prisma;
  }

  // Close the connection
  static async closeConnection() {
    await this.#prisma.$disconnect();
  }
}

export default PrismaService;
