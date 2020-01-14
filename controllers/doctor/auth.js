const Doctor = require("../../models/Doctor");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
        let doctorExists = await Doctor.findOne({ email: req.body.email });
        if (doctorExists)
            return res.status(403).json({
                error: "Email is taken!"
            });
        let doctor = new Doctor(req.body);
        doctor = await doctor.save();
        res
            .status(200)
            .json({
                msg: `Successfully Sign up.`
            });
   
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    let doctor = await Doctor.findByCredentials(email, password)
    doctor.salt = undefined
    doctor.password = undefined
    if (!doctor) {
        return res.status(400).json({
            error: "Doctor with that email does not exist."
        });
    }

    const payload = {
        _id: doctor.id,
        name: doctor.name,
        email: doctor.email
    };
    const token = jwt.sign(
        payload,
        process.env.JWT_SIGNIN_KEY,
        { expiresIn: "5h" }
    );

    return res.json({ token });
};

// authentication middleware
exports.auth = async (req, res, next) => {
    const token = req.header('x-auth-token');
    try {

        if (token) {
            const user = await parseToken(token)
            if (user._id) {
                const doctor = await Doctor.findById(user._id).select('-password -salt')
                if (doctor) {
                    req.doctor = doctor
                    return next();
                }
                throw 'Invalid User'
            }
            throw user.error
        }
        throw 'Token not found'
    } catch (error) {
        res.status(401).json({ error: error })
    }
}
function parseToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SIGNIN_KEY);
    } catch (error) {
        return ({ error: error.message });
    }
}

// has authorization middleware
exports.hasAuthorization = async (req, res, next) => {
    try {
        const sameDocotor = req.profile && req.doctor && req.profile._id.toString() === req.doctor._id.toString()
        const isAdmin = req.doctor && req.doctor.isAdmin && true
        if (sameDocotor || isAdmin) {
            return next();
        }
        throw 'User is not authorized to perform this action'
    } catch (error) {
        res.status(403).json({ error: error })
    }
}