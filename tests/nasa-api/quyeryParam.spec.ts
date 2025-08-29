import { test, expect } from "playwright/test";

const API_KEY = "NPAT5IaxPYRBxgOcIbUbgiJkg8HeD3gdyRz5aGnY";

test("BI-1 Get Date", {
   tag: ["@smoke", "@admin"],
   annotation: {
      type: 'description',
      description: 'Some annotation',
   }
},

async ({request}) => {
   const date = '2025-08-20';
   const response = await request.get(
      `/planetary/apod?date=${date}&api_key=${API_KEY}`
   );
   expect(response.status()).toBe(200);

   const body = await response.json();
   expect(body).toHaveProperty("copyright");

   const header = await response.headers();
   expect(Number(header['x-ratelimit-remaining'])).toBeLessThan(4000);

});

test("BI-2 Get Start_Date",
   async({request}) => {
      const start_date='2025-08-05';
      const response = await request.get(
         `/planetary/apod?start_date=${start_date}&api_key=${API_KEY}`
      );

      expect(response.status()).toBe(200);

      const body = await response.json();
      for (const item of body) {
         expect(item).toHaveProperty("title"); 
         expect(typeof item.title).toBe("string");
      }

      const header = await response.headers();
      expect(Number(header['x-ratelimit-remaining'])).toBeLessThan(4000);
   }
);

test("BI-3 Get End Date", 
   async({request}) => {
      const params = {
         start_date: '2025-08-05',
         end_date: '2025-08-10',
         api_key: API_KEY
      }

      const response = await request.get(
         `/planetary/apod`,{
            params: params,
         }
      );

      expect(response.status()).toBe(200);

      const body = await response.json();
      for (const item of body) {
         expect(item).toHaveProperty("title"); 
         expect(typeof item.title).toBe("string");
      }

      const header = await response.headers();
      expect(Number(header['x-ratelimit-remaining'])).toBeLessThan(4000);
   }
);

test("Get Count", 
   async({request}) => {
      const response = await request.get(
         `/planetary/apod?count=2&api_key=${API_KEY}`
      );

      expect(response.status()).toBe(200);

      const headers = response.headers();
      expect(headers).toHaveProperty('access-control-expose-headers');

      const body = await response.json();
      expect(body[0].media_type).toBe("image");
   }
);