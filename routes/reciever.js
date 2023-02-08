const { checkAuth,checkReceiver,checkHospital } = require("../middleware/middleware");
const Blood_request = require("../models/blood_request");
const Hospital = require("../models/hospital");
const Receiver = require("../models/reciever")

const router = require("express").Router();

router.post("/reviever/signup", async (req, res) => {
  try {
    const { email, password, confirmpassword } = req.body;
    let receiver = await Receiver.findOne({ email });
    if (receiver) {
      return res.status(400).json({ message: "user already exist" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "password doesnt match" });
    }

    
    receiver = await Receiver.create({email, password});
    res.status(200).json({receiver});
  } catch (error) {
    console.log(error);
  }
});

// reciever LOGIN
router.post('/reciever/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Receiver.findOne({email}).select('+password');

        if (!user) {
            return res.status(400). json({
                success: false,
                massage: "User does not exits"
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                massage: "Incorrect Password"
            })
        }

        const token = await user.generateToken();

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        res.status(200).cookie("token", token, options).json({
            success: true,
            user,
            token,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            massage: error.massage,
        })
    }
})
//6.  POST Endpoint to request a blood sample (Only accessible to receiver)
router.post('/reciever/request',checkReceiver,checkAuth,async(req,res)=>{
    try {
        const {email} = req.body
        const  hospitalName = await Hospital.findOne({email})
        const {name,age,blood_group} = req.body
        const request = await Blood_request.create({
            name,
            blood_group,
            age
        })
        hospitalName.blood_request.push(request)
        await hospitalName.save()
        res.status(200).json({request})
    } catch (error) {
        console.log(error);
    }
});
//7 . GET endpoint to get the list of all receivers who have requested a particular bloodgroup from its blood bank (Only accessible to respective hospital)
router.get('/reciever/request/:id',checkAuth,checkHospital,async(req,res)=>{
    try {
        const {id} = req.params;
        const request = await Hospital.find({_id:id}).populate('blood_request')
        res.status(200).json({request})
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;
