const { network } = require("hardhat")
const {
  developmentChains,
  INITIAL_SUPPLY,
  networkConfig,
} = require("../helper-hardhat-config")
const { verify } = require("../helper-functions")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  const arguments = [INITIAL_SUPPLY]

  const ourToken = await deploy("OurToken", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  log(`ourToken was deployed at ${ourToken.address}`)

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...")
    await verify(ourToken.address, arguments)
  }
}

module.exports.tags = ["all", "ourToken"]
