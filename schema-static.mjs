export default `
type Achievement {
  id: ID!
  name: String!
  description: String
  hidden: Boolean!
  playersCompletedPercent: Float!
  adjustedPlayersCompletedPercent: Float
  side: String
  normalizedSide: String
  rarity: String
  normalizedRarity: String
}

type Ammo {
  item: Item!
  weight: Float!
  caliber: String
  stackMaxSize: Int!
  tracer: Boolean!
  tracerColor: String
  ammoType: String!
  projectileCount: Int
  damage: Int!
  armorDamage: Int!
  fragmentationChance: Float!
  ricochetChance: Float!
  penetrationChance: Float!
  penetrationPower: Int!
  penetrationPowerDeviation: Float
  accuracy: Int @deprecated(reason: "Use accuracyModifier instead.")
  accuracyModifier: Float
  recoil: Int @deprecated(reason: "Use recoilModifier instead.")
  recoilModifier: Float
  initialSpeed: Float
  lightBleedModifier: Float!
  heavyBleedModifier: Float!
  staminaBurnPerDamage: Float
  #attributes: AttributeCollection!
}

type ArmorMaterial {
  id: String
  name: String
  destructibility: Float
  minRepairDegradation: Float
  maxRepairDegradation: Float
  explosionDestructibility: Float
  minRepairKitDegradation: Float
  maxRepairKitDegradation: Float
}

type AttributeThreshold {
  name: String!
  requirement: NumberCompare!
}

type Barter {
  id: ID!
  trader: Trader!
  level: Int!
  taskUnlock: Task
  requiredItems: [ContainedItem]!
  rewardItems: [ContainedItem]!
  source: String! @deprecated(reason: "Use trader and level instead.")
  sourceName: ItemSourceName! @deprecated(reason: "Use trader instead.")
  requirements: [PriceRequirement]! @deprecated(reason: "Use level instead.")
  buyLimit: Int
}

type BossSpawn {
  boss: MobInfo!
  spawnChance: Float!
  spawnLocations: [BossSpawnLocation]!
  escorts: [BossEscort]!
  spawnTime: Int
  spawnTimeRandom: Boolean
  spawnTrigger: String
  switch: MapSwitch
  name: String! @deprecated(reason: "Use boss.name instead.")
  normalizedName: String! @deprecated(reason: "Use boss.normalizedName instead.")
}

type BossEscort {
  boss: MobInfo!
  amount: [BossEscortAmount]
  name: String! @deprecated(reason: "Use boss.name instead.")
  normalizedName: String! @deprecated(reason: "Use boss.normalizedName instead.")
}

type BossEscortAmount {
  count: Int!
  chance: Float!
}

"""
The chances of spawning in a given location are 
very rough estimates and may be incaccurate
"""
type BossSpawnLocation {
  spawnKey: String!
  name: String!
  chance: Float!
}

type ContainedItem {
  item: Item!
  count: Float!
  quantity: Float!
  attributes: [ItemAttribute]
}

type Craft {
  id: ID!
  station: HideoutStation!
  level: Int!
  taskUnlock: Task
  duration: Int!
  requiredItems: [ContainedItem]!
  requiredQuestItems: [QuestItem]!
  rewardItems: [ContainedItem]!
  source: String! @deprecated(reason: "Use stationLevel instead.")
  sourceName: String! @deprecated(reason: "Use stationLevel instead.")
  requirements: [PriceRequirement]! @deprecated(reason: "Use stationLevel instead.")
}

type GameProperty {
  key: String!
  numericValue: Float
  stringValue: String
  arrayValue: [String]
  objectValue: String
}

type FleaMarket implements Vendor {
  name: String!
  normalizedName: String!
  minPlayerLevel: Int!
  enabled: Boolean!
  sellOfferFeeRate: Float!
  sellRequirementFeeRate: Float!
  foundInRaidRequired: Boolean
  reputationLevels: [FleaMarketReputationLevel]!
}

type FleaMarketReputationLevel {
  offers: Int!
  offersSpecialEditions: Int!
  minRep: Float!
  maxRep: Float!
}

enum GameMode {
  regular
  pve
}

type GoonReport {
  map: Map
  timestamp: String
}

type HealthEffect {
  bodyParts: [String]!
  effects: [String]!
  time: NumberCompare
}

type HealthPart {
  id: ID!
  max: Int!
  bodyPart: String!
}

type HideoutStation {
  id: ID!
  name: String!
  normalizedName: String!
  imageLink: String
  levels: [HideoutStationLevel]!
  tarkovDataId: Int
  "crafts is only available via the hideoutStations query."
  crafts: [Craft]!
}

type HideoutStationBonus {
  type: String!
  name: String!
  value: Float
  passive: Boolean
  production: Boolean
  slotItems: [Item]
  skillName: String
}

type HideoutStationLevel {
  id: ID!
  #name: String!
  level: Int!
  constructionTime: Int!
  description: String!
  itemRequirements: [RequirementItem]!
  stationLevelRequirements: [RequirementHideoutStationLevel]!
  skillRequirements: [RequirementSkill]!
  traderRequirements: [RequirementTrader]!
  tarkovDataId: Int
  "crafts is only available via the hideoutStations query."
  crafts: [Craft]!
  bonuses: [HideoutStationBonus]
}

type historicalPricePoint {
  price: Int
  priceMin: Int
  offerCount: Int
  offerCountMin: Int
  timestamp: String
}

type Item {
  id: ID!
  name: String
  normalizedName: String
  shortName: String
  description: String
  basePrice: Int!
  updated: String
  width: Int!
  height: Int!
  backgroundColor: String!
  iconLink: String
  gridImageLink: String
  baseImageLink: String
  inspectImageLink: String
  image512pxLink: String
  image8xLink: String
  wikiLink: String
  types: [ItemType]!
  avg24hPrice: Int
  properties: ItemProperties
  conflictingItems: [Item]
  conflictingSlotIds: [String]
  accuracyModifier: Float
  recoilModifier: Float
  ergonomicsModifier: Float
  hasGrid: Boolean
  blocksHeadphones: Boolean
  link: String
  lastLowPrice: Int
  changeLast48h: Float
  changeLast48hPercent: Float
  low24hPrice: Int
  high24hPrice: Int
  lastOfferCount: Int
  sellFor: [ItemPrice!]
  buyFor: [ItemPrice!]
  containsItems: [ContainedItem]
  category: ItemCategory
  categories: [ItemCategory]!
  bsgCategoryId: String
  handbookCategories: [ItemCategory]!
  weight: Float
  velocity: Float
  loudness: Int
  #discardLimit: Int
  usedInTasks: [Task]!
  receivedFromTasks: [Task]!
  bartersFor: [Barter]!
  bartersUsing: [Barter]!
  craftsFor: [Craft]!
  craftsUsing: [Craft]!
  "historicalPrices is only available via the item and items queries."
  historicalPrices: [historicalPricePoint]
  fleaMarketFee(price: Int, intelCenterLevel: Int, hideoutManagementLevel: Int, count: Int, requireAll: Boolean): Int
  categoryTop: ItemCategory @deprecated(reason: "No longer meaningful with inclusion of Item category.")
  translation(languageCode: LanguageCode): ItemTranslation @deprecated(reason: "Use the lang argument on queries instead.")
  traderPrices: [TraderPrice]! @deprecated(reason: "Use sellFor instead.")
  bsgCategory: ItemCategory @deprecated(reason: "Use category instead.")
  imageLink: String @deprecated(reason: "Use inspectImageLink instead.")
  imageLinkFallback: String! @deprecated(reason: "Fallback handled automatically by inspectImageLink.")
  iconLinkFallback: String! @deprecated(reason: "Fallback handled automatically by iconLink.")
  gridImageLinkFallback: String! @deprecated(reason: "Fallback handled automatically by gridImageLink.")
}

interface ItemArmorSlot {
  #id: ID!
  nameId: String
  zones: [String]
}

type ItemArmorSlotLocked implements ItemArmorSlot {
  nameId: String
  name: String
  bluntThroughput: Float
  class: Int
  durability: Int
  repairCost: Int
  speedPenalty: Float
  turnPenalty: Float
  ergoPenalty: Float
  material: ArmorMaterial
  zones: [String]
  armorType: String
  baseValue: Int
}

type ItemArmorSlotOpen implements ItemArmorSlot {
  nameId: String
  name: String
  zones: [String]
  allowedPlates: [Item]
}

type ItemAttribute {
  type: String!
  name: String!
  value: String
}

type ItemCategory {
  id: ID!
  name: String!
  normalizedName: String!
  parent: ItemCategory
  children: [ItemCategory]
}

type ItemFilters {
  allowedCategories: [ItemCategory]!
  allowedItems: [Item]!
  excludedCategories: [ItemCategory]!
  excludedItems: [Item]!
}

type ItemPrice {
  vendor: Vendor!
  price: Int
  currency: String
  currencyItem: Item
  priceRUB: Int
  source: ItemSourceName @deprecated(reason: "Use vendor instead.")
  requirements: [PriceRequirement]! @deprecated(reason: "Use vendor instead.")
}

type ItemPropertiesAmmo {
  caliber: String
  stackMaxSize: Int
  tracer: Boolean
  tracerColor: String
  ammoType: String
  projectileCount: Int
  damage: Int
  armorDamage: Int
  fragmentationChance: Float
  ricochetChance: Float
  penetrationChance: Float
  penetrationPower: Int
  penetrationPowerDeviation: Float
  accuracy: Int @deprecated(reason: "Use accuracyModifier instead.")
  accuracyModifier: Float
  recoil: Float @deprecated(reason: "Use recoilModifier instead.")
  recoilModifier: Float
  initialSpeed: Float
  lightBleedModifier: Float
  heavyBleedModifier: Float
  durabilityBurnFactor: Float
  heatFactor: Float
  staminaBurnPerDamage: Float
  ballisticCoeficient: Float
  bulletDiameterMilimeters: Float
  bulletMassGrams: Float
  misfireChance: Float
  failureToFeedChance: Float
}

type ItemPropertiesArmor {
  class: Int
  durability: Int
  repairCost: Int
  speedPenalty: Float
  turnPenalty: Float
  ergoPenalty: Float
  zones: [String]
  material: ArmorMaterial
  armorType: String
  bluntThroughput: Float
  armorSlots: [ItemArmorSlot]
}

type ItemPropertiesArmorAttachment {
  class: Int
  durability: Int
  repairCost: Int
  speedPenalty: Float
  turnPenalty: Float
  ergoPenalty: Float
  zones: [String]
  material: ArmorMaterial
  armorType: String
  blindnessProtection: Float
  bluntThroughput: Float
  slots: [ItemSlot]
  headZones: [String] @deprecated(reason: "Use zones instead.")
}

type ItemPropertiesBackpack {
  capacity: Int
  grids: [ItemStorageGrid]
  speedPenalty: Float
  turnPenalty: Float
  ergoPenalty: Float
  pouches: [ItemStorageGrid] @deprecated(reason: "Use grids instead.")
}

type ItemPropertiesBarrel {
  ergonomics: Float
  recoil: Float @deprecated(reason: "Use recoilModifier instead.")
  recoilModifier: Float
  accuracyModifier: Float @deprecated(reason: "Use centerOfImpact, deviationCurve, and deviationMax instead.")
  centerOfImpact: Float
  deviationCurve: Float
  deviationMax: Float
  slots: [ItemSlot]
}

type ItemPropertiesChestRig {
  class: Int
  durability: Int
  repairCost: Int
  speedPenalty: Float
  turnPenalty: Float
  ergoPenalty: Float
  zones: [String]
  material: ArmorMaterial
  capacity: Int
  grids: [ItemStorageGrid]
  pouches: [ItemStorageGrid] @deprecated(reason: "Use grids instead.")
  armorType: String
  bluntThroughput: Float
  armorSlots: [ItemArmorSlot]
}

type ItemPropertiesContainer {
  capacity: Int
  grids: [ItemStorageGrid]
}

type ItemPropertiesFoodDrink {
  energy: Int
  hydration: Int
  units: Int
  stimEffects: [StimEffect]!
}

type ItemPropertiesGlasses {
  class: Int
  durability: Int
  repairCost: Int
  blindnessProtection: Float
  #speedPenalty: Float
  #turnPenalty: Float
  #ergoPenalty: Float
  material: ArmorMaterial
  bluntThroughput: Float
}

type ItemPropertiesGrenade {
  type: String
  fuse: Float
  minExplosionDistance: Int
  maxExplosionDistance: Int
  fragments: Int
  contusionRadius: Int
}

type ItemPropertiesHeadphone {
  ambientVolume: Int
  compressorAttack: Int
  compressorGain: Int
  compressorRelease: Int
  compressorThreshold: Int
  compressorVolume: Int
  cutoffFrequency: Int
  distanceModifier: Float
  distortion: Float
  dryVolume: Int
  highFrequencyGain: Float
  resonance: Float
}

type ItemPropertiesHeadwear {
  slots: [ItemSlot]
}

type ItemPropertiesHelmet {
  class: Int
  durability: Int
  repairCost: Int
  speedPenalty: Float
  turnPenalty: Float
  ergoPenalty: Float
  headZones: [String]
  material: ArmorMaterial
  deafening: String
  blocksHeadset: Boolean
  blindnessProtection: Float
  slots: [ItemSlot]
  ricochetX: Float
  ricochetY: Float
  ricochetZ: Float
  armorType: String
  bluntThroughput: Float
  armorSlots: [ItemArmorSlot]
}

type ItemPropertiesKey {
  uses: Int
}

type ItemPropertiesMagazine {
  ergonomics: Float
  recoil: Float @deprecated(reason: "Use recoilModifier instead.")
  recoilModifier: Float
  capacity: Int
  loadModifier: Float
  ammoCheckModifier: Float
  malfunctionChance: Float
  slots: [ItemSlot]
  allowedAmmo: [Item]
}

type ItemPropertiesMedicalItem {
  uses: Int
  useTime: Int
  cures: [String]
}

type ItemPropertiesMedKit {
  hitpoints: Int
  useTime: Int
  maxHealPerUse: Int
  cures: [String]
  hpCostLightBleeding: Int
  hpCostHeavyBleeding: Int
}

type ItemPropertiesMelee {
  slashDamage: Int
  stabDamage: Int
  hitRadius: Float
}

type ItemPropertiesNightVision {
  intensity: Float
  noiseIntensity: Float
  noiseScale: Float
  diffuseIntensity: Float
}

type ItemPropertiesPainkiller {
  uses: Int
  useTime: Int
  cures: [String]
  painkillerDuration: Int
  energyImpact: Int
  hydrationImpact: Int
}

type ItemPropertiesPreset {
  baseItem: Item!
  ergonomics: Float
  recoilVertical: Int
  recoilHorizontal: Int
  moa: Float
  default: Boolean
}

type ItemPropertiesResource {
  units: Int
}

type ItemPropertiesScope {
  ergonomics: Float
  sightModes: [Int]
  recoil: Float @deprecated(reason: "Use recoilModifier instead.")
  sightingRange: Int
  recoilModifier: Float
  slots: [ItemSlot]
  zoomLevels: [[Float]]
}

type ItemPropertiesStim {
  useTime: Int
  cures: [String]
  stimEffects: [StimEffect]!
}

type ItemPropertiesSurgicalKit {
  uses: Int
  useTime: Int
  cures: [String]
  minLimbHealth: Float
  maxLimbHealth: Float
}

type ItemPropertiesWeapon {
  caliber: String
  defaultAmmo: Item
  effectiveDistance: Int
  ergonomics: Float
  fireModes: [String]
  fireRate: Int
  maxDurability: Int
  recoilVertical: Int
  recoilHorizontal: Int
  repairCost: Int
  sightingRange: Int
  centerOfImpact: Float
  deviationCurve: Float
  recoilDispersion: Int
  recoilAngle: Int
  cameraRecoil: Float
  cameraSnap: Float
  deviationMax: Float
  convergence: Float
  defaultWidth: Int
  defaultHeight: Int
  defaultErgonomics: Float,
  defaultRecoilVertical: Int
  defaultRecoilHorizontal: Int
  defaultWeight: Float
  defaultPreset: Item
  presets: [Item]
  slots: [ItemSlot]
  allowedAmmo: [Item]
}

type ItemPropertiesWeaponMod {
  ergonomics: Float
  recoil: Float @deprecated(reason: "Use recoilModifier instead.")
  recoilModifier: Float
  accuracyModifier: Float
  slots: [ItemSlot]
}

union ItemProperties = 
  ItemPropertiesAmmo | 
  ItemPropertiesArmor | 
  ItemPropertiesArmorAttachment | 
  ItemPropertiesBackpack | 
  ItemPropertiesBarrel | 
  ItemPropertiesChestRig | 
  ItemPropertiesContainer | 
  ItemPropertiesFoodDrink | 
  ItemPropertiesGlasses | 
  ItemPropertiesGrenade | 
  ItemPropertiesHeadwear | 
  ItemPropertiesHeadphone | 
  ItemPropertiesHelmet | 
  ItemPropertiesKey | 
  ItemPropertiesMagazine | 
  ItemPropertiesMedicalItem | 
  ItemPropertiesMelee | 
  ItemPropertiesMedKit | 
  ItemPropertiesNightVision | 
  ItemPropertiesPainkiller | 
  ItemPropertiesPreset |
  ItemPropertiesResource | 
  ItemPropertiesScope | 
  ItemPropertiesSurgicalKit | 
  ItemPropertiesWeapon | 
  ItemPropertiesWeaponMod |
  ItemPropertiesStim

type ItemSlot {
  id: ID!
  name: String!
  nameId: String!
  filters: ItemFilters
  required: Boolean
}

enum ItemSourceName {
  prapor
  therapist
  fence
  skier
  peacekeeper
  mechanic
  ragman
  jaeger
  ref
  fleaMarket
}

type ItemStorageGrid {
  width: Int!
  height: Int!
  filters: ItemFilters!
}

type Lock {
  lockType: String
  key: Item
  needsPower: Boolean
  position: MapPosition
  outline: [MapPosition]
  top: Float
  bottom: Float
  #rotation: MapPosition
  #center: MapPosition
  #size: MapPosition
  #terrainElevation: Float
}

type LootContainer {
  id: ID!
  name: String!
  normalizedName: String!
}

type LootContainerPosition {
  lootContainer: LootContainer
  position: MapPosition
}

type Map {
  id: ID!
  tarkovDataId: ID
  name: String!
  normalizedName: String!
  wiki: String
  description: String
  enemies: [String]
  raidDuration: Int
  players: String
  bosses: [BossSpawn]!
  nameId: String
  accessKeys: [Item]!
  accessKeysMinPlayerLevel: Int
  minPlayerLevel: Int
  maxPlayerLevel: Int
  spawns: [MapSpawn]
  extracts: [MapExtract]
  transits: [MapTransit]
  locks: [Lock]
  switches: [MapSwitch]
  hazards: [MapHazard]
  lootContainers: [LootContainerPosition]
  stationaryWeapons: [StationaryWeaponPosition]
  artillery: MapArtillerySettings
  #svg: MapSvg
}

type MapArtillerySettings {
  zones: [MapArtilleryZone]
}

type MapArtilleryZone {
  position: MapPosition
  outline: [MapPosition]
  top: Float
  bottom: Float
  radius: Float @deprecated(reason: "Use outline instead.")
}

type MapExtract {
  id: ID!
  name: String
  faction: String
  switches: [MapSwitch]
  position: MapPosition
  outline: [MapPosition]
  top: Float
  bottom: Float
  #rotation: MapPosition
  #center: MapPosition
  #size: MapPosition
  #terrainElevation: Float
}

type MapHazard {
  hazardType: String
  name: String
  position: MapPosition
  outline: [MapPosition]
  top: Float
  bottom: Float
  #rotation: MapPosition
  #center: MapPosition
  #size: MapPosition
  #terrainElevation: Float
}

type MapWithPosition {
  map: Map
  positions: [MapPosition]
}

type MapPosition {
  x: Float!
  y: Float!
  z: Float!
}

type MapSpawn {
  zoneName: String
  position: MapPosition!
  sides: [String]
  categories: [String]
}

#type MapSvg {
#  file: String
#  floors: [String]
#  defaultFloor: String
#}

type MapSwitch {
  id: ID!
  name: String
  #tip: String
  #extractTip: String
  #door: Lock
  #extract: MapExtract
  switchType: String
  activatedBy: MapSwitch
  activates: [MapSwitchOperation]
  position: MapPosition
}

type MapSwitchOperation {
  operation: String
  target: MapSwitchTarget
}

union MapSwitchTarget = MapSwitch | MapExtract

type MapTransit {
  id: ID!
  description: String
  conditions: String
  map: Map
  position: MapPosition
  outline: [MapPosition]
  top: Float
  bottom: Float
}

type Mastering {
  id: ID!
  weapons: [Item]!
  level2: Int
  level3: Int
}

type MobInfo {
  id: ID!
  name: String!
  normalizedName: String!
  health: [HealthPart]
  imagePortraitLink: String
  imagePosterLink: String
  "equipment and items are estimates and may be inaccurate."
  equipment: [ContainedItem]!
  items: [Item]!
}

type NumberCompare {
  compareMethod: String!
  value: Float!
}

type OfferUnlock {
  id: ID!
  trader: Trader!
  level: Int!
  item: Item!
}

type PlayerLevel {
  level: Int!
  exp: Int!
}

type PriceRequirement {
  type: RequirementType!
  value: Int
  stringValue: String
}

type QuestItem {
  id: ID
  name: String!
  shortName: String
  description: String
  normalizedName: String
  width: Int
  height: Int
  iconLink: String
  gridImageLink: String
  baseImageLink: String
  inspectImageLink: String
  image512pxLink: String
  image8xLink: String
}

type RequirementHideoutStationLevel {
  id: ID
  station: HideoutStation!
  level: Int!
}

type RequirementItem {
  id: ID
  item: Item!
  count: Int!
  quantity: Int!
  attributes: [ItemAttribute]
}

type RequirementSkill {
  id: ID
  name: String!
  skill: Skill!
  level: Int!
}

type RequirementTask {
  id: ID
  task: Task!
}

type RequirementTrader {
  id: ID
  trader: Trader!
  requirementType: String
  compareMethod: String
  value: Int
  level: Int @deprecated(reason: "Use value instead.")
}

enum RequirementType {
  playerLevel
  loyaltyLevel
  questCompleted
  stationLevel
}

type ServerStatus {
  generalStatus: Status
  currentStatuses: [Status]
  messages: [StatusMessage]
}

type Skill {
  id: ID
  name: String
}

type SkillLevel {
  skill: Skill!
  name: String!
  level: Float!
}

type StationaryWeapon {
  id: ID
  name: String
  shortName: String
}

type StationaryWeaponPosition {
  stationaryWeapon: StationaryWeapon
  position: MapPosition
}

type Status {
  name: String!
  message: String
  status: Int!
  statusCode: String!
}

enum StatusCode {
  OK
  Updating
  Unstable
  Down
}

type StatusMessage {
  content: String!
  time: String!
  type: Int!
  solveTime: String
  statusCode: String!
}

type StimEffect {
  type: String!
  chance: Float!
  delay: Int!
  duration: Int!
  value: Float!
  percent: Boolean!
  skillName: String
  skill: Skill
}

type Task {
  id: ID
  tarkovDataId: Int
  name: String!
  normalizedName: String!
  trader: Trader!
  #locationName: String!
  map: Map
  experience: Int!
  wikiLink: String
  taskImageLink: String
  minPlayerLevel: Int
  taskRequirements: [TaskStatusRequirement]!
  traderRequirements: [RequirementTrader]!
  availableDelaySecondsMin: Int
  availableDelaySecondsMax: Int
  objectives: [TaskObjective]!
  startRewards: TaskRewards
  finishRewards: TaskRewards
  failConditions: [TaskObjective]!
  failureOutcome: TaskRewards
  restartable: Boolean
  factionName: String
  neededKeys: [TaskKey] @deprecated(reason: "Use requiredKeys on objectives instead.")
  kappaRequired: Boolean
  lightkeeperRequired: Boolean
  descriptionMessageId: String
  startMessageId: String
  successMessageId: String
  failMessageId: String
  traderLevelRequirements: [RequirementTrader]! @deprecated(reason: "Use traderRequirements instead.")
}

type TaskKey {
  keys: [Item]!
  map: Map
}

interface TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
}

type TaskObjectiveBasic implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  zones: [TaskZone]
  requiredKeys: [[Item]]
}

type TaskObjectiveBuildItem implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  item: Item!
  containsAll: [Item]!
  containsCategory: [ItemCategory]!
  attributes: [AttributeThreshold]!
  containsOne: [Item]! @deprecated(reason: "Use containsCategory instead.")
}

type TaskObjectiveExperience implements TaskObjective {
  id: ID
  type: String!
  description: String!
  count: Int!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  healthEffect: HealthEffect!
}

type TaskObjectiveExtract implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  exitStatus: [String]!
  exitName: String
  zoneNames: [String]!
  count: Int!
  requiredKeys: [[Item]]
}

type TaskObjectiveItem implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  items: [Item]!
  count: Int!
  foundInRaid: Boolean!
  dogTagLevel: Int
  maxDurability: Int
  minDurability: Int
  zones: [TaskZone]
  requiredKeys: [[Item]]
  item: Item! @deprecated(reason: "Use items instead.")
}

type TaskObjectiveMark implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  markerItem: Item!
  zones: [TaskZone]
  requiredKeys: [[Item]]
}

type TaskObjectivePlayerLevel implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  playerLevel: Int!
}

type TaskObjectiveQuestItem implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  questItem: QuestItem!
  count: Int!
  possibleLocations: [MapWithPosition]
  zones: [TaskZone]
  requiredKeys: [[Item]]
}

type TaskObjectiveShoot implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  targetNames: [String]!
  count: Int!
  shotType: String!
  zoneNames: [String]!
  bodyParts: [String]!
  usingWeapon: [Item]
  usingWeaponMods: [[Item]]
  wearing: [[Item]]
  notWearing: [Item]
  distance: NumberCompare
  playerHealthEffect: HealthEffect
  enemyHealthEffect: HealthEffect
  timeFromHour: Int
  timeUntilHour: Int
  zones: [TaskZone]
  requiredKeys: [[Item]]
  target: String! @deprecated(reason: "Use targetNames instead.")
}

type TaskObjectiveSkill implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  skillLevel: SkillLevel!
}

type TaskObjectiveTaskStatus implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  task: Task!
  status: [String]!
}

type TaskObjectiveTraderLevel implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  trader: Trader!
  level: Int!
}

type TaskObjectiveTraderStanding implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  trader: Trader!
  compareMethod: String!
  value: Int!
}

type TaskObjectiveUseItem implements TaskObjective {
  id: ID
  type: String!
  description: String!
  #locationNames: [String]!
  maps: [Map]!
  optional: Boolean!
  useAny: [Item]!
  compareMethod: String!
  count: Int!
  zoneNames: [String]!
  zones: [TaskZone]
  requiredKeys: [[Item]]
}

type TaskRewards {
  traderStanding: [TraderStanding]!
  items: [ContainedItem]!
  offerUnlock: [OfferUnlock]!
  skillLevelReward: [SkillLevel]!
  traderUnlock: [Trader]!
  craftUnlock: [Craft]!
}

type TaskStatusRequirement {
  task: Task!
  status: [String]!
}

type TaskZone {
  id: ID!
  map: Map
  position: MapPosition
  outline: [MapPosition]
  top: Float
  bottom: Float
  #rotation: MapPosition
  #center: MapPosition
  #size: MapPosition
  #terrainElevation: Float
}

type Trader {
  id: ID!
  name: String!
  normalizedName: String!
  description: String
  resetTime: String
  currency: Item!
  discount: Float!
  levels: [TraderLevel!]!
  reputationLevels: [TraderReputationLevel]!
  "barters and cashOffers are only available via the traders query."
  barters: [Barter]!
  cashOffers: [TraderCashOffer]!
  imageLink: String
  image4xLink: String
  tarkovDataId: Int
}

type TraderLevel {
  id: ID!
  #name: String!
  level: Int!
  requiredPlayerLevel: Int!
  requiredReputation: Float!
  requiredCommerce: Int!
  payRate: Float!
  insuranceRate: Float
  repairCostMultiplier: Float
  "barters and cashOffers are only available via the traders query."
  barters: [Barter]!
  cashOffers: [TraderCashOffer]!
  imageLink: String
  image4xLink: String
}

type TraderCashOffer {
  item: Item!
  minTraderLevel: Int
  price: Int
  currency: String
  currencyItem: Item
  priceRUB: Int
  #updated: String
  taskUnlock: Task
  buyLimit: Int
}

enum TraderName {
  prapor
  therapist
  fence
  skier
  peacekeeper
  mechanic
  ragman
  jaeger
  ref
}

type TraderOffer implements Vendor {
  name: String!
  normalizedName: String!
  trader: Trader!
  #traderLevel: TraderLevel!
  minTraderLevel: Int
  taskUnlock: Task
  buyLimit: Int
}

union TraderReputationLevel = TraderReputationLevelFence

type TraderReputationLevelFence {
  minimumReputation: Int!
  scavCooldownModifier: Float
  scavCaseTimeModifier: Float
  extractPriceModifier: Float
  scavFollowChance: Float
  scavEquipmentSpawnChanceModifier: Float
  priceModifier: Float
  hostileBosses: Boolean
  hostileScavs: Boolean
  scavAttackSupport: Boolean
  availableScavExtracts: Int
  btrEnabled: Boolean
  btrDeliveryDiscount: Int
  btrDeliveryGridSize: MapPosition
  btrTaxiDiscount: Int
  btrCoveringFireDiscount: Int
}

type TraderStanding {
  trader: Trader!
  standing: Float!
}

interface Vendor {
  name: String!
  normalizedName: String!
}
#union Vendor = TraderOffer | FleaMarket

type Query {
  achievements(lang: LanguageCode, limit: Int, offset: Int): [Achievement]!
  ammo(lang: LanguageCode, gameMode: GameMode, limit: Int, offset: Int): [Ammo]
  archivedItemPrices(id: ID!, limit: Int, offset: Int): [historicalPricePoint]!
  barters(lang: LanguageCode, gameMode: GameMode, limit: Int, offset: Int): [Barter]
  bosses(lang: LanguageCode, gameMode: GameMode, name: [String!], limit: Int, offset: Int): [MobInfo]
  crafts(lang: LanguageCode, gameMode: GameMode, limit: Int, offset: Int): [Craft]
  hideoutStations(lang: LanguageCode, gameMode: GameMode, limit: Int, offset: Int): [HideoutStation]!
  historicalItemPrices(id: ID!, days: Int, lang: LanguageCode, gameMode: GameMode, limit: Int, offset: Int): [historicalPricePoint]!
  item(id: ID, normalizedName: String, lang: LanguageCode, gameMode: GameMode): Item
  items(ids: [ID], name: String, names: [String], type: ItemType, types: [ItemType], categoryNames: [ItemCategoryName], handbookCategoryNames: [HandbookCategoryName] bsgCategoryId: String, bsgCategoryIds: [String], bsgCategory: String, lang: LanguageCode, gameMode: GameMode, limit: Int, offset: Int): [Item]!
  itemPrices(id: ID!, limit: Int, offset: Int): [historicalPricePoint]!
  itemCategories(lang: LanguageCode, limit: Int, offset: Int): [ItemCategory]!
  goonReports(lang: LanguageCode, gameMode: GameMode, limit: Int, ofset: Int): [GoonReport]!
  handbookCategories(lang: LanguageCode, limit: Int, offset: Int): [ItemCategory]!
  lootContainers(lang: LanguageCode, limit: Int, offset: Int): [LootContainer]
  maps(lang: LanguageCode, gameMode: GameMode, name: [String!], enemies: [String!], limit: Int, offset: Int): [Map]!
  questItems(lang: LanguageCode): [QuestItem]
  stationaryWeapons(lang: LanguageCode, limit: Int, offset: Int): [StationaryWeapon]
  status: ServerStatus!
  task(id: ID!, lang: LanguageCode, gameMode: GameMode): Task
  tasks(faction: String, lang: LanguageCode, gameMode: GameMode, limit: Int, offset: Int): [Task]!
  traders(lang: LanguageCode, gameMode: GameMode, limit: Int, offset: Int): [Trader]!
  fleaMarket(lang: LanguageCode, gameMode: GameMode): FleaMarket!
  armorMaterials(lang: LanguageCode): [ArmorMaterial]!
  playerLevels: [PlayerLevel]!
  skills(lang: LanguageCode): [Skill]!
  mastering(lang: LanguageCode): [Mastering]!
  hideoutModules: [HideoutModule] @deprecated(reason: "Use hideoutStations instead.")
  itemsByIDs(ids: [ID]!): [Item] @deprecated(reason: "Use items instead.")
  itemsByType(type: ItemType!): [Item]! @deprecated(reason: "Use items instead.")
  itemsByName(name: String!): [Item]! @deprecated(reason: "Use items instead.")
  itemByNormalizedName(normalizedName: String!): Item @deprecated(reason: "Use item instead.")
  itemsByBsgCategoryId(bsgCategoryId: String!): [Item]! @deprecated(reason: "Use items instead.")
  quests: [Quest] @deprecated(reason: "Use tasks instead.")
  traderResetTimes: [TraderResetTime] @deprecated(reason: "Use traders instead.") 
}

"""
The below types are all deprecated and may not return current data.
ItemTranslation has been replaced with the lang argument on all queries
"""
type ItemTranslation {
  name: String @deprecated(reason: "Use the lang argument on queries instead.")
  shortName: String @deprecated(reason: "Use the lang argument on queries instead.")
  description: String @deprecated(reason: "Use the lang argument on queries instead.")
}

"""
HideoutModule has been replaced with HideoutStation.
"""
type HideoutModule {
  id: Int @deprecated(reason: "Use HideoutStation type instead.")
  name: String @deprecated(reason: "Use HideoutStation type instead.")
  level: Int
  itemRequirements: [ContainedItem]!
  moduleRequirements: [HideoutModule]!
}

"""
Quest has been replaced with Task.
"""
type Quest {
  id: String! @deprecated(reason: "Use Task type instead.")
  requirements: QuestRequirement @deprecated(reason: "Use Task type instead.")
  giver: Trader! @deprecated(reason: "Use Task type instead.")
  turnin: Trader! @deprecated(reason: "Use Task type instead.")
  title: String! @deprecated(reason: "Use Task type instead.")
  wikiLink: String! @deprecated(reason: "Use Task type instead.")
  exp: Int! @deprecated(reason: "Use Task type instead.")
  unlocks: [String]! @deprecated(reason: "Use Task type instead.")
  reputation: [QuestRewardReputation!] @deprecated(reason: "Use Task type instead.")
  objectives: [QuestObjective]! @deprecated(reason: "Use Task type instead.")
}

"""
QuestObjective has been replaced with TaskObjective.
"""
type QuestObjective {
  id: String @deprecated(reason: "Use Task type instead.")
  type: String! @deprecated(reason: "Use Task type instead.")
  target: [String!] @deprecated(reason: "Use Task type instead.")
  targetItem: Item @deprecated(reason: "Use Task type instead.")
  number: Int @deprecated(reason: "Use Task type instead.")
  location: String @deprecated(reason: "Use Task type instead.")
}

"""
QuestRequirement has been replaced with TaskRequirement.
"""
type QuestRequirement {
  level: Int @deprecated(reason: "Use Task type instead.")
  quests: [[Int]]! @deprecated(reason: "Use Task type instead.")
  prerequisiteQuests: [[Quest]]! @deprecated(reason: "Use Task type instead.")
}

type QuestRewardReputation {
  trader: Trader! @deprecated(reason: "Use Task type instead.")
  amount: Float! @deprecated(reason: "Use Task type instead.")
}

"""
TraderPrice is deprecated and replaced with ItemPrice.
"""
type TraderPrice {
  price: Int! @deprecated(reason: "Use item.buyFor instead.")
  currency: String! @deprecated(reason: "Use item.buyFor instead.")
  priceRUB: Int! @deprecated(reason: "Use item.buyFor instead.")
  trader: Trader! @deprecated(reason: "Use item.buyFor instead.")
}

"""
TraderResetTime is deprecated and replaced with Trader.
"""
type TraderResetTime {
  name: String @deprecated(reason: "Use Trader.name type instead.")
  resetTimestamp: String @deprecated(reason: "Use Trader.resetTime type instead.")
}
`;
