const Candidate = require("../models/Candidate");

exports.create = (data) => Candidate.create(data);

exports.findPaginated = async ({ page, limit, search, status }) => {
  const query = {};
  if (status) query.status = status;
  if (search)
    query.$or = [
      { fullName: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { mobile: new RegExp(search, "i") },
    ];

  const [items, total] = await Promise.all([
    Candidate.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Candidate.countDocuments(query),
  ]);

  return { items, total };
};

exports.findById = (id) => Candidate.findById(id);

exports.update = (id, data) =>
  Candidate.findByIdAndUpdate(id, data, { new: true });

exports.stats = async () => {
  const agg = await Candidate.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  return agg;
};
