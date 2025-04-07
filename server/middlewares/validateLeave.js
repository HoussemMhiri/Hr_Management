const yup = require("yup");


const leaveSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(["sick", "paid", "exception"])
    .required("Leave type is required"),

  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().required("End date is required"),

  reason: yup.string().when("type", {
    is: "exception",
    then: (schema) => schema.required("Reason is required for exceptional leave").min(1),
    otherwise: (schema) => schema.optional(),
  }),
  daysCount: yup
    .number()
    .required("Days count is required")
    .min(1, "Days count must be at least 1")
});

const validateLeave = async (req, res, next) => {
  try {
    await leaveSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const errors = err.inner.map((e) => e.message);
    res.status(400).json({ msg: "Validation error", errors });
  }
};

module.exports = validateLeave;
