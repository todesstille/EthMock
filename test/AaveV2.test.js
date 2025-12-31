const { expect } = require("chai");
const hre = require("hardhat");
const {ethers} = hre;
const { SnapshotRestorer, takeSnapshot } = require('@nomicfoundation/hardhat-network-helpers');
const {deployAaveV2} = require("./helpers/deployAaveV2");

let snapshot;

describe("AaveV2", () => {
    before(async () => {
        [admin, alice, bob] = await hre.ethers.getSigners();

        await deployAaveV2(admin);

        weth = await hre.ethers.getContractAt("IWETH", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
        addressProvider = await hre.ethers.getContractAt("ILendingPoolAddressesProvider", "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5");
        aaveOracle = await hre.ethers.getContractAt("IAaveOracle", "0xa50ba011c48153de246e5192c8f9258a2ba79ca9");

    })

    beforeEach(async () => {
        snapshot = await takeSnapshot();
    })

    afterEach(async () => {
        await snapshot.restore();
    })

    describe("Address Provider", () => {
        it("correct weth contract", async () => {
            expect(await weth.name()).to.equal("Wrapped Ether");
            expect(await weth.symbol()).to.equal("WETH");
            expect(await weth.decimals()).to.equal(18);
        });

        it("Correct owner and marketId", async () => {
            expect(await addressProvider.owner()).to.equal(admin.address)
            expect(await addressProvider.getMarketId()).to.equal("Aave genesis market")
        });
    });

    describe("Oracles", () => {
        it("correct weth address and price", async () => {
            expect(await aaveOracle.WETH()).to.equal(weth.target);
            expect(await aaveOracle.getAssetPrice(weth.target)).to.equal(ethers.parseEther("1"));
        });
    })
});