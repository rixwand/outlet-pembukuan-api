import supertest from "supertest";
import web from "../src/app/web";
import {
  addUser,
  getLoginToken,
  getUser,
  removeUser,
  sleep,
} from "./utils/user-test-utils";
import bcrypt from "bcrypt";
describe("POST /api/user/register", () => {
  afterEach(async () => {
    await removeUser();
  });
  it("should can register new user", async () => {
    const res = await supertest(web).post("/api/user/register").send({
      username: "test",
      email: "test@gmail.com",
      password: "test",
    });
    expect(res.body.data.username).toBe("test");
    expect(res.body.data.email).toBe("test@gmail.com");
  });

  it("should reject register new user with exist email", async () => {
    await supertest(web).post("/api/user/register").send({
      username: "test",
      email: "test@gmail.com",
      password: "test",
    });
    const res = await supertest(web).post("/api/user/register").send({
      username: "test",
      email: "test@gmail.com",
      password: "test",
    });
    expect(res.status).toBe(400);
    console.log(res.body);
  });

  it("should reject register new user with invalid data", async () => {
    const res = await supertest(web).post("/api/user/register").send({
      username: "",
      email: "",
      password: "",
    });
    expect(res.status).toBe(400);
    console.log(res.body);
  });

  it("should reject register new user with sending token", async () => {
    const res = await supertest(web).post("/api/user/register").send({
      username: "test",
      email: "test@gmail.com",
      password: "test",
      token: "test",
    });
    expect(res.status).toBe(400);
    console.log(res.body);
  });
});

describe("POST /api/user/login", () => {
  beforeEach(async () => {
    await addUser();
  });
  afterEach(async () => {
    await removeUser();
  });
  it("should can login", async () => {
    const res = await supertest(web).post("/api/user/login").send({
      email: "test@gmail.com",
      password: "test",
    });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("access_token");
    expect(res.body.data).toHaveProperty("refresh_token");
  });

  it("should reject login with wrong email", async () => {
    const res = await supertest(web).post("/api/user/login").send({
      email: "tests@gmail.com",
      password: "test",
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
  it("should reject login with wrong password", async () => {
    const res = await supertest(web).post("/api/user/login").send({
      email: "test@gmail.com",
      password: "wrong",
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject login with invalid data", async () => {
    const res = await supertest(web).post("/api/user/login").send({
      email: "",
      password: "",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("DELETE /api/user/logout", () => {
  beforeEach(async () => {
    await addUser();
  });
  afterEach(async () => {
    await removeUser();
  });

  it("should can logout user", async () => {
    const access_token = await getLoginToken();
    const { token: refresh_token_login } = await getUser();
    await supertest(web)
      .delete("/api/user/logout")
      .set("authorization", "Bearer " + access_token);
    const { token: refresh_token_logout } = await getUser();
    expect(refresh_token_login).toBeDefined;
    expect(refresh_token_logout).toBeNull;
  });

  it("should reject logout user with no token", async () => {
    const { token: refresh_token_login } = await getUser();
    const res = await supertest(web).delete("/api/user/logout");
    const { token: refresh_token_logout } = await getUser();
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
    expect(refresh_token_login).toBeDefined;
    expect(refresh_token_logout).toBeDefined;
  });

  it("should reject logout user with wrong token", async () => {
    const { token: refresh_token_login } = await getUser();
    const res = await supertest(web)
      .delete("/api/user/logout")
      .set("authorization", "Bearer " + "access_token");
    const { token: refresh_token_logout } = await getUser();
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
    expect(refresh_token_login).toBeDefined;
    expect(refresh_token_logout).toBeDefined;
  });
});

describe("GET /api/user/current", () => {
  beforeEach(async () => {
    await addUser();
  });
  afterEach(async () => {
    await removeUser();
  });

  it("should can get data user", async () => {
    const access_token = await getLoginToken();
    const res = await supertest(web)
      .get("/api/user/current")
      .set("authorization", "Bearer " + access_token);

    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe("test");
    expect(res.body.data.email).toBe("test@gmail.com");
  });

  test.skip("should reject get data user with expired access token", async () => {
    const access_token = await getLoginToken();
    await sleep(6);
    const res = await supertest(web)
      .get("/api/user/current")
      .set("authorization", "Bearer " + access_token);
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Forbidden");
  }, 15000);
});

describe("PATCH /api/user/current", () => {
  beforeEach(async () => {
    await addUser();
  });
  afterEach(async () => {
    await removeUser();
    await removeUser("rixwand");
  });

  it("should can update user name", async () => {
    const access_token = await getLoginToken();
    const user_before_update = await getUser();
    await sleep(2);
    const res = await supertest(web)
      .patch("/api/user/current")
      .send({
        username: "rixwand",
      })
      .set("authorization", "Bearer " + access_token);
    await sleep(2);

    const user_after_update = await getUser();
    expect(res.body.data.username).toBe("rixwand");
    expect(user_before_update.username).not.toEqual(user_after_update.username);
    console.log(user_before_update.username, user_after_update.username);
  });

  it("should can update user email", async () => {
    const access_token = await getLoginToken();
    const res = await supertest(web)
      .patch("/api/user/current")
      .send({
        email: "rixwand@gmail.com",
      })
      .set("authorization", "Bearer " + access_token);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("rixwand@gmail.com");
  });

  it("should can update user password", async () => {
    const access_token = await getLoginToken();

    const res = await supertest(web)
      .patch("/api/user/current")
      .send({
        passwordUpdate: { oldPassword: "test", newPassword: "notTest" },
      })
      .set("authorization", "Bearer " + access_token);
    await sleep(1);
    const { password: newPassword } = await getUser();
    expect(res.status).toBe(200);
    expect(await bcrypt.compare("notTest", newPassword)).toBeTruthy();
  });

  it("should reject update user password with wrong old password", async () => {
    const access_token = await getLoginToken();

    const res = await supertest(web)
      .patch("/api/user/current")
      .send({
        passwordUpdate: { oldPassword: "wrong", newPassword: "notTest" },
      })
      .set("authorization", "Bearer " + access_token);
    await sleep(1);
    console.log(res.body);
    const { password: newPassword } = await getUser();
    expect(res.status).toBe(403);
    expect(await bcrypt.compare("test", newPassword)).toBeTruthy();
  });
});
