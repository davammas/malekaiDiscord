exports.power = {
  name: "Giant Smash",
  source: "Champion",
  type: "Debuff",
  cast_type: "Instant",
  duration: 15,
  cooldown: 0,
  targeting: "Cone",
  max_targets: 1,
  range: 5,
  next_chain: ["Massive Smash"],
  cost: {
    pips: 0,
    resource: 10
  },
  tooltip: "Strike in front of you for 102-138 + 120% Weapon Damage, generating 4 Rage if you hit.",
  icon: ""
};
