import bcrypt from "bcrypt";
import { hashPassword } from "../utils/hash";

jest.mock("bcrypt");

describe("Hashing TEST", () => {
  it("Should return 'fake-hash'", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("fake-hash");

    const newPassword = await hashPassword("1234");
    expect(newPassword).toBe("fake-hash");
  });
});
