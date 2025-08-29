import {
   test,
   request,
   APIResponse,
   APIRequestContext,
   expect,
} from "@playwright/test";
/*
Creates a new auth token to use for access to the PUT and DELETE /booking
https://restful-booker.herokuapp.com/auth
Example 1:
curl -X POST \
  https://restful-booker.herokuapp.com/auth \
  -H 'Content-Type: application/json' \
  -d '{
    "username" : "admin",
    "password" : "password123"
}'*/
//fixture
//default fixture - page, context(створює ізольоване середовище для зберігання кукі, локал сторідж), browser, request
let token;

test.beforeAll(async ({request}) => {
   test.setTimeout(60_000);

   const result: APIResponse = await request.post("/auth", {
      data:{
         "username" : "admin",
         "password" : "password123",
      },
   })

   const json = await result.json();
   token = json.token;
})

test("RB-001 get auth - create token", async()=> {
   const context: APIRequestContext = await request.newContext({
      baseURL: "https://restful-booker.herokuapp.com",
   });

   const result: APIResponse = await context.post("/auth", {
      data: {
         "username" : "admin",
         "password" : "password123",
      },
   })

   expect(result.status()).toBe(200);

   const json = await result.json();
   const token = json.token;

   expect(token).toBeDefined();
})
/*Creates a new booking in the API
https://restful-booker.herokuapp.com/booking
curl -X POST \
  https://restful-booker.herokuapp.com/booking \
  -H 'Content-Type: application/json' \
  -d '{
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}'*/
test("RB-002 add booking", async ({request}) => {
   const result = await request.post('/booking', {
      data: {
         firstname: "Jim",
         lastname: "Brown",
         totalprice: 111,
         depositpaid: true,
         bookingdates: {
            checkin: "2018-01-01",
            checkout: "2019-01-01"
      },
      additionalneeds: "Breakfast",
      },
      failOnStatusCode: true,
   })

   expect(result.status()).toBe(200);
   const bookingid = (await result.json()).bookingid;
   expect(bookingid).toBeDefined();

   const updateBooking = await request.put(`/booking/${bookingid}`, {
      data: {
         firstname: "James",
         lastname: "Brown",
         totalprice: 111,
         depositpaid: true,
         bookingdates: {
            checkin: "2018-01-01",
            checkout: "2019-01-01"
      },
      additionalneeds: "Breakfast",
      },
      headers: {
         Cookie: `token=${token}`,
      },
   });

   expect(updateBooking.status()).toBe(200);

} )
/* Updates a current booking
https://restful-booker.herokuapp.com/booking/:id 
curl -X PUT \
  https://restful-booker.herokuapp.com/booking/1 \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Cookie: token=abc123' \
  -d '{
    "firstname" : "James",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}'*/
test("RB-003 update current booking", async ({request}) => {
   const updateBooking = await request.put('/booking/1', {
      data: {
         firstname: "James",
         lastname: "Brown",
         totalprice: 111,
         depositpaid: true,
         bookingdates: {
            checkin: "2018-01-01",
            checkout: "2019-01-01"
      },
      additionalneeds: "Breakfast",
      }
   })
})

test("RB-004 create booking, headers should exist", async ({request}) => {
   const result = await request.post('/booking', {
      data: {
         firstname: "Jimmm",
         lastname: "Brown",
         totalprice: 111,
         depositpaid: true,
         bookingdates: {
            checkin: "2018-01-01",
            checkout: "2019-01-01"
      },
      additionalneeds: "Breakfast",
      },
      // failOnStatusCode: true,
      headers: {
         Cookie: `token=${token}`,
      },
   })

const headers = result.headers();
const headersArr = result.headersArray();
console.log("");

})