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
        landingPool = await hre.ethers.getContractAt("ILendingPool", "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9");
        landingPoolConfigurator = await hre.ethers.getContractAt("ILendingPoolConfigurator", "0x311Bb771e4F8952E6Da169b425E7e92d6Ac45756");

        const aTokenImplementationAddress = "0x541dcd3f00bcd1a683cc73e1b2a8693b602201f4";
        const vTokenImplementationAddress = "0xddde1fa049209bc24b69d5fa316a56efec918d79";
        const sTokenImplementationAddress = "0xed14b4e51b04d4d0211474a721f77c0817166c2f";
        const ethInterestRateAddress = "0xb8975328Aa52c00B9Ec1e11e518C4900f2e6C62a";

        await landingPoolConfigurator.initReserve(
            aTokenImplementationAddress, 
            sTokenImplementationAddress,
            vTokenImplementationAddress,
            18,
            ethInterestRateAddress
        )

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

        it("Correct admins", async () => {
            expect(await addressProvider.getPoolAdmin()).to.equal(admin.address);
            expect(await addressProvider.getEmergencyAdmin()).to.equal(admin.address);
        });

        it("Correct price oracle address", async () => {
            expect((await addressProvider.getPriceOracle()).toLowerCase()).to.equal(aaveOracle.target.toLowerCase());
        });
    });

    describe("Oracles", () => {
        it("correct weth address and price", async () => {
            expect(await aaveOracle.WETH()).to.equal(weth.target);
            expect(await aaveOracle.getAssetPrice(weth.target)).to.equal(ethers.parseEther("1"));
        });
    })
    describe("Landing pool", () => {
        it("correct deploy", async () => {
            expect(await addressProvider.getLendingPool()).to.equal(landingPool.target);
            expect(await landingPool.getAddressesProvider()).to.equal(addressProvider.target);
        });
    })
    describe("Landing pool configurator", () => {
        it("correct deploy", async () => {
            expect(await addressProvider.getLendingPoolConfigurator()).to.equal(landingPoolConfigurator.target);
        });
    })
    describe("ETH market", () => {
        before(async () => {
            const reserveData = await landingPool.getReserveData(weth.target);
            aWETH = await ethers.getContractAt("IAToken", reserveData[7]);

            await weth.connect(alice).deposit({value: ethers.parseEther("100")});
            expect(await weth.balanceOf(alice.address)).to.equal(ethers.parseEther("100"));

            depositAmount = ethers.parseEther("1");
        });

        it("should have correct treasury address in aToken", async () => {
            const treasury = await aWETH.RESERVE_TREASURY_ADDRESS();
            expect(treasury.toLowerCase()).to.equal("0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c".toLowerCase());
        });        

        it("could deposit weth and receive aWeth", async () => {
            await weth.connect(alice).approve(landingPool.target, depositAmount);
            
            await landingPool.connect(alice).deposit(
                weth.target,
                depositAmount,
                alice.address,
                0
            )

            expect(await aWETH.balanceOf(alice.address)).to.equal(depositAmount);
            expect(await weth.balanceOf(aWETH.target)).to.equal(depositAmount);
        });
        it("could withdraw weth", async () => {
            await weth.connect(alice).approve(landingPool.target, depositAmount);
            
            await landingPool.connect(alice).deposit(
                weth.target,
                depositAmount,
                alice.address,
                0
            )

            await aWETH.connect(alice).transfer(bob.address, depositAmount);

            await landingPool.connect(bob).withdraw(
                weth.target,
                depositAmount,
                bob.address
            );

            expect(await weth.balanceOf(bob.address)).to.equal(depositAmount);
            expect(await aWETH.balanceOf(bob.address)).to.equal(0);
        });
    });
});