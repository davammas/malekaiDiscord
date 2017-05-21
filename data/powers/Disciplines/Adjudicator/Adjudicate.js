exports.power = {
  name: "Adjudicate",
  source: "Adjudicator",
  type: "Melee Attack",
  cast_type: "Instant",
  duration: false,
  cooldown: 9,
  targeting: "Cone",
  max_targets: 1,
  range: 5,
  next_chain: ["Adjudicate2"],
  cost: {
    pips: false,
    resource: 10
  },
  tooltip: "Smash an enemy for 68-92 + 80% Weapon Damage.",
  icon: false
};
