jest.setTimeout(10000);
const { getApp, shutDown } = require("../server");
const request = require("supertest");
const DBproducts = require("../src/models/products");
const DBreservations = require("../src/models/reservations");
const DBdistributors = require("../src/models/distributors");

describe("Reservations Post endpoint", () => {
  it("Post should succeed", async () => {
    const app = await getApp();
    const distributorId = 1;

    const responseWithToken = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(responseWithToken.status).toBe(200);
    expect(responseWithToken.body.auth).toBe(true);

    const reservationResponse = await request(app)
      .post("/reservations")
      .set("x-access-token", responseWithToken.body.token)
      .send({
        reservation: {
          product_warehouse_id: 1,
          amount: 100,
        },
      });

    const reservation = await DBreservations.getReservationById(
      reservationResponse.body.reservation.reservation_id,
      distributorId
    );

    await DBreservations.cancelReservation(
      reservationResponse.body.reservation.reservation_id
    );

    expect(reservationResponse.status).toBe(200);
    expect(reservationResponse.body).toStrictEqual({
      reservation: JSON.parse(JSON.stringify(reservation)), //WHEN SENDING RESPONSE, Date OBJECT IS CONVERTED TO STRING
    });
  });

  it("Post should fail", async () => {
    const app = await getApp();
    const distributorId = 1;

    const responseWithToken = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(responseWithToken.status).toBe(200);
    expect(responseWithToken.body.auth).toBe(true);

    const reservationResponse = await request(app)
      .post("/reservations")
      .set("x-access-token", responseWithToken.body.token)
      .send({
        reservation: {
          product_warehouse_id: 1,
          amount: 500,
        },
      });

    expect(reservationResponse.status).toBe(422);
    expect(reservationResponse.body.reservation).toBe(null);
  });
});

describe("Reservations Delete endpoint", () => {
  it("Delete should succeed", async () => {
    const app = await getApp();
    const distributorId = 1;
    const productWarehouseId = 1;

    const responseWithToken = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(responseWithToken.status).toBe(200);
    expect(responseWithToken.body.auth).toBe(true);

    const reservation = await DBreservations.createReservation(
      distributorId,
      productWarehouseId,
      50
    );

    const reservationCancelResponse = await request(app)
      .delete(`/reservations/${reservation.reservation_id}`)
      .set("x-access-token", responseWithToken.body.token)
      .send({});

    const reservationAfterDeletion = await DBreservations.getReservationById(
      reservation.reservation_id,
      distributorId
    );

    expect(reservationCancelResponse.status).toBe(200);
    expect(reservationAfterDeletion).toBe(undefined);
  });
  it("Delete should fail", async () => {
    const app = await getApp();

    const responseWithToken = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(responseWithToken.status).toBe(200);
    expect(responseWithToken.body.auth).toBe(true);

    const nonExistantReservationId = 3003103;

    const reservationCancelResponse = await request(app)
      .delete(`/reservations/${nonExistantReservationId}`)
      .set("x-access-token", responseWithToken.body.token)
      .send({});

    expect(reservationCancelResponse.status).toBe(404);
    expect(reservationCancelResponse.body.error.code).toBe("NOT FOUND");
  });
});

describe("Reservations Get endpoints", () => {
  it("Get (with id in params) should succeed", async () => {
    const app = await getApp();
    const distributorId = 1;
    const productWarehouseId = 1;

    const responseWithToken = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(responseWithToken.status).toBe(200);
    expect(responseWithToken.body.auth).toBe(true);

    const reservation = await DBreservations.createReservation(
      distributorId,
      productWarehouseId,
      50
    );

    const reservationGetResponse = await request(app)
      .get(`/reservations/${reservation.reservation_id}`)
      .set("x-access-token", responseWithToken.body.token)
      .send({});

    await DBreservations.cancelReservation(reservation.reservation_id);

    expect(reservationGetResponse.status).toBe(200);
    expect(reservationGetResponse.body.reservation).toStrictEqual(
      JSON.parse(JSON.stringify(reservation))
    );
  });
  it("Get (without id) should succeed", async () => {
    const app = await getApp();
    const distributorId = 1;
    const productWarehouseId = 1;
    const productWarehouseId2 = 2;

    const responseWithToken = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(responseWithToken.status).toBe(200);
    expect(responseWithToken.body.auth).toBe(true);

    const reservation = await DBreservations.createReservation(
      distributorId,
      productWarehouseId,
      50
    );

    const reservation2 = await DBreservations.createReservation(
      distributorId,
      productWarehouseId2,
      20
    );

    const reservationGetResponse = await request(app)
      .get(`/reservations/`)
      .set("x-access-token", responseWithToken.body.token)
      .send({});

    await DBreservations.cancelReservation(reservation.reservation_id);
    await DBreservations.cancelReservation(reservation2.reservation_id);
    expect(reservationGetResponse.status).toBe(200);
    expect(reservationGetResponse.body.reservations).toStrictEqual(
      JSON.parse(JSON.stringify([reservation, reservation2]))
    );
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
