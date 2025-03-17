const Application = require("../models/application");
const asyncHandler = require("express-async-handler");
const CustomError = require("../errors/CustomError");
const Rescue = require("../models/rescue");

//create application
exports.createApplication = asyncHandler(async (req, res) => {
  const rescue = await Rescue.findOne({ slug: req.params.slug });

  if (!rescue) {
    throw new CustomError("Rescue not found", 404);
  }

  const application = new Application({
    applicantName: req.body.name,
    user: req.session.user.id,
    rescue: rescue._id,
    phoneNo: req.body.phoneNo,
    address: req.body.address,
    appointmentMode: req.body.preferredModeOfContact,
    introductionMessage: req.body.introductionMessage,
  });

  const result = await application.save();

  if (!result) {
    throw new CustomError("Error creating application", 500);
  }

  res.status(201).send({ message: "Application created successfully" });
});
