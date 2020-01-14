exports.signupValidator = (req, res, next) => {
 req.check("name", "Name is required").notEmpty();
 req.check("lastname", "Lastname is required").notEmpty();
 // email is not null, valid and normalized
 req.check("email", "Email must be between 3 to 32 characters")
     .matches(/.+\@.+\..+/)
     .withMessage("Invalid email")
     .isLength({
         min: 4,
         max: 2000
     });
 // check for password
 req.check("password")
     .notEmpty()
     .withMessage("Password is required")
     .isLength({ min: 6 })
     .withMessage("Password must contain at least 6 characters")
     .matches(/\d/)
     .withMessage("Password must contain a number");
 // check for errors
 const errors = req.validationErrors();
 // if error show the first one as they happen
 if (errors) {
     const firstError = errors.map(error => error.msg)[0];
     return res.status(422).json({ error: firstError });
 }
 // proceed to next middleware
 next();
};
