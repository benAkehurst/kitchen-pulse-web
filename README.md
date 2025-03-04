This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## BE ROUTES - http://localhost:8080/api-docs/#/

**Authentication**

POST
/auth/register
User registration - NOT NEEDED ON FE

POST
/auth/login
User login - **DONE**

POST
/auth/refresh-token
Refresh Token - **TODO: Need to implement this properly**

POST
/auth/logout
User logout - **DONE**

**Customer**

POST
/customer/add-customer
Allows a user to add a customer - **DONE**

GET
/customer/get-customers
Allows a user to get all their customers - **DONE**

GET
/customer/single-customer?externalId=xxx
Allows a user to get a single customer - **DONE**

PUT
/customer/update-customer?externalId=xxx
Allows a user to update customer details - **DONE**

**Message**

GET
/message/get-all-messages - **TODO: Need to implement this**

POST
/message/send-new-message - **TODO: Need to implement this**

PUT
/message/edit-message - **TODO: Need to implement this**

DELETE
/message/delete-message?externalId=xxx - **TODO: Need to implement this**

**Orders**

POST
/orders/upload-past-orders - **TODO: Need to implement this**

POST
/orders/upload-manual-order - **DONE**

GET
/orders/all-orders
Gets all the users orders across all customers - **DONE**

GET
/orders/orders-by-customer?externalId=xxx
Gets all the orders for a specific customer. Need to send the id of the customer in the URL. **DONE**

GET
/orders/get-single-order?externalId=xxx
Gets single order information **TODO: Need to implement this**

**User**

GET
/user/get-profile-information
Allows a user to get profile information - **DONE**

PUT
/user/update-profile
Allows a user to update their profile - **DONE**

PUT
/user/upload-avatar
Allows a user to update their avatar - **DONE**
