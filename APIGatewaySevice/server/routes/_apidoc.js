// -----------------------
// Headers
// -----------------------

/**
 * @apiDefine AuthorizationHeader
 *
 * @apiHeader {String} Authorization      User's unique access-token.
 * @apiHeaderExample {json} Authorization header-Example:
 *   {
 *     "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *   }
 *
 **/

// -----------------------
// Error Responses
// -----------------------

/**
 * @apiDefine NotAuthorizedError
 *
 * @apiError (4xx) Unauthorized       The JWT is missing or not valid.
 *
 * @apiErrorExample Unauthorized-Response:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *    "message": "No authorization token was found"
 *   }
 * 
 */

 /** 
 * @apiDefine InternalServerError
 * 
 * @apiError (500) InternalServerError  server problem.
 * @apiErrorExample {json} 500 Error:
 *   HTTP/1.1 500 Not Found
 *   {
 *     "message": "Internal server error"
 *   }
 **/ 

/** 
 * @apiDefine BadRequest
 * 
 * @apiError (4xx) BadRequest           data verification error
 **/
