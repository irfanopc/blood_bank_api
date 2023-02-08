
const router = require("express").Router();
const Blood_samples = require('../models/blood_samples');
const { checkHospital,checkAuth } = require("../middleware/middleware");
const Hospital = require("../models/hospital");
// hospital register account
router.post('/hospital/signup', async (req, res) => {
  try {
    const { email, password, confirmpassword,hospital_name } = req.body;
    let hospital = await Hospital.findOne({ email });
    if (hospital) {
      return res.status(400).json({ message: "user already exist" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "password doesnt match" });
    }
    hospital = await Hospital.create({email, password,hospital_name});
    res.status(200).json({hospital});
  } catch (error) {
    console.log(error);
  }
});
// hospital login
router.post('/hospital/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Hospital.findOne({email}).select('+password');

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
// hospital logout
router.get('/hospital/logout', async (req, res) => {
        try {
            
            res.status(200).cookie("token", null, {expires: new Date(Date.now()), httpOnly: true}).json({
                success: true,
                massage: "Logged Out",
            })
    
        } catch (error) {
            res.status(500).json({
                success: false,
                massage: error.massage,
            })
        
    }
})
//1. GET endpoint to get the list of all blood samples available in all hospitals (Public -Everyone can access) test case 1

router.get("/hospital/blood/bank",async(req,res)=>{
    try {
        const blood_bank = await Blood_samples.find({});
        res.status(200).json({blood_bank});
    } catch (error) {
        console.log(error);
    }
})
//2 . POST endpoint to add the blood sample info (Only accessible to respective hospital)
router.post("/hospital/post/bloodsample",checkAuth,checkHospital,async (req, res) => {
    try {
      const { email } = req.body;
      let user = await Hospital.findOne({ email });
      const { blood_group } = req.body;
      const blood_bank = await Blood_samples.create({ blood_group });
      user.blood_samples.push(blood_bank);
      await user.save();
      res.status(200).json({
        status: "Success",
        blood_bank,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//3.PUT endpoint to update the respective blood info (Only accessible to respective hospital)
router.put( "/hospital/post/bloodsample/:id",checkAuth,checkHospital,async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const { email } = req.body;
      const { blood_group } = req.body;
      const hospital = await Hospital.findOne({ email }).populate('blood_samples');
      if (hospital) {
        const blood_samples = hospital.blood_samples;
        const sampleIndex = blood_samples.findIndex(
          (sample) => sample._id == (id)
        );
        
        blood_samples[sampleIndex].blood_group = blood_group;
        console.log(blood_samples[sampleIndex]);
        //await hospital.save()
         res.status(200).json({
          message: "Blood sample updated successfully",
          blood_samples
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);
 
// 4. DELETE endpoint to delete the respective blood info (Only accessible to respective hospital)
router.delete("/hospital/post/bloodsample/:id", checkAuth,checkHospital,async (req, res) => {
    try {
      const { id } = req.params;
      const { email } = req.body;
      const hospital = await Hospital.findOne({ email }).populate('blood_samples');
      if (hospital) {
        const blood_samples = hospital.blood_samples;
        const sampleIndex = blood_samples.findIndex(
          (sample) => sample.id == (id)
        );
        //    blood_samples[sampleIndex].blood_group = blood_group
        blood_samples.splice(sampleIndex, 1);
        await hospital.save()
        return res.json({
          message: "Blood sample DELETED successfully",
          blood_samples,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);
//5 GET endpoint to get all the blood info that the hospital uploaded (Only accessible to Respective hospital)
router.get("/hospital/blood/bank/:id", checkAuth, async (req, res) => {
    try {
      const{id} = req.params
      const hospital = await Hospital.findOne({ _id : id }).populate('blood_samples');
      console.log(hospital);
      const blood_bank = hospital.blood_samples;
      res.status(200).json({ blood_bank });
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;
