import App from "../app";
import { prisma } from "../config/prisma";
import supertest from "supertest";

const appTest = new App().app; // instance from class App
const request = supertest(appTest);

describe("API implementation testing", () => {
  beforeEach(() => {
    // Menyiapkan program/function yang ingin dijalankan sebelum tiap skenario testing dieksekusi
  });

  beforeAll(async () => {
    // Menyiapkan program yang ingin dijalankan sebelum seluruh skenario dieksekusi
    await prisma.$connect();
  });

  afterEach(() => {
    // Menyiapkan program/function yang ingin dijalankan sesudah tiap skenario testing dieksekusi
  });

  afterAll(async () => {
    // Menyiapkan program yang ingin dijalankan sebelum seluruh skenario dieksekusi
    await prisma.$disconnect();
  });

  // TESTING SCENARIO
  // GOOD CASE
  it("Should return welcome essage from main route", async () => {
    const response = await request.get("/");

    expect(response.status).toBe(200);
    expect(response.text).toEqual("<h1>Classbase API</h1>");
  });

  // BAD CASE
  it("Should return NOT FOUND PAGE for un-exist route", async () => {
    const response = await request.get("/category");

    expect(response.status).toBe(404);
  });
});
