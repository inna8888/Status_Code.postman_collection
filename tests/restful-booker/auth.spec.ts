import {
   test,
   request,
   APIResponse,
   APIRequestContext,
   expect,
} from "@playwright/test";
import Joi from 'joi';

//fixture
//default fixtures - page, context(створює ізольоване середовище для зберігання кукі, локал сторідж), browser, request
let token: string;

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

test("RB-002 update existing booking", async ({request}) => {
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
            checkin: "2026-01-01",
            checkout: "2026-01-01"
      },
      additionalneeds: "Breakfast",
      },
      // failOnStatusCode: true,
      headers: {
         Cookie: `token=${token}`,
      },
   })
const headers = result.headers();
// Print headers for debugging
console.log('Response headers:', headers);

// Check for existence of 'content-type' header (lowercase, as returned by Playwright)
expect(headers['content-type']).toBeDefined();

// Optionally check for other headers if needed
// expect(headers['accept']).toBeDefined();

// For array format (debugging)
const headersArr = result.headersArray();
console.log('Headers array:', headersArr);

})

test("RB-005 create booking, json schema should be valid", async ({request}) => {
   const result = await request.post('/booking', {
      data: {
         firstname: "Jimmm",
         lastname: "Brown",
         totalprice: 111,
         depositpaid: true,
         bookingdates: {
            checkin: "2026-01-01",
            checkout: "2026-01-01"
      },
      additionalneeds: "Breakfast",
      },
      // failOnStatusCode: true,
      headers: {
         Cookie: `token=${token}`,
      },
   })
   const json = await result.json();
   const bookingSchema = Joi.object({
      additionalneeds: Joi.string().required(),//властивість обовязкoва
      totalprice: Joi.number().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      depositpaid: Joi.boolean().required(),
      bookingdates: Joi.object({
         checkin: Joi.date().required(),
         checkout: Joi.date().required(),
      }),
   });

   const schema = Joi.object({
      bookingid: Joi.number().required(),
      booking: bookingSchema.required(),
   });

   const validationResult = await schema.validateAsync(json);//асинхронна валідація
})

test("RB-006 update partially existing booking", async({request})) => {
   const result = await request.patch('/booking/1', {
      
   }  )
}